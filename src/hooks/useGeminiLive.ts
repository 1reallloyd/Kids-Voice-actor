import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CHARACTER_ROLES,
  LANGUAGE_PROFILES,
  getStarterScript,
  type CharacterRole,
  type CharacterRoleId,
  type LanguageCode,
  type OrbState,
  type ScriptCard,
  type TranscriptEntry,
  type VoiceName,
} from '../types/voice';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'welcoming'
  | 'live'
  | 'error';

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function downsampleAndEncodePcm16(
  inputData: Float32Array,
  inputSampleRate: number,
  targetSampleRate = 16000
): string {
  let samples = inputData;
  if (inputSampleRate !== targetSampleRate) {
    const ratio = inputSampleRate / targetSampleRate;
    const outputLength = Math.floor(inputData.length / ratio);
    const resampled = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const srcIndex = i * ratio;
      const lower = Math.floor(srcIndex);
      const upper = Math.min(lower + 1, inputData.length - 1);
      const frac = srcIndex - lower;
      resampled[i] = inputData[lower] * (1 - frac) + inputData[upper] * frac;
    }
    samples = resampled;
  }

  const pcm16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    pcm16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  return uint8ArrayToBase64(new Uint8Array(pcm16.buffer));
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function useGeminiLive() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(
    null
  );
  const [micError, setMicError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeRoleId, setActiveRoleId] =
    useState<CharacterRoleId>('narrator');
  const [activeVoice, setActiveVoice] = useState<VoiceName>('Zephyr');
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [activeMood, setActiveMood] = useState<string>('Warm & Expressive');
  const [activeScriptCard, setActiveScriptCard] = useState<ScriptCard>(
    CHARACTER_ROLES[0].starterScript
  );
  const [starCount, setStarCount] = useState(0);
  const [lastPraise, setLastPraise] = useState<string | null>(null);
  const [welcomeText, setWelcomeText] = useState('');
  const [welcomeFinished, setWelcomeFinished] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const isMutedRef = useRef(false);
  const allowMicStreamingRef = useRef(false);
  const isWelcomePhaseRef = useRef(true);
  const hasReceivedWelcomeAudioRef = useRef(false);
  const welcomeTurnDoneRef = useRef(false);
  const cheeringTimeoutRef = useRef<number | null>(null);
  const currentRoleIdRef = useRef<CharacterRoleId>('narrator');
  const currentLanguageRef = useRef<LanguageCode>('en');

  const clearAudioQueue = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // Ignore already stopped sources
      }
    }
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const triggerCheering = useCallback((praise?: string) => {
    setOrbState('cheering');
    setStarCount((prev) => prev + 1);
    if (praise) {
      setLastPraise(praise);
    }
    if (cheeringTimeoutRef.current) {
      window.clearTimeout(cheeringTimeoutRef.current);
    }
    cheeringTimeoutRef.current = window.setTimeout(() => {
      setOrbState(activeSourcesRef.current.size > 0 ? 'speaking' : 'idle');
    }, 3200);
  }, []);

  const appendTranscriptChunk = useCallback(
    (speaker: 'user' | 'sunny', chunk: string) => {
      if (!chunk) return;
      setTranscripts((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.speaker === speaker) {
          const needsSpace =
            last.text.length > 0 &&
            !last.text.endsWith(' ') &&
            !chunk.startsWith(' ') &&
            !/^[.,!?']/.test(chunk);
          const updated: TranscriptEntry = {
            ...last,
            text: last.text + (needsSpace ? ' ' : '') + chunk,
          };
          return [...prev.slice(0, -1), updated];
        }
        return [
          ...prev,
          {
            id: `${speaker}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            speaker,
            text: chunk.trimStart(),
            roleId: speaker === 'sunny' ? currentRoleIdRef.current : undefined,
            timestamp: formatTime(),
          },
        ];
      });
    },
    []
  );

  const finalizeWelcomeIfReady = useCallback(() => {
    if (
      isWelcomePhaseRef.current &&
      hasReceivedWelcomeAudioRef.current &&
      welcomeTurnDoneRef.current &&
      activeSourcesRef.current.size === 0
    ) {
      isWelcomePhaseRef.current = false;
      allowMicStreamingRef.current = true;
      setWelcomeFinished(true);
      setConnectionStatus('live');
    }
  }, []);

  const playAudioChunk = useCallback(
    (base64Audio: string) => {
      const outputCtx = outputCtxRef.current;
      const outputAnalyser = outputAnalyserRef.current;
      if (!outputCtx || !outputAnalyser) return;

      if (outputCtx.state === 'suspended') {
        outputCtx.resume().catch(() => {});
      }

      const bytes = base64ToUint8Array(base64Audio);
      const sampleCount = Math.floor(bytes.byteLength / 2);
      if (sampleCount === 0) return;

      if (isWelcomePhaseRef.current) {
        hasReceivedWelcomeAudioRef.current = true;
      }

      const dataView = new DataView(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength
      );
      const float32 = new Float32Array(sampleCount);
      for (let i = 0; i < sampleCount; i++) {
        float32[i] = dataView.getInt16(i * 2, true) / 32768;
      }

      const audioBuffer = outputCtx.createBuffer(1, sampleCount, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = outputCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputAnalyser);

      const now = outputCtx.currentTime;
      const startTime = Math.max(nextStartTimeRef.current, now + 0.02);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;

      activeSourcesRef.current.add(source);
      setOrbState((prev) => (prev === 'cheering' ? 'cheering' : 'speaking'));

      source.onended = () => {
        activeSourcesRef.current.delete(source);
        if (activeSourcesRef.current.size === 0) {
          setOrbState((prev) =>
            prev === 'cheering'
              ? 'cheering'
              : allowMicStreamingRef.current && !isMutedRef.current
                ? 'listening'
                : 'idle'
          );
          finalizeWelcomeIfReady();
        }
      };
    },
    [finalizeWelcomeIfReady]
  );

  const startMeteringLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const inputData = new Uint8Array(64);
    const outputData = new Uint8Array(64);

    const tick = () => {
      if (inputAnalyserRef.current && allowMicStreamingRef.current && !isMutedRef.current) {
        inputAnalyserRef.current.getByteTimeDomainData(inputData);
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          const v = (inputData[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / inputData.length);
        setInputLevel(Math.min(1, rms * 4.5));
      } else {
        setInputLevel(0);
      }

      if (outputAnalyserRef.current && activeSourcesRef.current.size > 0) {
        outputAnalyserRef.current.getByteTimeDomainData(outputData);
        let sum = 0;
        for (let i = 0; i < outputData.length; i++) {
          const v = (outputData[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / outputData.length);
        setOutputLevel(Math.min(1, rms * 5));
      } else {
        setOutputLevel(0);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopSession = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (cheeringTimeoutRef.current) {
      window.clearTimeout(cheeringTimeoutRef.current);
      cheeringTimeoutRef.current = null;
    }

    allowMicStreamingRef.current = false;
    clearAudioQueue();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (silentGainRef.current) {
      silentGainRef.current.disconnect();
      silentGainRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close().catch(() => {});
      inputCtxRef.current = null;
    }
    if (outputCtxRef.current) {
      outputCtxRef.current.close().catch(() => {});
      outputCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionStatus('disconnected');
    setOrbState('idle');
    setInputLevel(0);
    setOutputLevel(0);
  }, [clearAudioQueue]);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  const setupMicrophone = useCallback(async (inputCtx: AudioContext) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setHasMicPermission(false);
      setMicError('Microphone is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      setHasMicPermission(true);
      setMicError(null);

      if (inputCtx.state === 'suspended') {
        await inputCtx.resume();
      }

      const source = inputCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 128;
      inputAnalyserRef.current = analyser;

      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      source.connect(analyser);
      analyser.connect(processor);

      const silentGain = inputCtx.createGain();
      silentGain.gain.value = 0;
      silentGainRef.current = silentGain;
      processor.connect(silentGain);
      silentGain.connect(inputCtx.destination);

      processor.onaudioprocess = (event) => {
        if (
          !allowMicStreamingRef.current ||
          isMutedRef.current ||
          wsRef.current?.readyState !== WebSocket.OPEN
        ) {
          return;
        }
        const channelData = event.inputBuffer.getChannelData(0);
        const base64Pcm = downsampleAndEncodePcm16(
          channelData,
          inputCtx.sampleRate,
          16000
        );
        wsRef.current.send(
          JSON.stringify({
            type: 'audio',
            data: base64Pcm,
          })
        );
      };
    } catch {
      setHasMicPermission(false);
      setMicError(
        'Microphone access was declined. You can still hear Sunny and tap voice command chips or type cues!'
      );
    }
  }, []);

  const connectAndWelcome = useCallback(
    async (
      voiceName: VoiceName,
      roleId: CharacterRoleId,
      languageCode: LanguageCode
    ) => {
      stopSession();
      setError(null);
      setWelcomeText('');
      setWelcomeFinished(false);
      setTranscripts([]);
      setStarCount(0);
      setLastPraise(null);
      setActiveVoice(voiceName);
      setActiveRoleId(roleId);
      setActiveLanguage(languageCode);
      currentRoleIdRef.current = roleId;
      currentLanguageRef.current = languageCode;

      const role: CharacterRole =
        CHARACTER_ROLES.find((r) => r.id === roleId) ?? CHARACTER_ROLES[0];
      const language =
        LANGUAGE_PROFILES.find((l) => l.code === languageCode) ??
        LANGUAGE_PROFILES[0];
      setActiveScriptCard(getStarterScript(roleId, languageCode));
      setActiveMood('Warm & Expressive');

      isWelcomePhaseRef.current = true;
      hasReceivedWelcomeAudioRef.current = false;
      welcomeTurnDoneRef.current = false;
      allowMicStreamingRef.current = false;
      isMutedRef.current = false;
      setIsMuted(false);
      setConnectionStatus('connecting');

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      inputCtxRef.current = inputCtx;
      if (inputCtx.state === 'suspended') {
        inputCtx.resume().catch(() => {});
      }

      const outputCtx = new AudioContext({ sampleRate: 24000 });
      outputCtxRef.current = outputCtx;
      if (outputCtx.state === 'suspended') {
        await outputCtx.resume();
      }
      const outputAnalyser = outputCtx.createAnalyser();
      outputAnalyser.fftSize = 128;
      outputAnalyser.connect(outputCtx.destination);
      outputAnalyserRef.current = outputAnalyser;

      startMeteringLoop();
      void setupMicrophone(inputCtx);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/live`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'start',
            voiceName,
            roleName: role.name,
            actingStyle: role.actingStyle,
            languageCode: language.code,
            languageName: language.label,
            nativeName: language.nativeName,
          })
        );
      };

      ws.onmessage = (event) => {
        let msg: {
          type?: string;
          data?: string;
          text?: string;
          message?: string;
          name?: string;
          args?: Record<string, unknown>;
        };
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        if (msg.type === 'ready') {
          setConnectionStatus('welcoming');
          setOrbState('speaking');
          ws.send(
            JSON.stringify({
              type: 'trigger_welcome',
              roleName: role.name,
              languageName: language.label,
              nativeName: language.nativeName,
            })
          );
          return;
        }

        if (msg.type === 'audio' && msg.data) {
          playAudioChunk(msg.data);
          return;
        }

        if (msg.type === 'input_transcript' && msg.text) {
          appendTranscriptChunk('user', msg.text);
          return;
        }

        if (msg.type === 'output_transcript' && msg.text) {
          if (isWelcomePhaseRef.current) {
            setWelcomeText((prev) => {
              const needsSpace =
                prev.length > 0 &&
                !prev.endsWith(' ') &&
                !msg.text!.startsWith(' ') &&
                !/^[.,!?']/.test(msg.text!);
              return prev + (needsSpace ? ' ' : '') + msg.text;
            });
          }
          appendTranscriptChunk('sunny', msg.text);
          return;
        }

        if (msg.type === 'interrupted') {
          clearAudioQueue();
          setOrbState(
            allowMicStreamingRef.current && !isMutedRef.current
              ? 'listening'
              : 'idle'
          );
          return;
        }

        if (msg.type === 'turn_complete') {
          if (isWelcomePhaseRef.current) {
            if (hasReceivedWelcomeAudioRef.current) {
              welcomeTurnDoneRef.current = true;
              finalizeWelcomeIfReady();
            }
          } else if (activeSourcesRef.current.size === 0) {
            setOrbState((prev) =>
              prev === 'cheering'
                ? 'cheering'
                : allowMicStreamingRef.current && !isMutedRef.current
                  ? 'listening'
                  : 'idle'
            );
          }
          return;
        }

        if (msg.type === 'tool_event' && msg.name) {
          const args = msg.args ?? {};
          if (msg.name === 'setCharacterRole' && typeof args.roleId === 'string') {
            const matched = CHARACTER_ROLES.find(
              (r) =>
                r.id === args.roleId ||
                r.name.toLowerCase() === String(args.roleName ?? '').toLowerCase()
            );
            if (matched) {
              setActiveRoleId(matched.id);
              currentRoleIdRef.current = matched.id;
              setActiveScriptCard(
                getStarterScript(matched.id, currentLanguageRef.current)
              );
            }
          } else if (msg.name === 'setLanguage') {
            const matchedLang = LANGUAGE_PROFILES.find(
              (l) =>
                l.code === args.languageCode ||
                l.label.toLowerCase() === String(args.languageName ?? '').toLowerCase() ||
                l.nativeName.toLowerCase() === String(args.languageName ?? '').toLowerCase()
            );
            if (matchedLang) {
              setActiveLanguage(matchedLang.code);
              currentLanguageRef.current = matchedLang.code;
              setActiveScriptCard(
                getStarterScript(currentRoleIdRef.current, matchedLang.code)
              );
            }
          } else if (msg.name === 'showScriptCard') {
            setActiveScriptCard({
              title: String(args.title ?? 'Practice Line'),
              line: String(args.line ?? ''),
              phoneticCue: String(args.phoneticCue ?? ''),
              stageDirection: String(args.stageDirection ?? ''),
              category: String(args.category ?? 'Voice Drill'),
            });
          } else if (msg.name === 'setDeliveryMood' && args.mood) {
            setActiveMood(String(args.mood));
          } else if (msg.name === 'celebrateTake') {
            triggerCheering(
              typeof args.praise === 'string'
                ? args.praise
                : 'Bravo! Amazing voice take!'
            );
          }
          return;
        }

        if (msg.type === 'error') {
          setError(msg.message || 'Voice connection error.');
          setConnectionStatus('error');
          setOrbState('idle');
          return;
        }

        if (msg.type === 'closed') {
          setError('Live voice session ended. Tap Reconnect to continue.');
          setConnectionStatus('disconnected');
          setOrbState('idle');
        }
      };

      ws.onerror = () => {
        setError('Could not connect to the live voice studio server.');
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        setConnectionStatus((prev) =>
          prev === 'error' ? 'error' : 'disconnected'
        );
      };
    },
    [
      appendTranscriptChunk,
      clearAudioQueue,
      finalizeWelcomeIfReady,
      playAudioChunk,
      setupMicrophone,
      startMeteringLoop,
      stopSession,
      triggerCheering,
    ]
  );

  const beginConversationNow = useCallback(() => {
    isWelcomePhaseRef.current = false;
    allowMicStreamingRef.current = true;
    if (inputCtxRef.current?.state === 'suspended') {
      inputCtxRef.current.resume().catch(() => {});
    }
    if (outputCtxRef.current?.state === 'suspended') {
      outputCtxRef.current.resume().catch(() => {});
    }
    setWelcomeFinished(true);
    setConnectionStatus('live');
    setOrbState(
      activeSourcesRef.current.size > 0
        ? 'speaking'
        : isMutedRef.current
          ? 'idle'
          : 'listening'
    );
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && inputCtxRef.current?.state === 'suspended') {
      inputCtxRef.current.resume().catch(() => {});
    }
    if (nextMuted && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'audio_stream_end' }));
    }
    if (activeSourcesRef.current.size === 0) {
      setOrbState(nextMuted ? 'idle' : 'listening');
    }
  }, []);

  const sendTextCommand = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      appendTranscriptChunk('user', trimmed);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'text', text: trimmed }));
      }
    },
    [appendTranscriptChunk]
  );

  const switchRole = useCallback((roleId: CharacterRoleId) => {
    const role = CHARACTER_ROLES.find((r) => r.id === roleId);
    if (!role) return;
    setActiveRoleId(role.id);
    currentRoleIdRef.current = role.id;
    setActiveScriptCard(getStarterScript(role.id, currentLanguageRef.current));
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'update_role',
          roleName: role.name,
          actingStyle: role.actingStyle,
        })
      );
    }
  }, []);

  const switchLanguage = useCallback((languageCode: LanguageCode) => {
    const lang = LANGUAGE_PROFILES.find((l) => l.code === languageCode);
    if (!lang) return;
    setActiveLanguage(lang.code);
    currentLanguageRef.current = lang.code;
    setActiveScriptCard(getStarterScript(currentRoleIdRef.current, lang.code));
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'update_language',
          languageCode: lang.code,
          languageName: lang.label,
          nativeName: lang.nativeName,
        })
      );
    }
  }, []);

  const interruptPlayback = useCallback(() => {
    clearAudioQueue();
    setOrbState(
      allowMicStreamingRef.current && !isMutedRef.current ? 'listening' : 'idle'
    );
  }, [clearAudioQueue]);

  return {
    connectionStatus,
    orbState,
    inputLevel,
    outputLevel,
    isMuted,
    hasMicPermission,
    micError,
    error,
    activeRoleId,
    activeVoice,
    activeLanguage,
    activeMood,
    activeScriptCard,
    starCount,
    lastPraise,
    welcomeText,
    welcomeFinished,
    transcripts,
    connectAndWelcome,
    beginConversationNow,
    toggleMute,
    sendTextCommand,
    switchRole,
    switchLanguage,
    triggerCheering,
    interruptPlayback,
    stopSession,
  };
}

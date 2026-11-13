import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import {
  EndSensitivity,
  GoogleGenAI,
  Modality,
  StartSensitivity,
  Type,
  type FunctionDeclaration,
  type LiveServerMessage,
} from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    apiVersion: 'v1beta',
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const setCharacterRoleDecl: FunctionDeclaration = {
  name: 'setCharacterRole',
  description:
    'Updates the active voice actor character persona displayed on screen whenever the user asks to switch characters, voices, or roles.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      roleId: {
        type: Type.STRING,
        description:
          'One of: narrator, dragon, pirate, hero, explorer, wizard',
      },
      roleName: {
        type: Type.STRING,
        description: 'Friendly display name of the character role.',
      },
    },
    required: ['roleId', 'roleName'],
  },
};

const showScriptCardDecl: FunctionDeclaration = {
  name: 'showScriptCard',
  description:
    'Displays a new practice script, tongue twister, or acting line on the interactive squircle flash card on screen.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'Short catchy title for the script card.',
      },
      line: {
        type: Type.STRING,
        description: 'The exact expressive line for the user or assistant to perform.',
      },
      phoneticCue: {
        type: Type.STRING,
        description:
          'Syllable stress and rhythm guide separated by middots (e.g. "HOIST the STAR-light · SAILS a-HOY!").',
      },
      stageDirection: {
        type: Type.STRING,
        description: 'Brief vocal acting tip for emotion, breath, or pacing.',
      },
      category: {
        type: Type.STRING,
        description: 'Short category label like "Tongue Twister", "Scene Partner", or "Warmup".',
      },
    },
    required: ['title', 'line', 'phoneticCue', 'stageDirection', 'category'],
  },
};

const setDeliveryMoodDecl: FunctionDeclaration = {
  name: 'setDeliveryMood',
  description:
    'Updates the active vocal delivery mood/pacing badge on screen when the user asks to speak faster, slower, whisper, sound excited, or dramatic.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      mood: {
        type: Type.STRING,
        description: 'Short 2-3 word label like "Fast & Excited", "Dramatic Whisper", "Heroic & Bold", or "Gentle & Cozy".',
      },
    },
    required: ['mood'],
  },
};

const celebrateTakeDecl: FunctionDeclaration = {
  name: 'celebrateTake',
  description:
    'Triggers the joyful lime-and-coral starburst cheering animation and awards a gold star take when the user finishes a line well or asks to celebrate.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      praise: {
        type: Type.STRING,
        description: 'Short celebratory note like "Bravo! Crisp Pirate Energy!"',
      },
    },
    required: ['praise'],
  },
};

const setLanguageDecl: FunctionDeclaration = {
  name: 'setLanguage',
  description:
    'Updates the active spoken language displayed on screen whenever the user asks to switch languages (e.g., Auto-Detect, Dutch, English, Spanish, French, German, Japanese).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      languageCode: {
        type: Type.STRING,
        description: 'One of: auto, en, nl, es, fr, de, ja',
      },
      languageName: {
        type: Type.STRING,
        description: 'Language display name (e.g. "Dutch", "English", "Auto-Detect").',
      },
    },
    required: ['languageCode', 'languageName'],
  },
};

const SYSTEM_INSTRUCTION = `You are Sunny Spark, a joyful, expressive, real-time live voice actor assistant and scene partner.
Your job is to bring voice acting, storytelling, pronunciation play, and interactive dialogue to life!

Personality & Voice Rules:
- Keep spoken responses concise, punchy, and naturally conversational (usually 1 to 3 expressive sentences) so real-time dialogue feels snappy and alive.
- Use rich vocal variety: playful pauses, lively pitch shifts, character voices, and expressive reactions.
- Respond immediately to voice commands!
  - If the user says "switch to pirate", "be a dragon", "act like a superhero", "space explorer", "wizard", or "narrator" (in any language), IMMEDIATELY call the setCharacterRole tool AND adopt that voice character right away.
  - If the user asks to speak another language (such as Dutch / Nederlands, English, Spanish, French, German, or Japanese), IMMEDIATELY call the setLanguage tool AND switch to speaking that language fluently!
  - If the user asks for a line to read, a tongue twister, an audition script, or a story line to practice together, call showScriptCard with a vivid line, syllabic phoneticCue, and stageDirection written in the active language, then read or invite them to perform it.
  - If the user asks you to whisper, speak faster, slow down, or sound super excited/dramatic, call setDeliveryMood and adjust your vocal performance immediately.
  - When the user performs a line, nails a pronunciation, or says "cut!" / "celebrate", call celebrateTake to burst confetti/stars on screen and cheer them on!
- Never mention being an AI language model or technical internals. Stay in the magic of the voice studio.`;

function sendJson(ws: WebSocket, payload: Record<string, unknown>) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  const server = createServer(app);
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', (clientWs) => {
    let session: Awaited<ReturnType<typeof ai.live.connect>> | null = null;
    let isClosing = false;
    let sessionLanguageCode = 'en';
    let sessionLanguageName = 'English';
    let sessionNativeName = 'English';

    const cleanupSession = () => {
      if (isClosing) return;
      isClosing = true;
      if (session) {
        try {
          session.close();
        } catch {
          // Ignore close errors during teardown
        }
        session = null;
      }
    };

    clientWs.on('message', async (raw) => {
      let msg: {
        type?: string;
        voiceName?: string;
        roleName?: string;
        actingStyle?: string;
        languageCode?: string;
        languageName?: string;
        nativeName?: string;
        data?: string;
        text?: string;
      };

      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      if (msg.type === 'start') {
        if (!process.env.GEMINI_API_KEY) {
          sendJson(clientWs, {
            type: 'error',
            message:
              'Gemini API key is missing. Please add GEMINI_API_KEY in Settings > Secrets.',
          });
          return;
        }

        const voiceName = msg.voiceName || 'Zephyr';
        const roleName = msg.roleName || 'Storybook Narrator';
        const actingStyle =
          msg.actingStyle ||
          'You are Sunny Spark, a warm, enchanted storybook narrator.';
        sessionLanguageCode = msg.languageCode || 'en';
        sessionLanguageName = msg.languageName || 'English';
        sessionNativeName = msg.nativeName || sessionLanguageName;

        const languageRule =
          sessionLanguageCode === 'auto'
            ? `MULTILINGUAL SPOKEN LANGUAGE RULE:\nListen carefully to ANY language the user speaks (Dutch, English, Spanish, French, German, Japanese, etc.) and immediately reply aloud in the exact same language the user just spoke! For your opening welcome, greet them warmly in English with a cheerful invitation in Dutch too.`
            : `CRITICAL SPOKEN LANGUAGE RULE:\nAlways listen and understand ANY language the user speaks (including ${sessionLanguageName}, English, Dutch, or mixed phrases). Always respond aloud, perform, coach, and write all script cards strictly in ${sessionLanguageName} (${sessionNativeName}) with natural native ${sessionLanguageName} pronunciation and warmth—unless the user explicitly asks you to switch languages (in which case call setLanguage and switch right away).`;

        try {
          session = await ai.live.connect({
            model: 'gemini-3.8-live',
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
              realtimeInputConfig: {
                automaticActivityDetection: {
                  startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
                  endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
                  prefixPaddingMs: 120,
                  silenceDurationMs: 450,
                },
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              tools: [
                {
                  functionDeclarations: [
                    setCharacterRoleDecl,
                    showScriptCardDecl,
                    setDeliveryMoodDecl,
                    celebrateTakeDecl,
                    setLanguageDecl,
                  ],
                },
              ],
              systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${languageRule}\n\nCurrent active character persona: ${roleName}.\nCharacter direction: ${actingStyle}`,
            },
            callbacks: {
              onmessage: (message: LiveServerMessage) => {
                const content = message.serverContent;

                if (content?.interrupted) {
                  sendJson(clientWs, { type: 'interrupted' });
                }

                if (content?.inputTranscription?.text) {
                  sendJson(clientWs, {
                    type: 'input_transcript',
                    text: content.inputTranscription.text,
                  });
                }

                if (content?.outputTranscription?.text) {
                  sendJson(clientWs, {
                    type: 'output_transcript',
                    text: content.outputTranscription.text,
                  });
                }

                for (const part of content?.modelTurn?.parts ?? []) {
                  if (part.inlineData?.data) {
                    sendJson(clientWs, {
                      type: 'audio',
                      data: part.inlineData.data,
                    });
                  }
                }

                if (content?.turnComplete) {
                  sendJson(clientWs, { type: 'turn_complete' });
                }

                if (message.toolCall?.functionCalls?.length) {
                  const responses = message.toolCall.functionCalls.map((call) => {
                    sendJson(clientWs, {
                      type: 'tool_event',
                      name: call.name,
                      args: call.args ?? {},
                    });
                    return {
                      id: call.id,
                      name: call.name,
                      response: { status: 'applied', ok: true },
                    };
                  });

                  try {
                    session?.sendToolResponse({ functionResponses: responses });
                  } catch (err) {
                    console.error('Error sending tool response:', err);
                  }
                }
              },
              onerror: (err: unknown) => {
                console.error('Gemini Live session error:', err);
                sendJson(clientWs, {
                  type: 'error',
                  message:
                    err instanceof Error
                      ? err.message
                      : 'Live voice session encountered a connection error.',
                });
              },
              onclose: () => {
                if (!isClosing) {
                  sendJson(clientWs, { type: 'closed' });
                }
              },
            },
          });

          sendJson(clientWs, { type: 'ready' });
        } catch (err) {
          console.error('Failed to connect Gemini Live:', err);
          sendJson(clientWs, {
            type: 'error',
            message:
              err instanceof Error
                ? err.message
                : 'Unable to connect to Gemini Live.',
          });
        }
        return;
      }

      if (!session) return;

      if (msg.type === 'trigger_welcome') {
        const roleName = msg.roleName || 'Storybook Narrator';
        if (msg.languageCode) sessionLanguageCode = msg.languageCode;
        if (msg.languageName) sessionLanguageName = msg.languageName;
        if (msg.nativeName) sessionNativeName = msg.nativeName;
        const welcomePrompt =
          sessionLanguageCode === 'auto'
            ? `We just stepped onto the Welcome Stage! Without calling any tools yet, give me a joyful, energetic 2-sentence spoken welcome as ${roleName} to Sunny Spark Voice, and tell me I can speak in any language (like English or Dutch) and you will reply in my language right away!`
            : `We just stepped onto the Welcome Stage! Without calling any tools yet, give me a joyful, energetic 2-sentence spoken welcome STRICTLY in ${sessionLanguageName} (${sessionNativeName}) as ${roleName}. Greet me warmly to Sunny Spark Voice in ${sessionLanguageName}, and invite me to start talking or give a voice command in ${sessionLanguageName} right after your greeting.`;
        try {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: welcomePrompt }],
              },
            ],
            turnComplete: true,
          });
        } catch (err) {
          console.error('Failed to trigger welcome:', err);
        }
        return;
      }

      if (msg.type === 'audio' && msg.data) {
        try {
          session.sendRealtimeInput({
            audio: {
              data: msg.data,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } catch (err) {
          console.error('Failed to forward audio chunk:', err);
        }
        return;
      }

      if (msg.type === 'audio_stream_end') {
        try {
          session.sendRealtimeInput({ audioStreamEnd: true });
        } catch (err) {
          console.error('Failed to send audioStreamEnd:', err);
        }
        return;
      }

      if (msg.type === 'text' && msg.text) {
        const langHint =
          sessionLanguageCode === 'auto'
            ? '[Respond aloud in the same language as this message.]'
            : `[Respond aloud strictly in ${sessionLanguageName} (${sessionNativeName}).]`;
        try {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${msg.text}\n${langHint}`,
                  },
                ],
              },
            ],
            turnComplete: true,
          });
        } catch (err) {
          console.error('Failed to send text command:', err);
        }
        return;
      }

      if (msg.type === 'update_role' && msg.roleName && msg.actingStyle) {
        const langTarget =
          sessionLanguageCode === 'auto'
            ? 'the current conversation language'
            : `${sessionLanguageName} (${sessionNativeName})`;
        try {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: `[Stage Cue: The user tapped the "${msg.roleName}" character card! Switch into this character immediately: ${msg.actingStyle}. Give a short 1-sentence in-character reaction strictly in ${langTarget}!]`,
                  },
                ],
              },
            ],
            turnComplete: true,
          });
        } catch (err) {
          console.error('Failed to send role update:', err);
        }
        return;
      }

      if (msg.type === 'update_language' && msg.languageName) {
        sessionLanguageCode = msg.languageCode || 'en';
        sessionLanguageName = msg.languageName;
        sessionNativeName = msg.nativeName || msg.languageName;
        const switchPrompt =
          sessionLanguageCode === 'auto'
            ? `[Stage Cue: The user switched language mode to Auto-Detect! From now on, listen to whatever language the user speaks and reply in that exact same language. Say a cheerful 1-sentence confirmation now!]`
            : `[Stage Cue: The user switched the stage language to ${sessionLanguageName} (${sessionNativeName})! From this moment on, speak EXCLUSIVELY in ${sessionLanguageName} (${sessionNativeName}). Say a cheerful 1-sentence confirmation in ${sessionLanguageName} right now!]`;
        try {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: switchPrompt }],
              },
            ],
            turnComplete: true,
          });
        } catch (err) {
          console.error('Failed to send language update:', err);
        }
      }
    });

    clientWs.on('close', cleanupSession);
    clientWs.on('error', cleanupSession);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunny Spark Voice server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});

import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Award,
  Globe,
  Mic,
  MicOff,
  PartyPopper,
  PhoneOff,
  RotateCw,
  Send,
  Square,
  Volume2,
  Wand2,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ConnectionStatus } from '../hooks/useGeminiLive';
import {
  CHARACTER_ROLES,
  LANGUAGE_PROFILES,
  VOICE_COMMAND_CHIPS,
  type CharacterRoleId,
  type LanguageCode,
  type OrbState,
  type ScriptCard,
  type TranscriptEntry,
  type VoiceName,
} from '../types/voice';
import { CharacterAvatar } from './CharacterAvatar';
import { LivingOrb } from './LivingOrb';

interface ConversationStageProps {
  connectionStatus: ConnectionStatus;
  orbState: OrbState;
  inputLevel: number;
  outputLevel: number;
  isMuted: boolean;
  hasMicPermission: boolean | null;
  micError: string | null;
  error: string | null;
  activeRoleId: CharacterRoleId;
  activeVoice: VoiceName;
  activeLanguage: LanguageCode;
  activeMood: string;
  activeScriptCard: ScriptCard;
  starCount: number;
  lastPraise: string | null;
  transcripts: TranscriptEntry[];
  onToggleMute: () => void;
  onSendTextCommand: (text: string) => void;
  onSwitchRole: (roleId: CharacterRoleId) => void;
  onSwitchLanguage: (languageCode: LanguageCode) => void;
  onCelebrate: () => void;
  onInterrupt: () => void;
  onReconnect: () => void;
  onEndSession: () => void;
}

export function ConversationStage({
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
  transcripts,
  onToggleMute,
  onSendTextCommand,
  onSwitchRole,
  onSwitchLanguage,
  onCelebrate,
  onInterrupt,
  onReconnect,
  onEndSession,
}: ConversationStageProps) {
  const [cueText, setCueText] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const activeRole =
    CHARACTER_ROLES.find((r) => r.id === activeRoleId) ?? CHARACTER_ROLES[0];
  const activeLang =
    LANGUAGE_PROFILES.find((l) => l.code === activeLanguage) ??
    LANGUAGE_PROFILES[0];

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const handleSubmitCue = (e: FormEvent) => {
    e.preventDefault();
    if (!cueText.trim()) return;
    onSendTextCommand(cueText);
    setCueText('');
  };

  const statusLabel =
    orbState === 'cheering'
      ? lastPraise || 'Bravo! Star take!'
      : orbState === 'speaking'
        ? `${activeRole.name} is performing...`
        : isMuted || hasMicPermission === false
          ? 'Microphone paused — tap Unmute or use a command chip'
          : 'Listening live — say a line or voice command!';

  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#231a0c] flex flex-col">
      {/* Compact 3-Zone Top Bar */}
      <header className="border-b-[3px] border-[#f2e0c8] bg-[#fff8f3]/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl font-bold tracking-tight text-[#231a0c] whitespace-nowrap shrink-0">
              Sunny Spark Voice
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-base font-bold text-[#554434]">
            <span className="whitespace-nowrap shrink-0">
              Role: <strong className="text-[#231a0c]">{activeRole.name}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap shrink-0">
              Lang: <strong className="text-[#006398]">{activeLang.nativeName}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap shrink-0">
              Voice: <strong className="text-[#231a0c]">{activeVoice}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 text-[#8b5000] tabular-nums whitespace-nowrap shrink-0">
              <Award className="h-5 w-5" />
              {starCount} {starCount === 1 ? 'Star Take' : 'Star Takes'}
            </span>
          </div>

          <button
            type="button"
            onClick={onEndSession}
            className="toy-btn-cream inline-flex items-center gap-2 rounded-full border-[3px] border-[#dbc2ad] bg-[#fff2e2] px-4 py-2 text-sm sm:text-base font-bold text-[#231a0c] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PhoneOff className="h-4 w-4 text-[#b0284b]" />
            <span>End Stage</span>
          </button>
        </div>
      </header>

      {/* Main 12-Column Voice Studio Workspace */}
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-8">
        {(error || micError || connectionStatus === 'disconnected') && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border-[3px] border-[#ffb870] bg-[#fff2e2] px-5 py-3.5 text-base font-semibold text-[#653900]">
            <span>
              {error ||
                micError ||
                'Live voice session disconnected. Reconnect to keep talking!'}
            </span>
            {(error || connectionStatus === 'disconnected') && (
              <button
                type="button"
                onClick={onReconnect}
                className="toy-btn-amber inline-flex items-center gap-2 rounded-full border-2 border-[#231a0c] bg-[#ff9800] px-4 py-1.5 text-sm font-bold text-[#231a0c] cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
                <span>Reconnect</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          {/* Left / Primary Stage (7 columns) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            {/* Voice Interaction Core Card */}
            <div className="warm-ambient-shadow rounded-[32px] border-[3px] border-[#dbc2ad] bg-[#feebd3] p-6 sm:p-7 flex flex-col items-center text-center">
              <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-bold text-[#554434]">
                <span className="inline-flex items-center gap-1.5 text-[#006398]">
                  <Wand2 className="h-4 w-4" />
                  Mood: {activeMood}
                </span>
                <span className="sm:hidden inline-flex items-center gap-1 text-[#8b5000] tabular-nums">
                  <Award className="h-4 w-4" />
                  {starCount} Stars
                </span>
              </div>

              <div className="my-2">
                <LivingOrb
                  state={orbState}
                  roleId={activeRoleId}
                  inputLevel={inputLevel}
                  outputLevel={outputLevel}
                  size="lg"
                />
              </div>

              {/* Explicit State Text + Icon (Never Color Alone) */}
              <div className="flex items-center justify-center gap-2.5 text-lg sm:text-xl font-bold text-[#231a0c]">
                {orbState === 'speaking' ? (
                  <Volume2 className="h-6 w-6 text-[#8b5000] shrink-0" />
                ) : orbState === 'cheering' ? (
                  <PartyPopper className="h-6 w-6 text-[#15803d] shrink-0" />
                ) : isMuted || hasMicPermission === false ? (
                  <MicOff className="h-6 w-6 text-[#b0284b] shrink-0" />
                ) : (
                  <Mic className="h-6 w-6 text-[#006398] shrink-0" />
                )}
                <span>{statusLabel}</span>
              </div>

              {/* Live Mic Signal Meter */}
              {!isMuted && hasMicPermission !== false && (
                <div
                  className="mt-3 flex items-center gap-2 text-xs font-bold text-[#006398]"
                  aria-label="Microphone signal level"
                >
                  <span>Mic Level</span>
                  <div className="h-2.5 w-36 overflow-hidden rounded-full border-2 border-[#93ccff] bg-white">
                    <div
                      className="h-full rounded-full bg-[#0284c7] transition-all duration-75"
                      style={{ width: `${Math.max(8, Math.round(inputLevel * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Primary Chunky Push Controls */}
              <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={onToggleMute}
                  disabled={hasMicPermission === false}
                  className={`flex h-16 flex-1 min-w-[200px] items-center justify-center gap-3 rounded-full border-[3px] border-[#231a0c] px-6 text-lg font-bold cursor-pointer disabled:opacity-50 ${
                    isMuted || hasMicPermission === false
                      ? 'toy-btn-coral bg-[#ff90a1] text-[#400012]'
                      : 'toy-btn-cyan bg-[#5bb8fe] text-[#001d31]'
                  }`}
                >
                  {isMuted || hasMicPermission === false ? (
                    <>
                      <MicOff className="h-6 w-6 stroke-[2.5]" />
                      <span>Mic Muted (Tap to Speak)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-6 w-6 stroke-[2.5]" />
                      <span>Live Mic On</span>
                    </>
                  )}
                </button>

                {orbState === 'speaking' ? (
                  <button
                    type="button"
                    onClick={onInterrupt}
                    className="toy-btn-amber flex h-16 items-center justify-center gap-2.5 rounded-full border-[3px] border-[#231a0c] bg-[#ff9800] px-6 text-lg font-bold text-[#231a0c] cursor-pointer"
                  >
                    <Square className="h-5 w-5 fill-current" />
                    <span>Pause Voice</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onCelebrate();
                      onSendTextCommand(
                        'Celebrate our take with an energetic cheer!'
                      );
                    }}
                    className="toy-btn-lime flex h-16 items-center justify-center gap-2.5 rounded-full border-[3px] border-[#231a0c] bg-[#4ade80] px-6 text-lg font-bold text-[#052e16] cursor-pointer"
                  >
                    <PartyPopper className="h-6 w-6 stroke-[2.5]" />
                    <span>Celebrate Take</span>
                  </button>
                )}
              </div>
            </div>

            {/* Squircle Flash Card (Practice Script & Phonetic Guide) */}
            <motion.div
              key={activeScriptCard.title + activeScriptCard.line}
              initial={{ opacity: 0.7, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="rounded-[28px] border-[3px] border-[#eadfc7] bg-[#f8f4ea] p-6 sm:p-7 warm-ambient-shadow space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#8b5000]">
                    {activeScriptCard.category} · Practice Script Card
                  </p>
                  <h2 className="text-2xl font-bold text-[#231a0c]">
                    {activeScriptCard.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSendTextCommand(
                      `Demonstrate this practice line aloud in character: "${activeScriptCard.line}"`
                    )
                  }
                  className="toy-btn-cream inline-flex h-12 items-center gap-2 rounded-full border-[3px] border-[#dbc2ad] bg-white px-5 text-base font-bold text-[#006398] cursor-pointer"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>Hear Sunny Read</span>
                </button>
              </div>

              <p className="text-[22px] leading-[32px] sm:text-[26px] sm:leading-[36px] font-bold text-[#231a0c]">
                &ldquo;{activeScriptCard.line}&rdquo;
              </p>

              <div className="rounded-[20px] border-2 border-[#dbc2ad] bg-[#fff8f3] p-4 space-y-1.5">
                <p className="phonetic-display text-[19px] sm:text-[22px] leading-[30px] text-[#006398]">
                  {activeScriptCard.phoneticCue}
                </p>
                <p className="text-base font-medium text-[#554434]">
                  Director&apos;s Note: {activeScriptCard.stageDirection}
                </p>
              </div>
            </motion.div>
          </section>

          {/* Right Action & Conversation Zone (5 columns) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            {/* Voice Command Bubble Chips */}
            <div className="rounded-[28px] border-[3px] border-[#dbc2ad] bg-[#fff2e2] p-5 sm:p-6 space-y-3.5">
              <div>
                <h2 className="text-xl font-bold text-[#231a0c]">
                  Real-Time Voice Commands
                </h2>
                <p className="text-sm font-semibold text-[#554434]">
                  Say any command aloud, or tap a sound bubble to cue Sunny:
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {VOICE_COMMAND_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => onSendTextCommand(chip.command)}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-[#93ccff] bg-[#e0f2fe] px-4 py-2 text-sm font-bold text-[#0284c7] hover:bg-[#cce5ff] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4 shrink-0" />
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Spoken Language Switcher */}
            <div className="rounded-[28px] border-[3px] border-[#dbc2ad] bg-[#fff2e2] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-[#231a0c] flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#8b5000]" />
                  <span>Spoken Language</span>
                </h2>
                <span className="text-sm font-bold text-[#006398]">
                  {activeLang.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_PROFILES.map((lang) => {
                  const selected = lang.code === activeLanguage;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onSwitchLanguage(lang.code)}
                      className={`min-h-[40px] rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-all cursor-pointer ${
                        selected
                          ? 'border-[#231a0c] bg-[#ffdcbe] text-[#2c1600] shadow-[0_3px_0_#b86800]'
                          : 'border-[#dbc2ad] bg-[#fff8f3] text-[#231a0c] hover:bg-white'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Character Switcher */}
            <div className="rounded-[28px] border-[3px] border-[#dbc2ad] bg-[#fff2e2] p-5 space-y-3">
              <h2 className="text-lg font-bold text-[#231a0c]">
                Instant Character Switch
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {CHARACTER_ROLES.map((role) => {
                  const selected = role.id === activeRoleId;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => onSwitchRole(role.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-[20px] border-[3px] p-2.5 text-center transition-all cursor-pointer ${
                        selected
                          ? 'border-[#231a0c] bg-white shadow-[0_4px_0_#dbc2ad]'
                          : 'border-[#dbc2ad] bg-[#fff8f3] hover:bg-white'
                      }`}
                    >
                      <CharacterAvatar roleId={role.id} size={42} />
                      <span className="text-xs font-bold text-[#231a0c] leading-tight line-clamp-1">
                        {role.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Storybook Dialogue Transcript */}
            <div className="flex flex-1 flex-col rounded-[28px] border-[3px] border-[#dbc2ad] bg-[#ffffff] p-5 warm-ambient-shadow min-h-[300px] max-h-[440px]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#231a0c]">
                  Live Dialogue
                </h2>
                <span className="text-sm font-bold text-[#554434]">
                  {transcripts.length} {transcripts.length === 1 ? 'turn' : 'turns'}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {transcripts.length === 0 ? (
                  <p className="py-8 text-center text-base font-medium text-[#554434]">
                    Speak into your microphone or tap a voice command chip to
                    start acting with Sunny!
                  </p>
                ) : (
                  transcripts.map((entry) => {
                    const isUser = entry.speaker === 'user';
                    return (
                      <div
                        key={entry.id}
                        className={`flex flex-col ${
                          isUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        <span className="mb-1 px-2 text-xs font-bold text-[#554434]">
                          {isUser ? 'You' : activeRole.name} · {entry.timestamp}
                        </span>
                        <div
                          className={`max-w-[88%] px-4 py-3 text-base font-semibold leading-relaxed border-2 ${
                            isUser
                              ? 'rounded-[22px] rounded-br-[6px] border-[#93ccff] bg-[#e0f2fe] text-[#001d31]'
                              : 'rounded-[22px] rounded-bl-[6px] border-[#dbc2ad] bg-[#fff2e2] text-[#231a0c]'
                          }`}
                        >
                          {entry.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={transcriptEndRef} />
              </div>

              {/* Pill Text Cue Input */}
              <form
                onSubmit={handleSubmitCue}
                className="mt-4 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={cueText}
                  onChange={(e) => setCueText(e.target.value)}
                  placeholder="Or type a direction / line..."
                  aria-label="Type a voice direction or line"
                  className="h-12 flex-1 rounded-full border-[3px] border-[#eadfc7] bg-[#fff8f3] px-5 text-base font-semibold text-[#231a0c] placeholder-[#887361] focus:border-[#38bdf8] focus:outline-none focus:ring-4 focus:ring-[#38bdf8]/20"
                />
                <button
                  type="submit"
                  aria-label="Send cue"
                  className="toy-btn-amber flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-[#231a0c] bg-[#ff9800] text-[#231a0c] cursor-pointer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

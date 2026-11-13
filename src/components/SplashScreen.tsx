import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Globe,
  Mic,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CHARACTER_ROLES,
  LANGUAGE_PROFILES,
  VOICE_PROFILES,
  type CharacterRoleId,
  type LanguageCode,
  type OrbState,
  type VoiceName,
} from '../types/voice';
import { CharacterAvatar } from './CharacterAvatar';
import { LivingOrb } from './LivingOrb';

interface SplashScreenProps {
  selectedRoleId: CharacterRoleId;
  selectedVoice: VoiceName;
  selectedLanguage: LanguageCode;
  onSelectRole: (roleId: CharacterRoleId) => void;
  onSelectVoice: (voice: VoiceName) => void;
  onSelectLanguage: (language: LanguageCode) => void;
  onEnterStage: () => void;
}

export function SplashScreen({
  selectedRoleId,
  selectedVoice,
  selectedLanguage,
  onSelectRole,
  onSelectVoice,
  onSelectLanguage,
  onEnterStage,
}: SplashScreenProps) {
  const [previewOrbState, setPreviewOrbState] = useState<OrbState>('idle');

  const activeRole =
    CHARACTER_ROLES.find((r) => r.id === selectedRoleId) ?? CHARACTER_ROLES[0];
  const activeLanguage =
    LANGUAGE_PROFILES.find((l) => l.code === selectedLanguage) ??
    LANGUAGE_PROFILES[0];
  const activeVoice =
    VOICE_PROFILES.find((v) => v.id === selectedVoice) ?? VOICE_PROFILES[0];

  const triggerOrbPreview = () => {
    setPreviewOrbState('cheering');
    window.setTimeout(() => {
      setPreviewOrbState('idle');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#231a0c]">
      {/* Clean 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b-[3px] border-[#f2e0c8] bg-[#fff8f3]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            className="text-xl font-bold tracking-tight text-[#231a0c] whitespace-nowrap shrink-0"
          >
            Sunny Spark Voice
          </a>

          <nav className="hidden md:flex items-center gap-7 text-base font-semibold text-[#554434]">
            <a
              href="#characters"
              className="hover:text-[#8b5000] transition-colors whitespace-nowrap shrink-0"
            >
              Characters
            </a>
            <a
              href="#languages"
              className="hover:text-[#8b5000] transition-colors whitespace-nowrap shrink-0"
            >
              Languages
            </a>
            <a
              href="#voices"
              className="hover:text-[#8b5000] transition-colors whitespace-nowrap shrink-0"
            >
              Voices
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#8b5000] transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
          </nav>

          <button
            type="button"
            onClick={onEnterStage}
            className="toy-btn-amber rounded-full border-[3px] border-[#231a0c] bg-[#ff9800] px-6 py-2 text-base font-bold text-[#231a0c] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006398]"
          >
            Enter Stage
          </button>
        </div>
      </header>

      <main
        id="top"
        className="mx-auto max-w-[1200px] px-5 pt-8 pb-20 sm:px-8 lg:pt-12 space-y-16"
      >
        {/* Hero Split Section */}
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <p className="text-sm sm:text-base font-bold text-[#8b5000]">
              Real-Time Voice Actor Studio · Multilingual Live Companion
            </p>

            <h1 className="text-[36px] leading-[44px] sm:text-[48px] sm:leading-[56px] font-bold text-[#231a0c] text-balance">
              Speak a command. Bring every character to life.
            </h1>

            <p className="max-w-2xl text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px] font-medium text-[#554434]">
              Sunny Spark is your live Gemini voice actor partner. Choose a
              character and language—including Dutch, English, or
              Auto-Detect—then step onto the Welcome Stage to hear Sunny greet
              you aloud before your real-time conversation begins.
            </p>

            <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                type="button"
                onClick={onEnterStage}
                className="toy-btn-amber flex h-16 items-center justify-center gap-3 rounded-full border-[3px] border-[#231a0c] bg-[#ff9800] px-8 text-xl font-bold text-[#231a0c] whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006398]"
              >
                <Mic className="h-6 w-6 stroke-[2.5]" />
                <span>Enter Welcome Stage</span>
                <ArrowRight className="h-6 w-6 stroke-[2.5]" />
              </button>

              <a
                href="#characters"
                className="toy-btn-cream flex h-16 items-center justify-center gap-2.5 rounded-full border-[3px] border-[#dbc2ad] bg-[#fff2e2] px-7 text-lg font-bold text-[#231a0c] whitespace-nowrap cursor-pointer"
              >
                <span>Customize Cast</span>
                <ArrowDown className="h-5 w-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm sm:text-base font-bold text-[#554434]">
              <span>01. Cast &amp; Language</span>
              <span aria-hidden="true">·</span>
              <span>02. Spoken Welcome</span>
              <span aria-hidden="true">·</span>
              <span>03. Live Voice Conversation</span>
            </div>
          </div>

          {/* Interactive Orb Stage Preview Pedestal */}
          <div className="lg:col-span-5">
            <div className="warm-ambient-shadow rounded-[36px] border-[3px] border-[#dbc2ad] bg-[#feebd3] p-6 sm:p-8 flex flex-col items-center text-center">
              <button
                type="button"
                onClick={triggerOrbPreview}
                aria-label="Tap Sunny to wave"
                className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#006398]"
              >
                <LivingOrb
                  state={previewOrbState}
                  roleId={selectedRoleId}
                  size="lg"
                />
              </button>

              <div className="mt-2 w-full rounded-[24px] border-[3px] border-[#dbc2ad] bg-[#ffffff] p-5 space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <CharacterAvatar roleId={selectedRoleId} size={40} />
                  <div className="text-left">
                    <p className="text-lg font-bold text-[#231a0c] leading-tight">
                      {activeRole.name}
                    </p>
                    <p className="text-sm font-bold text-[#006398]">
                      {activeLanguage.label} ({activeLanguage.nativeName}) ·{' '}
                      {activeVoice.label}
                    </p>
                  </div>
                </div>

                <p className="pt-1 text-sm font-semibold text-[#554434]">
                  Tap Sunny above to cheer, or try saying: &ldquo;
                  {activeRole.sampleCommand}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Character Role Selection */}
        <section id="characters" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#8b5000]">
                01. Scene Partner Cast
              </p>
              <h2 className="text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] font-bold text-[#231a0c]">
                Pick Your Opening Character
              </h2>
            </div>
            <p className="text-base font-semibold text-[#554434]">
              You can also switch characters live with your voice at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTER_ROLES.map((role) => {
              const isSelected = role.id === selectedRoleId;
              return (
                <motion.button
                  key={role.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectRole(role.id)}
                  className={`relative flex items-center gap-4 rounded-[28px] border-[3px] p-4 text-left transition-colors cursor-pointer min-h-[92px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006398] ${
                    isSelected
                      ? 'border-[#231a0c] bg-[#ffffff] shadow-[0_6px_0_#dbc2ad]'
                      : 'border-[#dbc2ad] bg-[#fff2e2] hover:bg-[#ffffff]'
                  }`}
                >
                  <CharacterAvatar
                    roleId={role.id}
                    size={62}
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1 pr-7">
                    <p className="text-lg font-bold text-[#231a0c] truncate">
                      {role.name}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[#554434] line-clamp-2">
                      {role.tagline}
                    </p>
                  </div>

                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 20,
                      }}
                      className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#22c55e] text-white border-2 border-[#231a0c]"
                      aria-label="Selected"
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Language & Voice Tone Split */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Spoken Language Card */}
          <div
            id="languages"
            className="scroll-mt-24 rounded-[32px] border-[3px] border-[#dbc2ad] bg-[#feebd3] p-6 sm:p-8 space-y-4 warm-ambient-shadow"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="h-6 w-6 text-[#8b5000]" />
              <div>
                <p className="text-sm font-bold text-[#8b5000]">
                  02. Spoken Language
                </p>
                <h2 className="text-2xl font-bold text-[#231a0c]">
                  Choose Language
                </h2>
              </div>
            </div>

            <p className="text-base font-medium text-[#554434]">
              Pick a language like <strong>Dutch (Nederlands)</strong>,{' '}
              <strong>English</strong>, or choose <strong>Auto-Detect</strong>{' '}
              so Sunny listens and replies in whatever language you speak.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              {LANGUAGE_PROFILES.map((lang) => {
                const isSelected = lang.code === selectedLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onSelectLanguage(lang.code)}
                    className={`rounded-full border-[3px] px-5 py-2.5 text-left transition-all cursor-pointer min-h-[54px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006398] ${
                      isSelected
                        ? 'border-[#231a0c] bg-[#ffdcbe] text-[#2c1600] shadow-[0_4px_0_#b86800]'
                        : 'border-[#dbc2ad] bg-[#fff8f3] text-[#231a0c] hover:bg-white'
                    }`}
                  >
                    <span className="block text-base font-bold leading-tight whitespace-nowrap">
                      {lang.label}
                    </span>
                    <span className="block text-xs font-semibold opacity-85 whitespace-nowrap">
                      {lang.nativeName} · {lang.shortCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Tone Card */}
          <div
            id="voices"
            className="scroll-mt-24 rounded-[32px] border-[3px] border-[#dbc2ad] bg-[#feebd3] p-6 sm:p-8 space-y-4 warm-ambient-shadow"
          >
            <div className="flex items-center gap-2.5">
              <Volume2 className="h-6 w-6 text-[#006398]" />
              <div>
                <p className="text-sm font-bold text-[#006398]">
                  03. Vocal Timbre
                </p>
                <h2 className="text-2xl font-bold text-[#231a0c]">
                  Choose Voice Actor Tone
                </h2>
              </div>
            </div>

            <p className="text-base font-medium text-[#554434]">
              Select Sunny&apos;s vocal register—from warm storybook warmth to
              playful cartoon brightness or dramatic depth.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              {VOICE_PROFILES.map((voice) => {
                const isSelected = voice.id === selectedVoice;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => onSelectVoice(voice.id)}
                    className={`rounded-full border-[3px] px-5 py-2.5 text-left transition-all cursor-pointer min-h-[54px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006398] ${
                      isSelected
                        ? 'border-[#231a0c] bg-[#5bb8fe] text-[#001d31] shadow-[0_4px_0_#006398]'
                        : 'border-[#dbc2ad] bg-[#fff8f3] text-[#231a0c] hover:bg-white'
                    }`}
                  >
                    <span className="block text-base font-bold leading-tight whitespace-nowrap">
                      {voice.label}
                    </span>
                    <span className="block text-xs font-semibold opacity-85 whitespace-nowrap">
                      {voice.tone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: How It Works + Final Launch Banner */}
        <section id="how-it-works" className="space-y-6 scroll-mt-24">
          <div>
            <p className="text-sm font-bold text-[#8b5000]">
              Stage Experience
            </p>
            <h2 className="text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] font-bold text-[#231a0c]">
              From Welcome Greeting to Live Voice Acting
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-[28px] border-[3px] border-[#eadfc7] bg-[#f8f4ea] p-6 space-y-2">
              <p className="text-sm font-bold text-[#8b5000]">Step 01</p>
              <h3 className="text-xl font-bold text-[#231a0c]">
                Cast Your Scene Partner
              </h3>
              <p className="text-base font-medium text-[#554434]">
                Choose a persona, vocal tone, and language (Dutch, English,
                Auto-Detect, and more).
              </p>
            </div>

            <div className="rounded-[28px] border-[3px] border-[#eadfc7] bg-[#f8f4ea] p-6 space-y-2">
              <p className="text-sm font-bold text-[#006398]">Step 02</p>
              <h3 className="text-xl font-bold text-[#231a0c]">
                Spoken Welcome Stage
              </h3>
              <p className="text-base font-medium text-[#554434]">
                Page 2 opens with Sunny greeting you aloud in character and
                activating your live studio mic.
              </p>
            </div>

            <div className="rounded-[28px] border-[3px] border-[#eadfc7] bg-[#f8f4ea] p-6 space-y-2">
              <p className="text-sm font-bold text-[#b0284b]">Step 03</p>
              <h3 className="text-xl font-bold text-[#231a0c]">
                Real-Time Voice Commands
              </h3>
              <p className="text-base font-medium text-[#554434]">
                Talk naturally—ask for tongue twisters, whisper cues, switch
                languages, or celebrate star takes!
              </p>
            </div>
          </div>

          {/* Bottom Launch Banner */}
          <div className="warm-ambient-shadow rounded-[32px] border-[3px] border-[#231a0c] bg-[#fff2e2] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#231a0c]">
                Ready to step onto the Welcome Stage?
              </h3>
              <p className="text-base font-semibold text-[#554434]">
                Starting as <strong>{activeRole.name}</strong> in{' '}
                <strong>
                  {activeLanguage.label} ({activeLanguage.nativeName})
                </strong>{' '}
                with <strong>{activeVoice.label}</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={onEnterStage}
              className="toy-btn-amber flex h-16 shrink-0 items-center justify-center gap-3 rounded-full border-[3px] border-[#231a0c] bg-[#ff9800] px-8 text-xl font-bold text-[#231a0c] whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006398]"
            >
              <Mic className="h-6 w-6 stroke-[2.5]" />
              <span>Enter Welcome Stage</span>
              <Sparkles className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

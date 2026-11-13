import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Compass,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  CHARACTER_ROLES,
  LANGUAGE_PROFILES,
  LEARNING_STAGES,
  VOICE_PROFILES,
  type CharacterRoleId,
  type LanguageCode,
  type LearningStageId,
  type VoiceName,
} from '../types/voice';
import { CharacterAvatar } from './CharacterAvatar';

interface LandingPageProps {
  selectedRoleId: CharacterRoleId;
  selectedVoice: VoiceName;
  selectedLanguage: LanguageCode;
  onSelectRole: (roleId: CharacterRoleId) => void;
  onSelectVoice: (voice: VoiceName) => void;
  onSelectLanguage: (language: LanguageCode) => void;
  onLaunchWelcomeStage: (opts?: {
    languageCode?: LanguageCode;
    stageId?: LearningStageId;
  }) => void;
}

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrDmXwxxWSXkagGvjA1DqfouAYO5bFkFufkYO7CSYX1-uhFppPgH5jUzEh4aQ0MCkfthDoVyEWt4lwxs7r0_17d-ZxbxgT5ziO0VqJ5pFEXuQR-Js9HgA4vATRpyzsAdL2b8MGITiqEGFJc2DLKOVasGcUaytoYyRwQXb-I6RZZFKXNmatWvR4U1xzEHT7XTpHE-o67bQQYfIQ_wbCMhs8lADQNichG0XlBsMTr7Dw';

function speakSample(text: string, lang: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech synthesis errors on unsupported browsers
  }
}

export function LandingPage({
  selectedRoleId,
  selectedVoice,
  selectedLanguage,
  onSelectRole,
  onSelectVoice,
  onSelectLanguage,
  onLaunchWelcomeStage,
}: LandingPageProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1d192c] antialiased">
      {/* Fixed Header matching code__2__fe7fc225.html */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fdf7ff]/85 backdrop-blur-xl border-b border-[rgba(31,27,46,0.06)] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-[1200px] mx-auto px-5 lg:px-8 flex items-center justify-between gap-6">
          <a
            href="#hero"
            className="flex items-center gap-2 group whitespace-nowrap shrink-0"
          >
            {!logoFailed ? (
              <img
                src={LOGO_URL}
                alt="LinGua Sprout Logo"
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed(true)}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2EC4B6] text-white font-black text-base">
                🌱
              </span>
            )}
            <span className="font-display text-2xl font-extrabold tracking-tight">
              <span className="text-[#1d192c]">Lin</span>
              <span className="text-[#6c4df6]">Gua</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-[#484555]">
            <a
              href="#stages"
              className="hover:text-[#1d192c] transition-colors whitespace-nowrap shrink-0"
            >
              Stages
            </a>
            <a
              href="#why-lingua"
              className="hover:text-[#1d192c] transition-colors whitespace-nowrap shrink-0"
            >
              Why LinGua
            </a>
            <a
              href="#languages"
              className="hover:text-[#1d192c] transition-colors whitespace-nowrap shrink-0"
            >
              Languages
            </a>
            <a
              href="#voice-cast"
              className="hover:text-[#1d192c] transition-colors whitespace-nowrap shrink-0"
            >
              Voice Cast
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onLaunchWelcomeStage()}
              className="inline-flex items-center justify-center font-display text-base font-extrabold bg-[#6c4df6] text-white rounded-full px-6 h-10 shadow-[0_4px_0_0_#5436D6] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all whitespace-nowrap cursor-pointer"
            >
              Get Started →
            </button>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 overflow-hidden">
        {/* ================================================================= */}
        {/* SECTION B — HERO */}
        {/* ================================================================= */}
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-[#fdf7ff] py-12 lg:py-20"
        >
          <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-[#532ddd]/10 blur-[90px]" />
          <div className="pointer-events-none absolute top-10 right-0 h-96 w-96 rounded-full bg-[#fd7958]/15 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#2EC4B6]/15 blur-[90px]" />

          <div className="relative max-w-[1200px] mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-7 flex flex-col items-start z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e5deff] px-3.5 py-1.5 shadow-sm">
                  <span className="text-xs font-bold text-[#532ddd]">✦</span>
                  <span className="font-display text-xs font-bold text-[#532ddd] tracking-wide">
                    Live Gemini Voice Companion · Built for beginners
                  </span>
                </div>

                <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.12] text-[#1d192c] font-black tracking-tight text-balance">
                  Start from{' '}
                  <span className="relative inline-block text-[#532ddd]">
                    ABCD
                    <svg
                      aria-hidden="true"
                      className="absolute -bottom-3 left-0 w-full"
                      fill="none"
                      viewBox="0 0 140 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 11C25 4 45 15 70 8C95 2 115 14 137 7"
                        stroke="#FFC845"
                        strokeLinecap="round"
                        strokeWidth="5"
                      />
                    </svg>
                  </span>
                  .<br />
                  End with confidence.
                </h1>

                <p className="text-lg text-[#484555] max-w-lg mt-6 leading-relaxed">
                  A live voice actor &amp; beginner-first language studio that
                  teaches in the right order — letters → sounds → numbers →
                  syllables → reading. Speak live in English, Dutch
                  (Nederlands), Twi &amp; more.
                </p>

                <div className="mt-8 flex items-center gap-4 flex-wrap w-full">
                  <button
                    type="button"
                    onClick={() => onLaunchWelcomeStage()}
                    className="toy-btn-violet inline-flex items-center justify-center gap-2.5 bg-[#6c4df6] text-white rounded-2xl px-8 py-4 font-display text-base font-extrabold cursor-pointer"
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start Free — Welcome Stage</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="#stages"
                    className="inline-flex items-center gap-3 bg-white text-[#1d192c] rounded-2xl px-6 py-3.5 font-display text-sm font-bold shadow-[0_4px_16px_rgba(31,27,46,0.06)] hover:bg-[#f7f1ff] transition-all"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#fd7958] flex items-center justify-center text-white shadow-inner">
                      <Play className="h-3.5 w-3.5 fill-current translate-x-0.5" />
                    </span>
                    <span>See how it works</span>
                  </a>
                </div>

                {/* Trust Proofs Strip */}
                <div className="mt-9 pt-6 w-full flex items-center gap-y-3 gap-x-6 flex-wrap font-display text-xs font-bold text-[#1d192c]">
                  {[
                    '100% free',
                    'Real-time voice AI',
                    'Kid & adult safe',
                    'Dutch · English · Twi +',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2EC4B6]/20 text-[#0c8a7e] flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: KOKO MASCOT & 5 FLOATING STAGE CARDS */}
              <div className="lg:col-span-5 flex items-center justify-center relative min-h-[480px] lg:min-h-[530px]">
                <div className="w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-gradient-to-tr from-[#532ddd]/15 via-[#f4bf3c]/20 to-[#2EC4B6]/20 blur-3xl absolute -z-10 animate-glow" />
                <div className="w-80 h-80 rounded-full border-2 border-dashed border-[#532ddd]/20 absolute -z-10 spin-slow" />

                <div className="absolute top-10 left-12 w-2.5 h-2.5 rounded-full bg-[#fd7958] shadow-sm animate-particle-1" />
                <div className="absolute top-28 right-12 w-3 h-3 rounded-full bg-[#2EC4B6] shadow-sm animate-particle-2" />
                <div className="absolute bottom-20 left-16 w-2 h-2 rounded-full bg-[#f4bf3c] shadow-sm animate-particle-3" />
                <div className="absolute bottom-16 right-16 w-2.5 h-2.5 rounded-full bg-[#6c4df6] shadow-sm animate-particle-4" />

                {/* Koko the Sprout Character */}
                <div className="relative z-10 animate-mascot-float flex items-center justify-center">
                  <svg
                    className="w-56 h-64 sm:w-64 sm:h-72 drop-shadow-xl"
                    fill="none"
                    viewBox="0 0 240 280"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Koko the LinGua Sprout voice companion"
                  >
                    <defs>
                      <radialGradient cx="45%" cy="40%" id="sproutGradient" r="65%">
                        <stop offset="0%" stopColor="#3CE7D8" />
                        <stop offset="65%" stopColor="#2EC4B6" />
                        <stop offset="100%" stopColor="#1FA89B" />
                      </radialGradient>
                      <radialGradient cx="50%" cy="40%" id="bellyHighlight" r="50%">
                        <stop offset="0%" stopColor="#80F5EA" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#3CE7D8" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <g className="animate-mascot-leaves">
                      <path
                        d="M120 70 C95 40 70 50 68 76 C66 98 100 88 120 74 Z"
                        fill="#2EC4B6"
                      />
                      <path
                        d="M120 70 C105 52 82 58 78 72"
                        stroke="#3CE7D8"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M120 72 C135 30 168 38 166 64 C164 84 135 80 120 72 Z"
                        fill="#38D9A9"
                      />
                      <path
                        d="M120 72 C134 46 154 50 152 64"
                        stroke="#80F5EA"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                      <circle cx="120" cy="74" fill="#1FA89B" r="5" />
                    </g>
                    <rect fill="#2EC4B6" height="20" rx="10" width="34" x="76" y="240" />
                    <rect fill="#FFFFFF" height="8" rx="4" width="38" x="74" y="254" />
                    <rect fill="#2EC4B6" height="20" rx="10" width="34" x="130" y="240" />
                    <rect fill="#FFFFFF" height="8" rx="4" width="38" x="128" y="254" />
                    <path
                      d="M64 165 C62 108 86 78 120 78 C154 78 178 108 176 165 C174 216 156 244 120 244 C84 244 66 216 64 165 Z"
                      fill="url(#sproutGradient)"
                    />
                    <ellipse cx="120" cy="180" fill="url(#bellyHighlight)" rx="36" ry="42" />
                    <path
                      d="M68 155 C52 165 48 185 58 192 C66 198 74 180 72 170"
                      fill="#2EC4B6"
                    />
                    <g className="animate-mascot-wave">
                      <path
                        d="M172 155 C190 148 206 130 196 118 C188 108 174 130 170 142"
                        fill="#2EC4B6"
                      />
                      <circle cx="196" cy="120" fill="#3CE7D8" r="8" />
                    </g>
                    <ellipse cx="88" cy="156" fill="#FF7A59" fillOpacity="0.45" rx="9" ry="5.5" />
                    <ellipse cx="152" cy="156" fill="#FF7A59" fillOpacity="0.45" rx="9" ry="5.5" />
                    <g className="animate-mascot-blink">
                      <ellipse cx="98" cy="136" fill="#FFFFFF" rx="13" ry="17" />
                      <ellipse cx="102" cy="138" fill="#1D192C" rx="8" ry="11" />
                      <circle cx="100" cy="133" fill="#FFFFFF" r="3.5" />
                      <circle cx="105" cy="142" fill="#FFFFFF" r="1.5" />
                      <ellipse cx="142" cy="136" fill="#FFFFFF" rx="13" ry="17" />
                      <ellipse cx="138" cy="138" fill="#1D192C" rx="8" ry="11" />
                      <circle cx="136" cy="133" fill="#FFFFFF" r="3.5" />
                      <circle cx="141" cy="142" fill="#FFFFFF" r="1.5" />
                    </g>
                    <path
                      d="M107 160 C114 172 126 172 133 160"
                      fill="none"
                      stroke="#1D192C"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                    <path d="M114 167 C117 171 123 171 126 167" fill="#FF7A59" />
                  </svg>
                </div>

                {/* 5 Floating Pedagogical Cards (Interactive!) */}
                <button
                  type="button"
                  onClick={() => onLaunchWelcomeStage({ stageId: 'alphabet' })}
                  className="hero-stage-card absolute top-2 left-2 sm:left-4 z-20 animate-float-card-1 bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(108,77,246,0.14)] w-[94px] h-[94px] flex flex-col items-center justify-center text-center"
                >
                  <span className="font-display text-2xl text-[#532ddd] font-black leading-none">
                    Aa
                  </span>
                  <span className="text-[10px] font-bold text-[#484555] mt-1">
                    🔤 A B C
                  </span>
                  <span className="text-[9px] font-semibold text-[#532ddd]/80 uppercase tracking-tighter mt-0.5">
                    Alphabet
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onLaunchWelcomeStage({ languageCode: 'nl' })}
                  className="hero-stage-card absolute top-4 right-2 sm:right-4 z-20 animate-float-card-2 bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(253,121,88,0.16)] w-[96px] h-[94px] flex flex-col items-center justify-center text-center"
                >
                  <span className="font-display text-2xl text-[#fd7958] font-black leading-none">
                    NL
                  </span>
                  <span className="text-[10px] font-bold text-[#484555] mt-1">
                    🇳🇱 Dutch
                  </span>
                  <span className="text-[9px] font-semibold text-[#fd7958] uppercase tracking-tighter mt-0.5">
                    Nederlands
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onLaunchWelcomeStage({ stageId: 'syllables' })}
                  className="hero-stage-card absolute top-[200px] -left-3 sm:left-1 z-20 animate-float-card-3 bg-white rounded-2xl px-3 py-2.5 shadow-[0_12px_28px_rgba(108,77,246,0.14)] flex flex-col items-center justify-center text-center"
                >
                  <div className="flex items-center gap-1 font-display text-lg">
                    <span className="text-[#532ddd] font-extrabold">B</span>
                    <span className="text-[#484555] text-xs">+</span>
                    <span className="text-[#532ddd] font-extrabold">A</span>
                    <span className="text-[#484555] text-xs">=</span>
                    <span className="text-[#2EC4B6] font-black text-xl">BA</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#484555] uppercase tracking-wider mt-0.5">
                    Step 4 • Syllables
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onLaunchWelcomeStage({ stageId: 'numbers' })}
                  className="hero-stage-card absolute top-[210px] -right-2 sm:right-2 z-20 animate-float-card-4 bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(244,191,60,0.2)] w-[88px] h-[88px] flex flex-col items-center justify-center text-center"
                >
                  <span className="font-display text-2xl text-[#f4bf3c] font-black leading-none">
                    3
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f4bf3c]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f4bf3c]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f4bf3c]" />
                  </div>
                  <span className="text-[9px] font-bold text-[#484555] uppercase tracking-tight mt-1">
                    Step 3 • Num
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onLaunchWelcomeStage({ stageId: 'introduce' })}
                  className="hero-stage-card absolute bottom-2 left-1/2 z-20 animate-float-card-5 bg-white rounded-2xl px-4 py-2.5 shadow-[0_12px_28px_rgba(31,27,46,0.12)] flex flex-col items-center text-center"
                >
                  <div className="font-display text-sm text-[#1d192c] flex items-center gap-1.5">
                    <span>👋</span>
                    <span className="font-bold">My name is…</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#532ddd] uppercase tracking-wider mt-0.5">
                    Step 5 • Real Dialogue
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION C — STAGE PROOF STRIP (The Correct Order) */}
        {/* ================================================================= */}
        <section id="stages" className="w-full bg-[#f7f1ff] py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="font-display text-xs text-[#532ddd] uppercase tracking-widest font-black">
                The Correct Order
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-[#1d192c]">
                Six stages. Zero confusion.
              </h2>
              <p className="mt-2 text-base text-[#484555]">
                Tap any stage to launch the live voice stage with Koko focused on
                that exact skill.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
              {LEARNING_STAGES.map((stage, idx) => {
                const badgeClass =
                  idx < 3
                    ? 'bg-[#e5deff] text-[#532ddd]'
                    : idx < 5
                      ? 'bg-[#ffdad2] text-[#a7391e]'
                      : 'bg-[#2EC4B6]/20 text-[#0c8a7e]';
                const barClass =
                  idx < 3
                    ? 'bg-[#532ddd]'
                    : idx < 5
                      ? 'bg-[#fd7958]'
                      : 'bg-[#2EC4B6]';
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => onLaunchWelcomeStage({ stageId: stage.id })}
                    className="group text-left bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 flex flex-col items-start cursor-pointer"
                  >
                    <div className="w-full flex items-center justify-between mb-3">
                      <span
                        className={`font-display text-xs font-black px-2 py-0.5 rounded-full ${badgeClass}`}
                      >
                        {stage.num}
                      </span>
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {stage.emoji}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-[#1d192c] font-bold">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-[#484555] mt-1">{stage.desc}</p>
                    <div className="mt-4 w-full h-1 rounded-full bg-[#f2ebff] overflow-hidden">
                      <div className={`w-full h-full rounded-full ${barClass}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION D — WHY LINGUA */}
        {/* ================================================================= */}
        <section id="why-lingua" className="w-full bg-[#fdf7ff] py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="font-display text-xs text-[#fd7958] uppercase tracking-widest font-black">
                Why LinGua
              </span>
              <h2 className="mt-2 font-display text-3xl font-black text-[#1d192c]">
                Built for the beginner others left behind.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_24px_rgba(31,27,46,0.04)] flex flex-col items-start hover:-translate-y-1 transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl bg-[#e5deff] text-[#532ddd] flex items-center justify-center mb-6">
                  <Compass className="h-7 w-7" />
                </div>
                <span className="font-display text-xs text-[#532ddd] uppercase font-bold tracking-wider mb-2">
                  Stage Precision
                </span>
                <h3 className="font-display text-2xl text-[#1d192c] font-extrabold mb-3 leading-snug">
                  Follows the real learning order
                </h3>
                <p className="text-base text-[#484555] leading-relaxed">
                  Mainstream apps jump straight into full complex sentences.
                  LinGua starts with ABC, distinct phonemes, and numbers —
                  exactly how natural language is built.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_24px_rgba(31,27,46,0.04)] flex flex-col items-start hover:-translate-y-1 transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl bg-[#ffdad2] text-[#a7391e] flex items-center justify-center mb-6">
                  <Mic className="h-7 w-7" />
                </div>
                <span className="font-display text-xs text-[#a7391e] uppercase font-bold tracking-wider mb-2">
                  Live Gemini Voice
                </span>
                <h3 className="font-display text-2xl text-[#1d192c] font-extrabold mb-3 leading-snug">
                  Listen, speak &amp; act in real time
                </h3>
                <p className="text-base text-[#484555] leading-relaxed">
                  Real-time voice conversation with expressive characters,
                  natural Dutch, English &amp; Twi audio, and instant voice
                  command switching.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_24px_rgba(31,27,46,0.04)] flex flex-col items-start hover:-translate-y-1 transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl bg-[#2EC4B6]/20 text-[#0c8a7e] flex items-center justify-center mb-6">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <span className="font-display text-xs text-[#0c8a7e] uppercase font-bold tracking-wider mb-2">
                  Zero Pressure
                </span>
                <h3 className="font-display text-2xl text-[#1d192c] font-extrabold mb-3 leading-snug">
                  Safe &amp; 100% free — for kids and adults
                </h3>
                <p className="text-base text-[#484555] leading-relaxed">
                  No advertisements, no subscriptions, no locked hearts, and no
                  aggressive streak guilt. Designed with warmth for learners
                  aged 6 to 90.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION E — LANGUAGES (English, Dutch & Twi + More) */}
        {/* ================================================================= */}
        <section id="languages" className="w-full bg-[#f7f1ff] py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="font-display text-xs text-[#0c8a7e] uppercase tracking-wider font-black">
                Languages
              </span>
              <h2 className="mt-2 font-display text-3xl font-black text-[#1d192c]">
                Start in your language.
              </h2>
              <p className="mt-2 text-base text-[#484555]">
                Tap any tile to hear a quick sample, or launch the live Gemini
                voice stage in Dutch, English, Twi, and more.
              </p>
            </div>

            {/* 3 Flagship Language Cards: English, Dutch, Twi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
              {/* English Card */}
              <div className="bg-white rounded-3xl p-7 lingua-card-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇬🇧</span>
                      <div>
                        <h3 className="font-display text-2xl text-[#1d192c] font-extrabold">
                          English
                        </h3>
                        <span className="text-xs text-[#484555]">
                          International Phonetics
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#484555] mt-4">
                    Master the 26 foundation letters, blend sounds, numbers
                    1-100, and expressive story lines.
                  </p>
                  <div className="mt-5">
                    <span className="font-display text-xs text-[#484555] uppercase tracking-wider block mb-2 font-bold">
                      Tap Tile to Hear
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['A', 'B', 'C', '1', 'Hi! 🔊'].map((tile) => (
                        <button
                          key={tile}
                          type="button"
                          onClick={() =>
                            speakSample(tile.replace(' 🔊', ''), 'en-US')
                          }
                          className="h-11 min-w-[44px] px-3 rounded-xl bg-[#f2ebff] text-[#532ddd] font-black font-display text-base flex items-center justify-center hover:bg-[#e5deff] transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                          {tile}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-7 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      onLaunchWelcomeStage({ languageCode: 'en' })
                    }
                    className="toy-btn-violet w-full inline-flex items-center justify-center gap-2 bg-[#6c4df6] text-white rounded-2xl py-3.5 font-display text-base font-extrabold cursor-pointer"
                  >
                    <span>Try English Live</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dutch (Nederlands) Card */}
              <div className="bg-white rounded-3xl p-7 shadow-[0_12px_32px_-8px_rgba(46,196,182,0.22)] ring-2 ring-[#2EC4B6]/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇳🇱</span>
                      <div>
                        <h3 className="font-display text-2xl text-[#1d192c] font-extrabold">
                          Dutch
                        </h3>
                        <span className="text-xs text-[#0c8a7e] font-semibold">
                          Nederlands · Klanken &amp; Stem
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#484555] mt-4">
                    Practice Dutch vowels, digraphs (IJ, OE, UI), friendly
                    greetings, and live storytelling in Nederlands.
                  </p>
                  <div className="mt-5">
                    <span className="font-display text-xs text-[#484555] uppercase tracking-wider block mb-2 font-bold">
                      Tap Tile to Hear
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['A', 'E', 'IJ', '1', 'Hallo! 🔊'].map((tile) => (
                        <button
                          key={tile}
                          type="button"
                          onClick={() =>
                            speakSample(tile.replace(' 🔊', ''), 'nl-NL')
                          }
                          className="h-11 min-w-[44px] px-3 rounded-xl bg-[#2EC4B6]/15 text-[#0c8a7e] font-black font-display text-base flex items-center justify-center hover:bg-[#2EC4B6]/30 transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                          {tile}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-7 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      onLaunchWelcomeStage({ languageCode: 'nl' })
                    }
                    className="toy-btn-teal w-full inline-flex items-center justify-center gap-2 bg-[#2EC4B6] text-white rounded-2xl py-3.5 font-display text-base font-extrabold cursor-pointer"
                  >
                    <span>Try Dutch Live</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Twi Card */}
              <div className="bg-white rounded-3xl p-7 shadow-[0_12px_32px_-8px_rgba(253,121,88,0.18)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇬🇭</span>
                      <div>
                        <h3 className="font-display text-2xl text-[#1d192c] font-extrabold">
                          Twi
                        </h3>
                        <span className="text-xs text-[#484555]">
                          Native Akan · Asante &amp; Akuapem
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#484555] mt-4">
                    Explore Akan phonemes (Ɛ, Ɔ, Gy, Ky), counting in Twi, tone
                    recognition, and warm greetings.
                  </p>
                  <div className="mt-5">
                    <span className="font-display text-xs text-[#484555] uppercase tracking-wider block mb-2 font-bold">
                      Tap Tile to Hear
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Ɛ', 'Ɔ', 'K', '1', 'Akwaaba 🔊'].map((tile) => (
                        <button
                          key={tile}
                          type="button"
                          onClick={() =>
                            speakSample(tile.replace(' 🔊', ''), 'en-GB')
                          }
                          className="h-11 min-w-[44px] px-3 rounded-xl bg-[#ffdad2] text-[#a7391e] font-black font-display text-base flex items-center justify-center hover:bg-[#ffb4a2] transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                          {tile}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-7 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      onLaunchWelcomeStage({ languageCode: 'tw' })
                    }
                    className="toy-btn-coral w-full inline-flex items-center justify-center gap-2 bg-[#fd7958] text-white rounded-2xl py-3.5 font-display text-base font-extrabold cursor-pointer"
                  >
                    <span>Try Twi Live</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Studio Cast & Additional Languages Panel */}
            <div
              id="voice-cast"
              className="mt-12 bg-white rounded-3xl p-6 sm:p-8 lingua-card-shadow space-y-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[#1d192c]">
                    Customize Your Voice Studio Cast
                  </h3>
                  <p className="text-sm text-[#484555] mt-1">
                    Pick any language, character partner, and voice tone before
                    entering the Welcome Stage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onLaunchWelcomeStage()}
                  className="toy-btn-violet inline-flex items-center justify-center gap-2 bg-[#6c4df6] text-white rounded-2xl px-6 py-3 font-display text-sm font-extrabold shrink-0 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Enter Welcome Stage</span>
                </button>
              </div>

              {/* All Languages Row */}
              <div>
                <p className="font-display text-xs font-black uppercase tracking-wider text-[#532ddd] mb-3">
                  All Spoken Languages
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {LANGUAGE_PROFILES.map((lang) => {
                    const selected = lang.code === selectedLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => onSelectLanguage(lang.code)}
                        className={`min-h-[44px] rounded-full border-2 px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
                          selected
                            ? 'border-[#1d192c] bg-[#e5deff] text-[#1a0063] shadow-[0_3px_0_#5436d6]'
                            : 'border-[#c9c4d8] bg-[#fdf7ff] text-[#1d192c] hover:bg-[#f7f1ff]'
                        }`}
                      >
                        {lang.label} · {lang.nativeName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Character Partners + Voice Tone */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <p className="font-display text-xs font-black uppercase tracking-wider text-[#532ddd] mb-3">
                    Scene Partner Character
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {CHARACTER_ROLES.map((role) => {
                      const isSelected = role.id === selectedRoleId;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => onSelectRole(role.id)}
                          className={`relative flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1d192c] bg-[#f7f1ff] shadow-[0_4px_0_#c9bfff]'
                              : 'border-[#e7dff9] bg-[#fdf7ff] hover:bg-[#f7f1ff]'
                          }`}
                        >
                          <CharacterAvatar
                            roleId={role.id}
                            size={44}
                            className="shrink-0"
                          />
                          <div className="min-w-0 flex-1 pr-5">
                            <p className="font-display text-sm font-extrabold text-[#1d192c] truncate">
                              {role.name}
                            </p>
                            <p className="text-xs text-[#484555] line-clamp-1">
                              {role.tagline}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2EC4B6] text-white">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <p className="font-display text-xs font-black uppercase tracking-wider text-[#532ddd] mb-3 flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4" />
                    <span>Voice Tone</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {VOICE_PROFILES.map((voice) => {
                      const isSelected = voice.id === selectedVoice;
                      return (
                        <button
                          key={voice.id}
                          type="button"
                          onClick={() => onSelectVoice(voice.id)}
                          className={`rounded-full border-2 px-4 py-2 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1d192c] bg-[#2EC4B6]/20 text-[#1d192c] shadow-[0_3px_0_#168f84]'
                              : 'border-[#e7dff9] bg-[#fdf7ff] text-[#1d192c] hover:bg-[#f7f1ff]'
                          }`}
                        >
                          <span className="block font-display text-sm font-extrabold leading-tight">
                            {voice.label}
                          </span>
                          <span className="block text-[11px] font-medium text-[#484555]">
                            {voice.tone}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION F — CTA BANNER */}
        {/* ================================================================= */}
        <section className="w-full py-16 lg:py-24 bg-[#fdf7ff]">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
            <div className="relative w-full rounded-3xl p-10 sm:p-14 lg:p-20 bg-[#6c4df6] overflow-hidden text-center text-white shadow-2xl">
              <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#f4bf3c]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#fd7958]/30 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-[#2EC4B6]/25 blur-2xl" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
                  <span>🌱</span>
                  <span>Sprout your language path</span>
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] lg:leading-tight font-black tracking-tight text-white">
                  Ready to speak your first line?
                </h2>
                <p className="mt-4 text-lg text-white/85 leading-relaxed">
                  Step onto the Welcome Stage with Koko, hear a live greeting in
                  your chosen language, and start speaking in real time.
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => onLaunchWelcomeStage()}
                    className="inline-flex items-center gap-2 bg-white text-[#6c4df6] rounded-2xl px-9 py-4 font-display text-base font-extrabold shadow-[0_6px_0_0_#432CAE] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#432CAE] active:translate-y-[6px] active:shadow-none transition-all cursor-pointer"
                  >
                    <span>Start Learning Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-5 text-sm text-white/75 font-medium">
                  No credit card • Free forever • Live Gemini Voice
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer matching code__2__fe7fc225.html */}
      <footer className="w-full bg-[#f7f1ff] border-t border-[rgba(31,27,46,0.06)]">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-5 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                {!logoFailed ? (
                  <img
                    src={LOGO_URL}
                    alt="LinGua Sprout Logo"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoFailed(true)}
                    className="h-7 w-auto object-contain"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2EC4B6] text-white text-sm">
                    🌱
                  </span>
                )}
                <span className="font-display text-xl font-extrabold">
                  <span className="text-[#1d192c]">Lin</span>
                  <span className="text-[#6c4df6]">Gua</span>
                </span>
              </div>
              <p className="text-sm text-[#484555] max-w-sm mt-1">
                Start from ABCD. End with confidence. Live voice-first language
                and acting practice in English, Dutch, Twi, and more.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-7 flex flex-col gap-2">
              <span className="font-display text-sm font-extrabold text-[#1d192c] uppercase tracking-wider">
                Product
              </span>
              <a
                href="#stages"
                className="text-sm text-[#484555] hover:text-[#1d192c] transition-colors"
              >
                Phonetic Stages
              </a>
              <a
                href="#languages"
                className="text-sm text-[#484555] hover:text-[#1d192c] transition-colors"
              >
                Languages &amp; Dutch
              </a>
              <a
                href="#why-lingua"
                className="text-sm text-[#484555] hover:text-[#1d192c] transition-colors"
              >
                Sprout Methodology
              </a>
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              <span className="font-display text-sm font-extrabold text-[#1d192c] uppercase tracking-wider">
                Voice Studio
              </span>
              <button
                type="button"
                onClick={() => onLaunchWelcomeStage({ languageCode: 'nl' })}
                className="text-left text-sm text-[#484555] hover:text-[#1d192c] transition-colors cursor-pointer"
              >
                Start Dutch Session
              </button>
              <button
                type="button"
                onClick={() => onLaunchWelcomeStage({ languageCode: 'en' })}
                className="text-left text-sm text-[#484555] hover:text-[#1d192c] transition-colors cursor-pointer"
              >
                Start English Session
              </button>
              <button
                type="button"
                onClick={() => onLaunchWelcomeStage({ languageCode: 'tw' })}
                className="text-left text-sm text-[#484555] hover:text-[#1d192c] transition-colors cursor-pointer"
              >
                Start Twi Session
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(31,27,46,0.06)] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-sm text-[#484555]">
              © 2026 LinGua. Free forever for learners.
            </p>
            <span className="font-display text-xs font-bold text-[#797587]">
              English • Nederlands (Dutch) • Twi • Español • Français
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

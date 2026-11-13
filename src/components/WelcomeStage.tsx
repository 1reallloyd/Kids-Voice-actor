import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Mic, Sparkles, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { ConnectionStatus } from '../hooks/useGeminiLive';
import {
  CHARACTER_ROLES,
  LANGUAGE_PROFILES,
  type CharacterRoleId,
  type LanguageCode,
  type OrbState,
} from '../types/voice';
import { LivingOrb } from './LivingOrb';

interface WelcomeStageProps {
  roleId: CharacterRoleId;
  languageCode: LanguageCode;
  stageTitle?: string | null;
  orbState: OrbState;
  outputLevel: number;
  connectionStatus: ConnectionStatus;
  welcomeText: string;
  welcomeFinished: boolean;
  error: string | null;
  onStartConversation: () => void;
  onBackToHome: () => void;
  onRetry: () => void;
}

export function WelcomeStage({
  roleId,
  languageCode,
  stageTitle,
  orbState,
  outputLevel,
  connectionStatus,
  welcomeText,
  welcomeFinished,
  error,
  onStartConversation,
  onBackToHome,
  onRetry,
}: WelcomeStageProps) {
  const role = CHARACTER_ROLES.find((r) => r.id === roleId) ?? CHARACTER_ROLES[0];
  const language =
    LANGUAGE_PROFILES.find((l) => l.code === languageCode) ??
    LANGUAGE_PROFILES[0];

  useEffect(() => {
    if (!welcomeFinished) return;
    const timer = window.setTimeout(() => {
      onStartConversation();
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [welcomeFinished, onStartConversation]);

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1d192c] flex flex-col relative overflow-hidden">
      {/* Soft LinGua Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-[#6c4df6]/10 blur-[90px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-96 w-96 rounded-full bg-[#2ec4b6]/15 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#fd7958]/10 blur-[90px]" />

      {/* Compact Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="toy-btn-soft inline-flex items-center gap-2 rounded-full border-2 border-[#c9c4d8] bg-white px-5 py-2.5 text-sm sm:text-base font-bold text-[#1d192c] hover:bg-[#f7f1ff] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Back to LinGua</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#e5deff] px-3.5 py-1.5 text-xs font-extrabold text-[#532ddd]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              Welcome Stage · {role.name} · {language.nativeName}
              {stageTitle ? ` · ${stageTitle}` : ''}
            </span>
          </span>
          <span className="sm:hidden text-xs font-extrabold text-[#532ddd]">
            {role.name} · {language.shortCode}
          </span>
        </div>
      </header>

      {/* Main Centered Welcome Experience */}
      <main className="relative z-10 mx-auto flex w-full max-w-[820px] flex-1 flex-col items-center justify-center px-5 pb-12 text-center">
        {error ? (
          <div className="w-full max-w-lg rounded-3xl border-2 border-[#fd7958] bg-white p-8 space-y-5 lingua-card-shadow">
            <h1 className="font-display text-2xl font-black text-[#a7391e]">
              Could not reach the Live Voice Stage
            </h1>
            <p className="text-base font-medium text-[#484555]">{error}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="toy-btn-violet rounded-2xl bg-[#6c4df6] px-7 py-3.5 font-display text-base font-extrabold text-white cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="toy-btn-soft rounded-2xl border-2 border-[#c9c4d8] bg-[#f7f1ff] px-7 py-3.5 font-display text-base font-bold text-[#1d192c] cursor-pointer"
              >
                Back to Studio
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex w-full flex-col items-center gap-6"
          >
            <div className="space-y-2">
              <p className="font-display text-sm sm:text-base font-extrabold text-[#532ddd] flex items-center justify-center gap-2">
                <Volume2 className="h-5 w-5 text-[#2EC4B6]" />
                <span>
                  {welcomeFinished
                    ? 'Welcome complete — opening live conversation!'
                    : connectionStatus === 'connecting'
                      ? 'Warming up the studio microphone...'
                      : `${role.name} is welcoming you in ${language.nativeName}!`}
                </span>
              </p>
              <h1 className="font-display text-[32px] leading-[40px] sm:text-[42px] sm:leading-[50px] font-black text-[#1d192c] text-balance">
                Welcome to LinGua Live Stage!
              </h1>
              {stageTitle && (
                <p className="text-sm font-bold text-[#0c8a7e]">
                  Focused warmup: {stageTitle}
                </p>
              )}
            </div>

            {/* Centerpiece Living Orb */}
            <LivingOrb
              state={welcomeFinished ? 'cheering' : orbState}
              roleId={roleId}
              outputLevel={outputLevel}
              size="lg"
            />

            {/* Storybook Welcome Speech Bubble */}
            <div className="relative w-full max-w-2xl rounded-3xl border-2 border-[#e7dff9] bg-white p-6 sm:p-8 lingua-card-shadow">
              <div
                className="absolute -top-3.5 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-t-2 border-l-2 border-[#e7dff9] bg-white"
                aria-hidden="true"
              />
              <p className="text-[20px] leading-[30px] sm:text-[22px] sm:leading-[32px] font-semibold text-[#1d192c] min-h-[64px] flex items-center justify-center">
                {welcomeText
                  ? welcomeText
                  : connectionStatus === 'connecting'
                    ? 'Connecting your live Gemini voice partner...'
                    : `Listen closely — ${role.name.split(' ')[0]} is greeting you in ${language.nativeName}!`}
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartConversation}
                className="toy-btn-teal flex h-16 items-center justify-center gap-3 rounded-2xl bg-[#2EC4B6] px-8 font-display text-lg sm:text-xl font-extrabold text-white cursor-pointer"
              >
                <Mic className="h-6 w-6 stroke-[2.5]" />
                <span>
                  {welcomeFinished
                    ? 'Entering Live Stage...'
                    : 'Start Conversation Now'}
                </span>
                <ArrowRight className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

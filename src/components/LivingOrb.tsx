import { motion } from 'motion/react';
import type { CharacterRoleId, OrbState } from '../types/voice';

interface LivingOrbProps {
  state: OrbState;
  roleId: CharacterRoleId;
  inputLevel?: number;
  outputLevel?: number;
  size?: 'md' | 'lg';
}

export function LivingOrb({
  state,
  roleId,
  inputLevel = 0,
  outputLevel = 0,
  size = 'lg',
}: LivingOrbProps) {
  const activeLevel =
    state === 'listening'
      ? inputLevel
      : state === 'speaking'
        ? outputLevel
        : state === 'cheering'
          ? 0.75
          : 0.08;

  const orbScale = 1 + activeLevel * 0.14;
  const ringScale1 = 1.15 + activeLevel * 0.28;
  const ringScale2 = 1.32 + activeLevel * 0.45;

  const dimension = size === 'lg' ? 196 : 148;

  const gradientColors =
    state === 'listening'
      ? {
          top: '#3CE7D8',
          bottom: '#2EC4B6',
          lip: '#168F84',
          glow: 'rgba(46, 196, 182, 0.36)',
          ring1: '#80F5EA',
          ring2: '#CCFBF1',
        }
      : state === 'cheering'
        ? {
            top: '#FFD86B',
            bottom: '#FFC845',
            lip: '#C9910C',
            glow: 'rgba(255, 200, 69, 0.42)',
            ring1: '#FFDF9E',
            ring2: '#FFDAD2',
          }
        : state === 'speaking'
          ? {
              top: '#866BFF',
              bottom: '#6C4DF6',
              lip: '#5436D6',
              glow: 'rgba(108, 77, 246, 0.40)',
              ring1: '#C9BFFF',
              ring2: '#E5DEFF',
            }
          : {
              top: '#3CE7D8',
              bottom: '#2EC4B6',
              lip: '#168F84',
              glow: 'rgba(46, 196, 182, 0.30)',
              ring1: '#C9BFFF',
              ring2: '#E5DEFF',
            };

  const mouthHeight =
    state === 'speaking'
      ? Math.max(8, Math.min(26, 8 + outputLevel * 28))
      : state === 'cheering'
        ? 20
        : state === 'listening'
          ? 6 + inputLevel * 12
          : 5;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: dimension + 84, height: dimension + 64 }}
    >
      {/* Concentric Audio Aura Rings */}
      <motion.div
        animate={{
          scale: state === 'idle' ? [1.08, 1.16, 1.08] : ringScale2,
          opacity: state === 'idle' ? 0.3 : 0.38 + activeLevel * 0.35,
        }}
        transition={
          state === 'idle'
            ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.12, ease: 'easeOut' }
        }
        className="absolute rounded-[44%]"
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: gradientColors.ring2,
        }}
      />

      <motion.div
        animate={{
          scale: state === 'idle' ? [1.03, 1.09, 1.03] : ringScale1,
          opacity: state === 'idle' ? 0.48 : 0.55 + activeLevel * 0.35,
        }}
        transition={
          state === 'idle'
            ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }
            : { duration: 0.1, ease: 'easeOut' }
        }
        className="absolute rounded-[42%]"
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: gradientColors.ring1,
        }}
      />

      {/* Starburst Cheering Particles */}
      {state === 'cheering' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => (
            <motion.span
              key={deg}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [0.4, 1.2, 0.8],
                opacity: [0, 1, 0],
                x: Math.cos((deg * Math.PI) / 180) * (dimension * 0.72),
                y: Math.sin((deg * Math.PI) / 180) * (dimension * 0.72),
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: idx * 0.08,
                ease: 'easeOut',
              }}
              className="absolute h-4 w-4 rounded-full"
              style={{
                backgroundColor:
                  idx % 3 === 0
                    ? '#FD7958'
                    : idx % 3 === 1
                      ? '#6C4DF6'
                      : '#2EC4B6',
              }}
            />
          ))}
        </div>
      )}

      {/* Speaking Sound-Wave Bars */}
      {state === 'speaking' && (
        <>
          <div className="pointer-events-none absolute left-2 flex items-center gap-1.5">
            {[0.55, 0.95, 0.7].map((mult, idx) => (
              <motion.span
                key={`l-${idx}`}
                animate={{
                  scaleY: 0.4 + outputLevel * mult * 1.6,
                }}
                transition={{ duration: 0.08 }}
                className="h-8 w-2 rounded-full bg-[#6C4DF6]"
              />
            ))}
          </div>
          <div className="pointer-events-none absolute right-2 flex items-center gap-1.5">
            {[0.7, 0.95, 0.55].map((mult, idx) => (
              <motion.span
                key={`r-${idx}`}
                animate={{
                  scaleY: 0.4 + outputLevel * mult * 1.6,
                }}
                transition={{ duration: 0.08 }}
                className="h-8 w-2 rounded-full bg-[#FD7958]"
              />
            ))}
          </div>
        </>
      )}

      {/* Main Squircle Living Orb Core */}
      <motion.div
        animate={{
          scale: state === 'idle' ? [1, 1.03, 1] : orbScale,
          y: state === 'cheering' ? [0, -10, 0] : 0,
        }}
        transition={
          state === 'idle'
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            : state === 'cheering'
              ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.09, ease: 'easeOut' }
        }
        className="relative flex flex-col items-center justify-center rounded-[38%] border-4 border-[#1D192C]"
        style={{
          width: dimension,
          height: dimension,
          background: `linear-gradient(160deg, ${gradientColors.top} 0%, ${gradientColors.bottom} 100%)`,
          boxShadow: `0 10px 0 ${gradientColors.lip}, 0 24px 48px -10px ${gradientColors.glow}`,
        }}
      >
        <RoleCrown roleId={roleId} />

        {/* Gloss highlight */}
        <div
          className="pointer-events-none absolute top-4 left-7 h-5 w-14 -rotate-12 rounded-full bg-white/35"
          aria-hidden="true"
        />

        {/* Expressive Eyes */}
        <div className="mt-2 flex items-center gap-7">
          {state === 'cheering' ? (
            <>
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                <path
                  d="M3 13C6 4 18 4 21 13"
                  stroke="#1D192C"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                <path
                  d="M3 13C6 4 18 4 21 13"
                  stroke="#1D192C"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  times: [0, 0.45, 0.48, 0.52, 1],
                }}
                className="relative flex h-8 w-6 items-center justify-center rounded-full bg-white"
              >
                <span className="relative h-5 w-4 rounded-full bg-[#1D192C]">
                  <span className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </motion.div>
              <motion.div
                animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  times: [0, 0.45, 0.48, 0.52, 1],
                }}
                className="relative flex h-8 w-6 items-center justify-center rounded-full bg-white"
              >
                <span className="relative h-5 w-4 rounded-full bg-[#1D192C]">
                  <span className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </motion.div>
            </>
          )}
        </div>

        {/* Rosy Cheeks + Animated Mouth */}
        <div className="mt-3 flex items-center gap-5">
          <span className="h-3.5 w-5 rounded-full bg-[#FD7958]/70" />
          <div className="flex h-8 w-12 items-center justify-center">
            {state === 'idle' ? (
              <svg width="34" height="16" viewBox="0 0 34 16" fill="none">
                <path
                  d="M4 4C9 12 25 12 30 4"
                  stroke="#1D192C"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <motion.div
                animate={{ height: mouthHeight }}
                transition={{ duration: 0.07 }}
                className="w-9 rounded-full border-[3px] border-[#1D192C] bg-[#FD7958]"
                style={{ minHeight: 8 }}
              />
            )}
          </div>
          <span className="h-3.5 w-5 rounded-full bg-[#FD7958]/70" />
        </div>
      </motion.div>
    </div>
  );
}

function RoleCrown({ roleId }: { roleId: CharacterRoleId }) {
  if (roleId === 'narrator') {
    return (
      <svg
        width="68"
        height="34"
        viewBox="0 0 68 34"
        fill="none"
        className="pointer-events-none absolute -top-7"
        aria-hidden="true"
      >
        <path
          d="M34 30 C20 12 6 18 6 28 C6 36 24 34 34 30 Z"
          fill="#2EC4B6"
          stroke="#1D192C"
          strokeWidth="2.5"
        />
        <path
          d="M34 30 C42 6 62 12 60 24 C58 34 42 33 34 30 Z"
          fill="#38D9A9"
          stroke="#1D192C"
          strokeWidth="2.5"
        />
      </svg>
    );
  }
  if (roleId === 'pirate') {
    return (
      <svg
        width="88"
        height="42"
        viewBox="0 0 88 42"
        fill="none"
        className="pointer-events-none absolute -top-9"
        aria-hidden="true"
      >
        <path
          d="M8 36C14 10 30 8 44 14C58 8 74 10 80 36Z"
          fill="#1D192C"
          stroke="#1D192C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="23" r="5" fill="#FFC845" />
      </svg>
    );
  }
  if (roleId === 'dragon') {
    return (
      <div className="pointer-events-none absolute -top-7 flex w-28 justify-between" aria-hidden="true">
        <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
          <path d="M6 26L4 4L22 20Z" fill="#FFC845" stroke="#1D192C" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
          <path d="M20 26L22 4L4 20Z" fill="#FFC845" stroke="#1D192C" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (roleId === 'wizard') {
    return (
      <svg
        width="84"
        height="46"
        viewBox="0 0 84 46"
        fill="none"
        className="pointer-events-none absolute -top-10"
        aria-hidden="true"
      >
        <path
          d="M14 38H70L44 4L14 38Z"
          fill="#532DDD"
          stroke="#1D192C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <ellipse cx="42" cy="38" rx="34" ry="6" fill="#FFC845" stroke="#1D192C" strokeWidth="3" />
      </svg>
    );
  }
  if (roleId === 'explorer') {
    return (
      <svg
        width="32"
        height="26"
        viewBox="0 0 32 26"
        fill="none"
        className="pointer-events-none absolute -top-6"
        aria-hidden="true"
      >
        <line x1="16" y1="9" x2="16" y2="25" stroke="#1D192C" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="16" cy="7" r="5" fill="#FFC845" stroke="#1D192C" strokeWidth="3" />
      </svg>
    );
  }
  if (roleId === 'hero') {
    return (
      <svg
        width="38"
        height="34"
        viewBox="0 0 38 34"
        fill="none"
        className="pointer-events-none absolute -top-7"
        aria-hidden="true"
      >
        <path
          d="M22 2L8 18H18L14 32L30 15H20L22 2Z"
          fill="#FFC845"
          stroke="#1D192C"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return null;
}

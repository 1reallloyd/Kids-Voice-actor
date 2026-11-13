import type { CharacterRoleId } from '../types/voice';

interface CharacterAvatarProps {
  roleId: CharacterRoleId;
  size?: number;
  className?: string;
}

export function CharacterAvatar({
  roleId,
  size = 52,
  className = '',
}: CharacterAvatarProps) {
  switch (roleId) {
    case 'dragon':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="20" fill="#DCFCE7" />
          {/* Little horns */}
          <path d="M18 22L13 10L24 17Z" fill="#FFB800" stroke="#231A0C" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M46 22L51 10L40 17Z" fill="#FFB800" stroke="#231A0C" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Dragon head */}
          <rect x="14" y="18" width="36" height="32" rx="16" fill="#22C55E" stroke="#231A0C" strokeWidth="2.5" />
          {/* Snout */}
          <rect x="20" y="34" width="24" height="14" rx="7" fill="#86EFAC" stroke="#231A0C" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="24" cy="28" r="3.2" fill="#231A0C" />
          <circle cx="40" cy="28" r="3.2" fill="#231A0C" />
          <circle cx="25" cy="27" r="1.1" fill="#FFFFFF" />
          <circle cx="41" cy="27" r="1.1" fill="#FFFFFF" />
          {/* Nostrils + Smile */}
          <circle cx="27" cy="39" r="1.6" fill="#231A0C" />
          <circle cx="37" cy="39" r="1.6" fill="#231A0C" />
          <path d="M27 43C29 45.5 35 45.5 37 43" stroke="#231A0C" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'pirate':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="20" fill="#E0F2FE" />
          {/* Face */}
          <circle cx="32" cy="36" r="16" fill="#FFDCBE" stroke="#231A0C" strokeWidth="2.5" />
          {/* Captain Hat */}
          <path
            d="M11 26C14 14 24 12 32 15C40 12 50 14 53 26Z"
            fill="#00476E"
            stroke="#231A0C"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="20" r="3" fill="#FFB800" />
          {/* Eyepatch & Eye */}
          <path d="M18 32L46 31" stroke="#231A0C" strokeWidth="2.2" />
          <circle cx="25" cy="34" r="4.5" fill="#231A0C" />
          <circle cx="39" cy="34" r="3" fill="#231A0C" />
          <circle cx="40" cy="33" r="1" fill="#FFFFFF" />
          {/* Smile */}
          <path d="M25 43C28 46.5 36 46.5 39 43" stroke="#231A0C" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'hero':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="20" fill="#FFE4E9" />
          {/* Cape shoulders */}
          <path d="M14 54C16 44 48 44 50 54" fill="#FF6584" stroke="#231A0C" strokeWidth="2.5" />
          {/* Head */}
          <circle cx="32" cy="33" r="15" fill="#FFDCBE" stroke="#231A0C" strokeWidth="2.5" />
          {/* Hero Mask */}
          <path
            d="M18 30C18 27 23 26 27 28L32 30L37 28C41 26 46 27 46 30C46 34 42 36 37 35L32 33L27 35C22 36 18 34 18 30Z"
            fill="#B0284B"
            stroke="#231A0C"
            strokeWidth="2"
          />
          <circle cx="25" cy="31" r="2.2" fill="#FFFFFF" />
          <circle cx="39" cy="31" r="2.2" fill="#FFFFFF" />
          {/* Lightning Crest */}
          <path d="M34 10L27 20H33L30 27L39 17H33L34 10Z" fill="#FFB800" stroke="#231A0C" strokeWidth="2" strokeLinejoin="round" />
          {/* Big Grin */}
          <path d="M26 40C29 43.5 35 43.5 38 40" stroke="#231A0C" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'explorer':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="20" fill="#CCE5FF" />
          {/* Antenna */}
          <line x1="32" y1="9" x2="32" y2="16" stroke="#231A0C" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="8" r="3.5" fill="#FF9800" stroke="#231A0C" strokeWidth="2" />
          {/* Helmet */}
          <circle cx="32" cy="34" r="18" fill="#FFFFFF" stroke="#231A0C" strokeWidth="2.5" />
          {/* Visor */}
          <rect x="19" y="24" width="26" height="17" rx="8.5" fill="#0284C7" stroke="#231A0C" strokeWidth="2.2" />
          {/* Visor Glint & Eyes */}
          <circle cx="27" cy="32" r="2.5" fill="#FFFFFF" />
          <circle cx="37" cy="32" r="2.5" fill="#FFFFFF" />
          <path d="M23 28C25 26.5 28 26.5 30 27" stroke="#93CCFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 36.5C30.5 38.5 33.5 38.5 36 36.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'wizard':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="20" fill="#FFDCBE" />
          {/* Face */}
          <circle cx="32" cy="39" r="14" fill="#FFF2E2" stroke="#231A0C" strokeWidth="2.5" />
          {/* Wizard Hat */}
          <path d="M13 30H51L33 10L13 30Z" fill="#8B5000" stroke="#231A0C" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="32" cy="30" rx="21" ry="4.5" fill="#FF9800" stroke="#231A0C" strokeWidth="2.2" />
          <circle cx="33" cy="20" r="2.5" fill="#FFE8A3" />
          {/* Eyes & Smile */}
          <circle cx="27" cy="38" r="2.6" fill="#231A0C" />
          <circle cx="37" cy="38" r="2.6" fill="#231A0C" />
          <path d="M27 44C29.5 46.5 34.5 46.5 37 44" stroke="#231A0C" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'narrator':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="64" height="64" rx="20" fill="#E5DEFF" />
          {/* Twin Sprout Leaves */}
          <path d="M32 18C24 10 17 13 17 19C17 24 26 22 32 19Z" fill="#2EC4B6" stroke="#1D192C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 18C37 9 47 11 46 18C45 23 36 22 32 19Z" fill="#38D9A9" stroke="#1D192C" strokeWidth="2" strokeLinejoin="round" />
          {/* Koko Sprout Body */}
          <rect x="17" y="20" width="30" height="32" rx="15" fill="#2EC4B6" stroke="#1D192C" strokeWidth="2.4" />
          {/* Eyes & Cheeks */}
          <circle cx="26" cy="34" r="2.8" fill="#1D192C" />
          <circle cx="38" cy="34" r="2.8" fill="#1D192C" />
          <circle cx="27" cy="33" r="1" fill="#FFFFFF" />
          <circle cx="39" cy="33" r="1" fill="#FFFFFF" />
          <ellipse cx="22" cy="39" rx="3" ry="1.8" fill="#FD7958" fillOpacity="0.65" />
          <ellipse cx="42" cy="39" rx="3" ry="1.8" fill="#FD7958" fillOpacity="0.65" />
          <path d="M27.5 40C29.5 43.5 34.5 43.5 36.5 40" stroke="#1D192C" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
}

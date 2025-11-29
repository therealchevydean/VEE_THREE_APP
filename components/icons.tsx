import React from 'react';

interface IconProps {
  className?: string;
}

export const MapIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const MissionsIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const VaultIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <line x1="12" y1="16" x2="12" y2="4"></line>
  </svg>
);

export const ProfileIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const CheckCircleIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export const XCircleIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

export const UploadCloudIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);

export const LeaderboardIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

export const SparklesIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
    </svg>
);

export const MagicWandIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 4V2"/>
        <path d="M15 10V8"/>
        <path d="M15 16v-2"/>
        <path d="M21.17 11.17a2.83 2.83 0 0 0-4 0l-1.17 1.17a2.83 2.83 0 0 0 0 4L17.17 19a2.83 2.83 0 0 0 4 0l1.17-1.17a2.83 2.83 0 0 0 0-4Z"/>
        <path d="m3 3 3 3"/>
        <path d="M9 3l-3 3"/>
        <path d="M3 9l3-3"/>
        <path d="M14 6.83 17.17 10"/>
        <path d="m.83 14.83 4 4"/>
        <path d="m7.17 14.83 4 4"/>
    </svg>
);

export const CameraIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
    </svg>
);

export const CompassIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
);

export const ChestIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
        <path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
        <path d="M12 14v-2" />
        <path d="M8 8l8-4" />
        <path d="M16 8l-8-4" />
    </svg>
);

export const LayersIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

export const SatelliteIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 20l-5-5"/>
        <path d="m12 12 4-4"/>
        <path d="m14 10 6-6"/>
        <path d="M21 3l-6.5 6.5"/>
        <path d="m16.5 16.5 1-1"/>
        <path d="m20 12-2 2"/>
        <path d="M18 14 12.5 9.5"/>
        <path d="M21 21 12 12"/>
        <path d="M11 13 8 10"/>
        <path d="m14 17-3-3"/>
        <path d="m18 21-3-3"/>
    </svg>
);

export const TerrainIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 21 6-6 4 4 8-8" />
        <path d="M3 16l6-6 4 4 8-8" />
    </svg>
);

// FIX: Add BotIcon to be used in AssistantFAB and AssistantModal.
export const BotIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

// FIX: Add SendIcon to be used in AssistantModal.
export const SendIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const NavigationIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const MinusIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const FocusIcon = ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M3 12h2"></path>
        <path d="M19 12h2"></path>
        <path d="M12 3v2"></path>
        <path d="M12 19v2"></path>
    </svg>
);

export const V3Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="V3 Logo"
    width="100%" 
    height="100%"
  >
    <defs>
      <linearGradient id="v3-final-gold" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#F9A825" />
      </linearGradient>
      
      <pattern id="v3-honeycomb-gold-texture" patternUnits="userSpaceOnUse" width="10" height="12" x="-5" y="-6">
        <path d="M5 0 l5 3 v6 l-5 3 l-5 -3 v-6 Z" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="0.7" />
      </pattern>
      
      <pattern id="v3-honeycomb-dark-texture" patternUnits="userSpaceOnUse" width="10" height="12" x="-5" y="-6">
        <path d="M5 0 l5 3 v6 l-5 3 l-5 -3 v-6 Z" fill="none" stroke="#F9A825" strokeOpacity="0.7" strokeWidth="0.8" />
      </pattern>

      <filter id="v3-final-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    
    <g filter="url(#v3-final-shadow)">
      {/* Gold Splash Background */}
      <path 
        d="M124,76 C132,82 131,96 122,103 C113,110 111,121 118,126 C125,131 114,136 108,130 C102,124 100,115 91,116 C82,117 78,125 70,123 C62,121 62,111 68,106 C74,101 70,91 63,90 C56,89 54,98 49,94 C44,90 49,81 57,78 C65,75 66,66 74,65 C82,64 85,73 93,71 C101,69 104,61 113,65 C122,69 118,71 124,76 Z"
        fill="url(#v3-final-gold)"
      />
      
      {/* "V" Shape */}
      <g>
        <path 
          d="M8,8 L44,120 L60,120 L51,30 L72,120 L88,120 L52,8 Z"
          fill="#1E1E1E"
        />
        <path 
          d="M8,8 L44,120 L60,120 L51,30 L72,120 L88,120 L52,8 Z"
          fill="url(#v3-honeycomb-dark-texture)"
        />
        <path 
          d="M8,8 L44,120 L60,120 L51,30 L72,120 L88,120 L52,8 Z"
          fill="none"
          stroke="url(#v3-final-gold)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
      
      {/* "3" Shape */}
      <g>
        {/* 3 black underlay for depth */}
        <path
          d="M60 22 C 85 18, 115 30, 110 58 C 105 80, 85 75, 75 75 C 90 80, 120 85, 112 112 C 105 135, 70 125, 60 110 L 70 110 C 85 120, 100 110, 100 95 C 100 80, 85 85, 78 85 L 78 78 C 85 78, 100 70, 100 52 C 100 35, 85 28, 70 32 L60 22 Z"
          fill="#1E1E1E"
        />
        {/* 3 gold fill and texture */}
        <path
          d="M63 20 C 88 16, 118 28, 113 56 C 108 78, 88 73, 78 73 C 93 78, 123 83, 115 110 C 108 133, 73 123, 63 108 L 73 108 C 88 118, 103 108, 103 93 C 103 78, 88 83, 81 83 L 81 76 C 88 76, 103 68, 103 50 C 103 33, 88 26, 73 30 L63 20 Z"
          fill="url(#v3-final-gold)"
        />
        <path
          d="M63 20 C 88 16, 118 28, 113 56 C 108 78, 88 73, 78 73 C 93 78, 123 83, 115 110 C 108 133, 73 123, 63 108 L 73 108 C 88 118, 103 108, 103 93 C 103 78, 88 83, 81 83 L 81 76 C 88 76, 103 68, 103 50 C 103 33, 88 26, 73 30 L63 20 Z"
          fill="url(#v3-honeycomb-gold-texture)"
        />
      </g>
    </g>
  </svg>
);
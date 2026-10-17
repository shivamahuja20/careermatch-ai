import React from 'react';

/** CareerMatch mark: two documents meeting at a check, on the signal-gradient tile. */
export const LogoMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ borderRadius: 10, boxShadow: 'var(--tp-glow)' }}>
    <defs>
      <linearGradient id="cm-logo-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7a66f2" />
        <stop offset=".55" stopColor="#12b5d9" />
        <stop offset="1" stopColor="#8fd65a" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="10" fill="url(#cm-logo-g)" />
    <rect x="6.5" y="8" width="9" height="12" rx="2" fill="none" stroke="#0b0d1a" strokeWidth="2" />
    <rect x="16.5" y="12" width="9" height="12" rx="2" fill="none" stroke="#0b0d1a" strokeWidth="2" />
    <path d="M13 20.5l2.6 2.6 5.2-5.6" fill="none" stroke="#0b0d1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

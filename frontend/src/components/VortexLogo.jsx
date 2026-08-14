export const VortexLogo = ({ size = 34, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <g stroke="#F0B90B" strokeWidth="3" strokeLinecap="round">
      <path d="M50 8 C78 8 92 30 92 50 C92 72 74 88 50 88" opacity="0.9" />
      <path d="M50 20 C71 20 80 36 80 50 C80 66 66 78 50 78" opacity="0.7" />
      <path d="M50 32 C64 32 68 42 68 50 C68 60 58 68 50 68" opacity="0.55" />
      <path d="M50 92 C22 92 8 70 8 50 C8 28 26 12 50 12" opacity="0.9" />
      <path d="M50 80 C29 80 20 64 20 50 C20 34 34 22 50 22" opacity="0.7" />
    </g>
    <circle cx="50" cy="50" r="6" fill="#F0B90B" />
  </svg>
);

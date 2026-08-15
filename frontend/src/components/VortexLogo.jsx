export const VortexLogo = ({ size = 34, className = "" }) => (
  <img
    src="/vortex-emblem.png"
    alt="Vortex Global Exchanges & Crypto Services"
    width={size}
    height={size}
    className={`object-contain ${className}`}
    style={{ width: size, height: size }}
  />
);

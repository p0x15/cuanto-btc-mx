interface SatSymbolProps {
  size?: number;   // height in px, width scales proportionally
  className?: string;
}

/**
 * The satoshi symbol — three horizontal bars with vertical nubs at top and bottom.
 * Renders as an inline SVG so it inherits currentColor from the parent.
 */
export function SatSymbol({ size = 20, className = "" }: SatSymbolProps) {
  // Viewbox: 16 wide × 24 tall
  const w = size * (16 / 24);
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 16 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", flexShrink: 0 }}
    >
      {/* top nub */}
      <rect x="7" y="0"  width="2" height="4" rx="0.8" />
      {/* top bar */}
      <rect x="0"   y="5"  width="16" height="2" rx="0.8" />
      {/* middle bar */}
      <rect x="0"   y="11" width="16" height="2" rx="0.8" />
      {/* bottom bar */}
      <rect x="0"   y="17" width="16" height="2" rx="0.8" />
      {/* bottom nub */}
      <rect x="7" y="20" width="2" height="4" rx="0.8" />
    </svg>
  );
}

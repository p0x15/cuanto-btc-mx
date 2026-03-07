/**
 * Converts satoshis to a BTC string formatted to 8 decimal places,
 * trimming insignificant trailing zeros after the 4th decimal.
 *
 * Examples:
 *   79760  → "0.00079760"
 *   100000 → "0.00100000"
 *   1000   → "0.00001000"
 */
export function satsToBtc(sats: number): string {
  return (sats / 100_000_000).toFixed(8);
}

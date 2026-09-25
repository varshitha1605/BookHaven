/**
 * Format a number as Indian Rupees.
 *
 * Prices in the database are stored in INR (converted via V7 migration).
 * This function formats them with the ₹ symbol and Indian locale grouping.
 *
 * Examples:
 *   formatINR(1599)   → "₹1,599"
 *   formatINR(3799.5) → "₹3,799.50"
 */
export function formatINR(amount: number): string {
  // Use the en-IN locale for Indian number grouping (e.g. ₹1,23,456)
  // but suppress decimal places unless they're non-zero
  const hasDecimals = amount % 1 !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);
}

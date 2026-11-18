/**
 * Derives item count and grand total from cart line items.
 * Totals are rounded to cents to avoid floating-point drift.
 */
export function calculateTotals(items) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice =
    Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;

  return { totalItems, totalPrice };
}

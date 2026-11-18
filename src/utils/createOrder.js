import { calculateTotals } from './cartTotals.js';

/**
 * Builds a demo order snapshot. Only the fields needed for the summary are kept,
 * so the stored order does not carry cover images.
 */
export function createOrder(items, now = new Date()) {
  const { totalItems, totalPrice } = calculateTotals(items);

  return {
    orderNumber: `OB-${now.getTime().toString(36).toUpperCase()}`,
    placedAt: now.toISOString(),
    items: items.map(({ id, title, author, price, quantity }) => ({
      id,
      title,
      author,
      price,
      quantity,
    })),
    totalItems,
    totalPrice,
  };
}

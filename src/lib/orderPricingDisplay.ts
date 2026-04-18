/** Display-only pricing: matches cart / checkout (delivery &lt; 5 units → 25 EGP, VAT 15% on medicines only). */

export type PricedLine = { quantity: number; price: number | string };

export function computeOrderPricingDisplay(delivery: boolean, lines: PricedLine[] | null | undefined) {
  const items = lines ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.price) * Math.max(0, Number(i.quantity) || 0), 0);
  const qtySum = items.reduce((s, i) => s + Math.max(0, Number(i.quantity) || 0), 0);
  const deliveryDisplay = delivery ? (qtySum >= 5 ? 0 : 25) : 0;
  const vatDisplay = Math.round(subtotal * 0.15 * 100) / 100;
  const grandDisplay = Math.round((subtotal + deliveryDisplay + vatDisplay) * 100) / 100;
  return { subtotal, qtySum, deliveryDisplay, vatDisplay, grandDisplay };
}

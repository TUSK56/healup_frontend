/** Display-only pricing: matches cart / checkout (delivery &lt; 5 units → 25 EGP, VAT 15% on medicines only). */

export type PricedLine = { quantity: number; price: number | string };

export function computeOrderPricingDisplay(
  delivery: boolean,
  lines: PricedLine[] | null | undefined,
  couponPercent?: number | null,
) {
  const items = lines ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.price) * Math.max(0, Number(i.quantity) || 0), 0);
  const normalizedCouponPercent =
    typeof couponPercent === 'number' && Number.isFinite(couponPercent)
      ? Math.min(100, Math.max(0, couponPercent))
      : 0;
  const discountDisplay = Math.round(subtotal * (normalizedCouponPercent / 100) * 100) / 100;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountDisplay);
  const qtySum = items.reduce((s, i) => s + Math.max(0, Number(i.quantity) || 0), 0);
  const deliveryDisplay = delivery ? (qtySum >= 5 ? 0 : 25) : 0;
  const vatDisplay = Math.round(subtotalAfterDiscount * 0.15 * 100) / 100;
  const grandDisplay = Math.round((subtotalAfterDiscount + deliveryDisplay + vatDisplay) * 100) / 100;
  return {
    subtotal,
    discountDisplay,
    subtotalAfterDiscount,
    qtySum,
    deliveryDisplay,
    vatDisplay,
    grandDisplay,
    couponPercent: normalizedCouponPercent,
  };
}

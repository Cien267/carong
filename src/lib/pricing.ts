import type { Addon, Combo, Product, ShopData } from './schema';

export type Kind = 'combo' | 'product' | 'addon';
export type Quantities = Record<Kind, Record<string, number>>;

export const emptyQuantities = (): Quantities => ({ combo: {}, product: {}, addon: {} });

export const indexById = <T extends { id: string }>(rows: T[]) =>
  Object.fromEntries(rows.map((r) => [r.id, r])) as Record<string, T>;

/** Tổng tiền nếu thuê lẻ từng món trong combo ở gói thời gian đã chọn. */
export function comboAlaCarte(combo: Combo, productsById: Record<string, Product>, durationId: string) {
  return combo.items.reduce((sum, it) => sum + it.qty * (productsById[it.productId]?.pricing[durationId] ?? 0), 0);
}

export interface PricedLine {
  kind: Kind;
  id: string;
  name: string;
  detail: string;
  qty: number;
  max: number;
  unit: number;
  total: number;
}

export interface PricedCart {
  lines: PricedLine[];
  /** Combo + đồ lẻ (theo gói thời gian). */
  rental: number;
  /** Đồ ăn uống + ga (phụ thu một lần). */
  addons: number;
  total: number;
  /** Tiền tiết kiệm nhờ mua combo so với thuê lẻ. */
  savings: number;
  count: number;
}

const clamp = (v: number | undefined, max: number) => Math.min(Math.max(0, Math.floor(v ?? 0)), max);

export function priceCart(data: ShopData, durationId: string, qty: Quantities): PricedCart {
  const productsById = indexById(data.products);
  const lines: PricedLine[] = [];
  let rental = 0;
  let addons = 0;
  let savings = 0;

  for (const c of data.combos) {
    const n = clamp(qty.combo[c.id], c.stock);
    if (!n) continue;
    const unit = c.pricing[durationId] ?? 0;
    rental += unit * n;
    savings += (comboAlaCarte(c, productsById, durationId) - unit) * n;
    lines.push({ kind: 'combo', id: c.id, name: c.name, detail: `Combo ${c.items.length} món + đồ pha kèm`, qty: n, max: c.stock, unit, total: unit * n });
  }
  for (const p of data.products) {
    const n = clamp(qty.product[p.id], p.stock);
    if (!n) continue;
    const unit = p.pricing[durationId] ?? 0;
    rental += unit * n;
    lines.push({ kind: 'product', id: p.id, name: p.name, detail: 'Thuê lẻ', qty: n, max: p.stock, unit, total: unit * n });
  }
  for (const a of data.addons) {
    const n = clamp(qty.addon[a.id], a.stock);
    if (!n) continue;
    addons += a.price * n;
    lines.push({ kind: 'addon', id: a.id, name: a.name, detail: a.unit, qty: n, max: a.stock, unit: a.price, total: a.price * n });
  }

  return { lines, rental, addons, total: rental + addons, savings: Math.max(0, savings), count: lines.reduce((s, l) => s + l.qty, 0) };
}

export type { Addon };

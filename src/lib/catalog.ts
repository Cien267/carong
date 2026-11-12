import { z } from 'astro/zod';
import brandJson from '../data/brand.json';
import durationsJson from '../data/durations.json';
import depositsJson from '../data/deposits.json';
import categoriesJson from '../data/categories.json';
import productsJson from '../data/products.json';
import combosJson from '../data/combos.json';
import addonsJson from '../data/addons.json';
import manualJson from '../data/manual.json';
import {
  AddonSchema,
  BrandSchema,
  CategorySchema,
  ComboSchema,
  DepositSchema,
  DurationSchema,
  ManualStepSchema,
  ProductSchema,
  type ShopData,
} from './schema';

const fail = (msg: string): never => {
  throw new Error(`[catalog] ${msg}`);
};

const live = <T extends { active: boolean; sort: number }>(rows: T[]) =>
  rows.filter((r) => r.active).sort((a, b) => a.sort - b.sort);

function assertUnique(table: string, rows: { id: string }[]) {
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.id)) fail(`${table}: trùng id "${r.id}"`);
    seen.add(r.id);
  }
}

function load() {
  const brand = BrandSchema.parse(brandJson);
  const durationsAll = z.array(DurationSchema).parse(durationsJson);
  const depositsAll = z.array(DepositSchema).parse(depositsJson);
  const categoriesAll = z.array(CategorySchema).parse(categoriesJson);
  const productsAll = z.array(ProductSchema).parse(productsJson);
  const combosAll = z.array(ComboSchema).parse(combosJson);
  const addonsAll = z.array(AddonSchema).parse(addonsJson);
  const manual = z.array(ManualStepSchema).parse(manualJson);

  assertUnique('durations', durationsAll);
  assertUnique('deposits', depositsAll);
  assertUnique('categories', categoriesAll);
  assertUnique('products', productsAll);
  assertUnique('combos', combosAll);
  assertUnique('addons', addonsAll);

  const durations = live(durationsAll);
  const deposits = live(depositsAll);
  const categories = live(categoriesAll);
  const products = live(productsAll);
  const combos = live(combosAll);
  const addons = live(addonsAll);

  if (!durations.length) fail('cần ít nhất 1 gói thời gian đang bật');
  if (!deposits.length) fail('cần ít nhất 1 phương án đặt cọc đang bật');

  const durationIds = new Set(durations.map((d) => d.id));
  const categoryIds = new Set(categories.map((c) => c.id));
  const productIds = new Set(products.map((p) => p.id));

  const checkPricing = (table: string, id: string, pricing: Record<string, number>) => {
    for (const d of durationIds) if (!(d in pricing)) fail(`${table}.${id}: thiếu giá cho gói "${d}"`);
    for (const k of Object.keys(pricing)) if (!durationsAll.some((d) => d.id === k)) fail(`${table}.${id}: gói "${k}" không tồn tại`);
  };

  for (const p of products) {
    if (!categoryIds.has(p.categoryId)) fail(`products.${p.id}: categoryId "${p.categoryId}" không tồn tại`);
    checkPricing('products', p.id, p.pricing);
  }
  for (const c of combos) {
    checkPricing('combos', c.id, c.pricing);
    for (const it of c.items) {
      if (!productIds.has(it.productId)) fail(`combos.${c.id}: productId "${it.productId}" không tồn tại hoặc đang tắt`);
    }
  }

  return { brand, durations, deposits, categories, products, combos, addons, manual };
}

export const catalog = load();

export function toShopData(): ShopData {
  const { brand, durations, categories, products, combos, addons, deposits } = catalog;
  return { brandName: brand.name, contact: brand.contact, durations, categories, products, combos, addons, deposits };
}

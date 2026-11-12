import { z } from 'astro/zod';

/** kebab-case id, dùng làm khóa tham chiếu giữa các bảng. */
const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id phải là kebab-case');
/** Tiền VND luôn là số nguyên (đồng), không dùng số thực. */
const Vnd = z.number().int().nonnegative();
/** Giá theo gói thuê: khóa là Duration.id. Thêm gói mới = thêm khóa, không đổi cấu trúc. */
const Pricing = z.record(Id, Vnd);
/** Ảnh để trống (null) cho tới khi có ảnh thật; UI tự hiện khung giữ chỗ. */
const Media = z
  .object({
    src: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  })
  .nullable()
  .default(null);

const Base = {
  active: z.boolean().default(true),
  sort: z.number().int().default(0),
};

export const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  location: z.object({ city: z.string(), country: z.string() }),
  contact: z.object({ zaloPhone: z.string(), telegramUser: z.string() }),
  wearTearRule: z.string(),
  seo: z.object({ title: z.string(), description: z.string() }),
});

export const DurationSchema = z.object({
  id: Id,
  label: z.string(),
  short: z.string(),
  note: z.string(),
  priceSuffix: z.string(),
  hours: z.number().int().positive(),
  ...Base,
});

export const DepositSchema = z.object({
  id: Id,
  label: z.string(),
  summary: z.string(),
  cash: Vnd,
  requiresId: z.boolean(),
  ...Base,
});

export const CategorySchema = z.object({ id: Id, label: z.string(), ...Base });

export const ProductSchema = z.object({
  id: Id,
  name: z.string(),
  categoryId: Id,
  pricing: Pricing,
  specs: z.string(),
  stock: z.number().int().nonnegative().default(1),
  image: Media,
  ...Base,
});

export const ComboSchema = z.object({
  id: Id,
  name: z.string(),
  tag: z.string(),
  vibe: z.string(),
  items: z.array(z.object({ productId: Id, qty: z.number().int().positive().default(1) })).min(1),
  consumables: z.array(z.string()),
  pricing: Pricing,
  stock: z.number().int().nonnegative().default(1),
  featured: z.boolean().default(false),
  image: Media,
  ...Base,
});

export const AddonSchema = z.object({
  id: Id,
  name: z.string(),
  /** Giá phụ thu một lần, không đổi theo gói thuê. */
  price: Vnd,
  unit: z.string(),
  description: z.string(),
  tags: z.array(z.enum(['caffeine-free'])).default([]),
  stock: z.number().int().nonnegative().default(20),
  image: Media,
  ...Base,
});

export const ManualStepSchema = z.object({
  id: Id,
  icon: z.enum(['grinder', 'flame', 'cup']),
  title: z.string(),
  body: z.string(),
  hint: z.string(),
});

export type Brand = z.infer<typeof BrandSchema>;
export type Duration = z.infer<typeof DurationSchema>;
export type Deposit = z.infer<typeof DepositSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Combo = z.infer<typeof ComboSchema>;
export type Addon = z.infer<typeof AddonSchema>;
export type ManualStep = z.infer<typeof ManualStepSchema>;

/** Phần dữ liệu truyền xuống React island (serialize được, không chứa nội dung tĩnh thừa). */
export interface ShopData {
  brandName: string;
  contact: Brand['contact'];
  durations: Duration[];
  categories: Category[];
  products: Product[];
  combos: Combo[];
  addons: Addon[];
  deposits: Deposit[];
}

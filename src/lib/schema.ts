import { z } from "astro/zod"

/** kebab-case id, dùng làm khóa tham chiếu giữa các bảng. */
const Id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id phải là kebab-case")
/** Tiền VND luôn là số nguyên (đồng), không dùng số thực. */
const Vnd = z.number().int().nonnegative()
/** Giá theo gói thuê: khóa là Duration.id. Thêm gói mới = thêm khóa, không đổi cấu trúc. */
const Pricing = z.record(Id, Vnd)
/** Ảnh để trống (null) cho tới khi có ảnh thật; UI tự hiện khung giữ chỗ. */
const Media = z
  .object({
    src: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  })
  .nullable()
  .default(null)

const Base = {
  active: z.boolean().default(true),
  sort: z.number().int().default(0),
}

export const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  location: z.object({ city: z.string(), country: z.string() }),
  contact: z.object({ zaloPhone: z.string(), tiktokId: z.string() }),
  wearTearRule: z.string(),
  seo: z.object({ title: z.string(), description: z.string() }),
})

export const DurationSchema = z.object({
  id: Id,
  label: z.string(),
  short: z.string(),
  note: z.string(),
  priceSuffix: z.string(),
  hours: z.number().int().positive(),
  ...Base,
})

export const DepositSchema = z.object({
  id: Id,
  label: z.string(),
  summary: z.string(),
  cash: Vnd,
  requiresId: z.boolean(),
  ...Base,
})

export const CategorySchema = z.object({ id: Id, label: z.string(), ...Base })

export const ProductSchema = z.object({
  id: Id,
  name: z.string(),
  categoryId: Id,
  pricing: Pricing,
  specs: z.string(),
  stock: z.number().int().nonnegative().default(1),
  image: Media,
  ...Base,
})

export const ComboSchema = z.object({
  id: Id,
  name: z.string(),
  tag: z.string(),
  vibe: z.string(),
  items: z
    .array(
      z.object({ productId: Id, qty: z.number().int().positive().default(1) }),
    )
    .min(1),
  consumables: z.array(z.string()),
  pricing: Pricing,
  stock: z.number().int().nonnegative().default(1),
  featured: z.boolean().default(false),
  image: Media,
  ...Base,
})

export const AddonSchema = z.object({
  id: Id,
  name: z.string(),
  /** Giá phụ thu một lần, không đổi theo gói thuê. */
  price: Vnd,
  unit: z.string(),
  description: z.string(),
  tags: z.array(z.enum(["caffeine-free"])).default([]),
  stock: z.number().int().nonnegative().default(20),
  image: Media,
  ...Base,
})

export const ManualStepSchema = z.object({
  id: Id,
  icon: z.enum(["grinder", "flame", "cup", "brewer", "bean"]),
  title: z.string(),
  body: z.string(),
  hint: z.string(),
})

/** Quy trình pha của một combo. Mỗi guide gắn với 1 combo qua comboId và có số bước riêng. */
export const ManualGuideSchema = z.object({
  comboId: Id,
  tabLabel: z.string(),
  steps: z.array(ManualStepSchema).min(1),
})

export const PolicySchema = z.object({
  pickup: z.object({
    area: z.string(),
    hours: z.string(),
    addressNote: z.string(),
  }),
  delivery: z.object({ available: z.boolean(), note: z.string() }),
  /** Số giờ trả trễ được miễn phí. */
  lateGraceHours: z.number().int().nonnegative(),
  /** Sau thời gian miễn phí, cứ mỗi bấy nhiêu giờ trễ thì tính thêm 1 ngày thuê. */
  lateFeeUnitHours: z.number().int().positive(),
  /** Hủy hoặc dời ngày miễn phí nếu báo trước giờ nhận ít nhất bấy nhiêu giờ. */
  freeCancelNoticeHours: z.number().int().nonnegative(),
  /** Tóm tắt điều khoản hiện trên landing. Dùng {tênBiến} để lấy số từ các trường trên. */
  highlights: z.array(z.string()).min(1),
})

export const FaqSchema = z.object({
  id: Id,
  question: z.string(),
  answer: z.string(),
  ...Base,
})

export const TermsSectionSchema = z.object({
  id: Id,
  title: z.string(),
  items: z.array(z.string()).min(1),
})

export type Brand = z.infer<typeof BrandSchema>
export type Duration = z.infer<typeof DurationSchema>
export type Deposit = z.infer<typeof DepositSchema>
export type Category = z.infer<typeof CategorySchema>
export type Product = z.infer<typeof ProductSchema>
export type Combo = z.infer<typeof ComboSchema>
export type Addon = z.infer<typeof AddonSchema>
export type Policy = z.infer<typeof PolicySchema>
export type Faq = z.infer<typeof FaqSchema>
export type TermsSection = z.infer<typeof TermsSectionSchema>
export type ManualStep = z.infer<typeof ManualStepSchema>
export type ManualGuide = z.infer<typeof ManualGuideSchema>

/** Phần dữ liệu truyền xuống React island (serialize được, không chứa nội dung tĩnh thừa). */
export interface ShopData {
  brandName: string
  contact: Brand["contact"]
  durations: Duration[]
  categories: Category[]
  products: Product[]
  combos: Combo[]
  addons: Addon[]
  deposits: Deposit[]
}

import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const PhotoSchema = z.object({
  /** Để trống cho tới khi có ảnh: trang tự hiện khung giữ chỗ. */
  src: z.string().optional(),
  alt: z.string(),
  caption: z.string(),
})

export const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  place: z.string(),
  /** id combo đã dùng trong chuyến đi (không bắt buộc). */
  comboId: z.string().optional(),
  /** id các món thuê lẻ đã dùng trong chuyến đi (không bắt buộc). Hiện thành danh sách ở cuối bài. */
  productIds: z.array(z.string()).default([]),
  cover: z
    .object({ src: z.string(), alt: z.string() })
    .nullable()
    .default(null),
  intro: z.string(),
  photos: z.array(PhotoSchema).default([]),
  draft: z.boolean().default(false),
})

export type PostType = z.infer<typeof PostSchema>

/**
 * Mẫu bài cố định: ảnh bìa -> đoạn mở đầu -> loạt ảnh kèm chú thích -> câu chuyện (nội dung Markdown) -> bộ pha và các món đã dùng.
 * File bắt đầu bằng "_" (vd _bai-mau.md) bị bỏ qua, dùng làm file mẫu để chép.
 */
const journal = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "!**/_*"],
    base: "./src/content/journal",
  }),
  schema: PostSchema,
})

export const collections = { journal }

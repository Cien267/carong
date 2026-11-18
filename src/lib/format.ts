const nf = new Intl.NumberFormat("vi-VN")

/** 49000 -> "49.000đ" */
export const vnd = (n: number) => `${nf.format(n)}đ`

/** 49000 -> "49K"; số lẻ nghìn thì giữ nguyên dạng đầy đủ. */
export const vndShort = (n: number) =>
  n % 1000 === 0 ? `${n / 1000}K` : vnd(n)

/** Ngày dạng 17/11/2026. Dùng UTC để ngày trong file Markdown không bị lệch múi giờ. */
export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d)

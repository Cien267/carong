/** Thay {tênBiến} trong câu chữ. Thiếu biến thì build lỗi, tránh để lọt chữ "{...}" ra trang. */
export function fill(
  template: string,
  vars: Record<string, string | number>,
  where: string,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!(key in vars))
      throw new Error(`[content] ${where}: thiếu biến {${key}}`)
    return String(vars[key])
  })
}

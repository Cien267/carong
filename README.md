# Cà Rong — Astro

Astro 5 + Tailwind 4, một React island (`ShopApp`) cho phần chọn đồ + giỏ thuê. Phần còn lại là HTML tĩnh (SEO).

```bash
npm install
npm run dev
SITE_URL=https://carong.vn npm run build   # ra dist/, deploy thẳng lên Cloudflare Pages
```

## Trước khi chạy thật
- `src/data/brand.json`: đổi `contact.zaloPhone`, `contact.telegramUser` (đang là số giả).
- Ảnh: điền `"image": { "src": "/img/x.webp", "alt": "..." }` trong JSON của combo / sản phẩm / addon. Để `null` thì hiện khung giữ chỗ.
- Hero: ảnh nằm trong `src/components/Hero.astro` (khung `.ph`).

## Mô hình dữ liệu (`src/data/*.json`)
Mọi bảng tham chiếu nhau qua `id` (kebab-case). `src/lib/catalog.ts` kiểm tra bằng Zod lúc build, sai là build fail:
id trùng, combo trỏ tới sản phẩm không tồn tại, thiếu giá cho một gói thời gian...

| Bảng | Ghi chú |
|---|---|
| durations | Gói thuê. Thêm "3 ngày" = thêm 1 dòng + thêm khóa `pricing` ở products/combos |
| products / combos | `pricing: { <durationId>: VND }`, `stock`, `active`, `sort`, `image` |
| combos.items | `[{ productId, qty }]`, giá thuê lẻ và mức tiết kiệm được **tính**, không lưu |
| addons | giá một lần, `tags` (vd `caffeine-free`) thay cho boolean |
| deposits | phương án cọc: `cash`, `requiresId` |
| categories, manual | danh mục lọc đồ lẻ, các bước Field Manual |

Tắt một món: `"active": false`. Hết hàng: `"stock": 0`.

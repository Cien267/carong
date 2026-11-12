import type { Deposit, Duration } from './schema';
import type { PricedCart } from './pricing';
import { vnd } from './format';

export interface Customer {
  name: string;
  phone: string;
  pickupDate: string;
  note: string;
}

export type CustomerErrors = Partial<Record<'name' | 'phone' | 'pickupDate', string>>;

export function validateCustomer(c: Customer, today: string): CustomerErrors {
  const errors: CustomerErrors = {};
  if (c.name.trim().length < 2) errors.name = 'Nhập tên để mình gọi khi giao đồ.';
  if (!/^(0|\+84)\d{9}$/.test(c.phone.replace(/[\s.-]/g, ''))) errors.phone = 'Số điện thoại chưa đúng (vd: 0912345678).';
  if (!c.pickupDate) errors.pickupDate = 'Chọn ngày nhận đồ.';
  else if (c.pickupDate < today) errors.pickupDate = 'Ngày nhận đã qua, chọn ngày khác.';
  return errors;
}

export const newOrderCode = () => `CR-${Date.now().toString(36).slice(-5).toUpperCase()}`;

interface MessageInput {
  brandName: string;
  code: string;
  duration: Duration;
  priced: PricedCart;
  deposit: Deposit;
  customer: Customer;
}

export function buildOrderMessage({ brandName, code, duration, priced, deposit, customer }: MessageInput) {
  const rows = priced.lines.map((l) => `- ${l.name} x${l.qty}: ${vnd(l.total)}`);
  return [
    `ĐƠN THUÊ ${brandName} (${code})`,
    `Khách: ${customer.name || '...'} - ${customer.phone || '...'}`,
    `Ngày nhận: ${customer.pickupDate || '...'}`,
    `Gói: ${duration.label} (${duration.note})`,
    '',
    ...rows,
    '',
    `Tạm tính: ${vnd(priced.total)}`,
    priced.savings > 0 ? `(Đã tiết kiệm ${vnd(priced.savings)} nhờ combo)` : '',
    `Đặt cọc: ${deposit.summary}`,
    customer.note.trim() ? `Ghi chú: ${customer.note.trim()}` : '',
  ]
    .filter((l, i, arr) => l !== '' || (arr[i - 1] !== '' && i > 0))
    .join('\n');
}

export const telegramUrl = (user: string, text: string) => `https://t.me/${user}?text=${encodeURIComponent(text)}`;
export const zaloUrl = (phone: string) => `https://zalo.me/${phone.replace(/\D/g, '')}`;

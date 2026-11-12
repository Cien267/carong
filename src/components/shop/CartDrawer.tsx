import { useEffect, useMemo, useRef, useState } from 'react';
import type { ShopData } from '../../lib/schema';
import { priceCart } from '../../lib/pricing';
import { vnd } from '../../lib/format';
import { buildOrderMessage, newOrderCode, telegramUrl, validateCustomer, zaloUrl, type CustomerErrors } from '../../lib/order';
import { useCart } from '../../stores/cart';
import Icon from '../icons/Icon';
import QtyStepper from './QtyStepper';

const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function CartDrawer({ data, durationId }: { data: ShopData; durationId: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = useCart((s) => s.drawerOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const qty = useCart((s) => s.qty);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const customer = useCart((s) => s.customer);
  const setCustomer = useCart((s) => s.setCustomer);
  const storedDeposit = useCart((s) => s.depositId);
  const setDeposit = useCart((s) => s.setDeposit);

  const [errors, setErrors] = useState<CustomerErrors>({});
  const [notice, setNotice] = useState('');

  const duration = data.durations.find((d) => d.id === durationId) ?? data.durations[0]!;
  const deposit = data.deposits.find((d) => d.id === storedDeposit) ?? data.deposits[0]!;
  const priced = useMemo(() => priceCart(data, duration.id, qty), [data, duration.id, qty]);
  const preview = useMemo(
    () => buildOrderMessage({ brandName: data.brandName, code: 'CR-?????', duration, priced, deposit, customer }),
    [data.brandName, duration, priced, deposit, customer],
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  function send(channel: 'zalo' | 'telegram') {
    const errs = validateCustomer(customer, todayLocal());
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setNotice('Còn thông tin chưa đúng, xem các ô báo đỏ.');
      return;
    }
    const text = buildOrderMessage({ brandName: data.brandName, code: newOrderCode(), duration, priced, deposit, customer });
    if (channel === 'telegram') {
      window.open(telegramUrl(data.contact.telegramUser, text), '_blank', 'noopener');
      setNotice('Đã mở Telegram với nội dung đơn. Bấm gửi để chốt.');
    } else {
      // Zalo không cho điền sẵn tin nhắn: chép đơn vào clipboard rồi mở chat.
      window.open(zaloUrl(data.contact.zaloPhone), '_blank', 'noopener');
      navigator.clipboard?.writeText(text).then(
        () => setNotice('Đã chép nội dung đơn. Dán vào khung chat Zalo rồi gửi.'),
        () => setNotice('Không chép tự động được. Mở "Xem nội dung đơn" bên dưới và chép tay.'),
      );
    }
  }

  const err = (k: keyof CustomerErrors) => errors[k];

  return (
    <dialog ref={ref} className="drawer" aria-labelledby="cart-title" onClose={closeDrawer} onClick={(e) => e.target === e.currentTarget && closeDrawer()}>
      <header className="flex items-center justify-between border-b border-dashed border-ink px-5 py-3">
        <div>
          <h2 id="cart-title" className="font-display text-2xl">Giỏ thuê</h2>
          <p className="meta">Gói: {duration.label} ({duration.note})</p>
        </div>
        <button type="button" className="grid size-11 place-items-center hover:bg-kraft-light" onClick={closeDrawer} aria-label="Đóng giỏ thuê">
          <Icon name="close" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {priced.lines.length === 0 ? (
          <div className="stamp p-6 text-center">
            <p className="font-semibold">Giỏ đang trống</p>
            <p className="mt-1 text-sm text-ink/75">Chọn một combo hoặc vài món lẻ để bắt đầu.</p>
            <button type="button" className="btn btn-ink mt-4" onClick={closeDrawer}>Quay lại chọn đồ</button>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-dashed divide-ink border-y border-dashed border-ink">
              {priced.lines.map((l) => (
                <li key={`${l.kind}-${l.id}`} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{l.name}</p>
                    <p className="meta">{l.detail} · {vnd(l.unit)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <QtyStepper value={l.qty} max={l.max} label={l.name} onChange={(n) => setQty(l.kind, l.id, n)} />
                    <p className="text-sm font-semibold">{vnd(l.total)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" className="meta mt-2 underline" onClick={clear}>Xóa hết</button>

            <fieldset className="mt-6">
              <legend className="mb-2 font-semibold">Cách đặt cọc</legend>
              <div className="space-y-2">
                {data.deposits.map((d) => (
                  <label key={d.id} className={`stamp flex cursor-pointer gap-3 p-3 ${d.id === deposit.id ? 'bg-kraft-light' : ''}`}>
                    <input type="radio" name="deposit" className="mt-1 accent-terra" checked={d.id === deposit.id} onChange={() => setDeposit(d.id)} />
                    <span>
                      <span className="block font-semibold">{d.label}</span>
                      <span className="block text-sm text-ink/80">{d.summary}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 space-y-4">
              <p className="font-semibold">Thông tin nhận đồ</p>
              <div>
                <label htmlFor="c-name" className="mb-1 block text-sm">Tên của bạn</label>
                <input id="c-name" className="field" autoComplete="name" value={customer.name} aria-invalid={!!err('name')} aria-describedby={err('name') ? 'e-name' : undefined} onChange={(e) => setCustomer({ name: e.target.value })} />
                {err('name') && <p id="e-name" className="mt-1 text-sm text-terra-dark">{err('name')}</p>}
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1 block text-sm">Số điện thoại</label>
                <input id="c-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} aria-invalid={!!err('phone')} aria-describedby={err('phone') ? 'e-phone' : undefined} onChange={(e) => setCustomer({ phone: e.target.value })} />
                {err('phone') && <p id="e-phone" className="mt-1 text-sm text-terra-dark">{err('phone')}</p>}
              </div>
              <div>
                <label htmlFor="c-date" className="mb-1 block text-sm">Ngày nhận đồ</label>
                <input id="c-date" className="field" type="date" min={todayLocal()} value={customer.pickupDate} aria-invalid={!!err('pickupDate')} aria-describedby={err('pickupDate') ? 'e-date' : undefined} onChange={(e) => setCustomer({ pickupDate: e.target.value })} />
                {err('pickupDate') && <p id="e-date" className="mt-1 text-sm text-terra-dark">{err('pickupDate')}</p>}
              </div>
              <div>
                <label htmlFor="c-note" className="mb-1 block text-sm">Ghi chú (không bắt buộc)</label>
                <textarea id="c-note" className="field" rows={2} value={customer.note} onChange={(e) => setCustomer({ note: e.target.value })} />
              </div>
            </div>

            <details className="mt-4">
              <summary className="meta cursor-pointer underline">Xem nội dung đơn</summary>
              <pre className="stamp mt-2 overflow-x-auto whitespace-pre-wrap bg-kraft-light p-3 font-mono text-xs">{preview}</pre>
            </details>
          </>
        )}
      </div>

      {priced.lines.length > 0 && (
        <footer className="border-t-2 border-dashed border-ink bg-kraft px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt>Thuê đồ</dt><dd>{vnd(priced.rental)}</dd></div>
            {priced.addons > 0 && <div className="flex justify-between"><dt>Đồ uống, ga</dt><dd>{vnd(priced.addons)}</dd></div>}
            {priced.savings > 0 && <div className="flex justify-between text-olive"><dt>Tiết kiệm nhờ combo</dt><dd>{vnd(priced.savings)}</dd></div>}
            <div className="flex items-baseline justify-between border-t border-dashed border-ink pt-2 text-lg font-semibold"><dt>Tổng thuê</dt><dd>{vnd(priced.total)}</dd></div>
            <div className="meta flex justify-between"><dt>Cọc, hoàn khi trả đồ</dt><dd>{deposit.requiresId ? `Giấy tờ + ${vnd(deposit.cash)}` : vnd(deposit.cash)}</dd></div>
          </dl>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-primary" onClick={() => send('zalo')}>Đặt qua Zalo</button>
            <button type="button" className="btn btn-ink" onClick={() => send('telegram')}>Đặt qua Telegram</button>
          </div>
          <p className="meta mt-2 min-h-[1.25rem]" role="status" aria-live="polite">{notice}</p>
        </footer>
      )}
    </dialog>
  );
}

import { useMemo } from 'react';
import { useCart, useCartHydration } from '../../stores/cart';
import Icon from '../icons/Icon';

/** Nút giỏ trên header. Đếm tổng số món (kể cả đồ phụ). */
export default function CartButton() {
  useCartHydration();
  const qty = useCart((s) => s.qty);
  const open = useCart((s) => s.openDrawer);
  const count = useMemo(() => Object.values(qty).reduce((a, group) => a + Object.values(group).reduce((x, y) => x + y, 0), 0), [qty]);

  return (
    <button type="button" onClick={open} className="btn btn-primary !min-h-10 !px-3" aria-label={`Mở giỏ thuê, ${count} món`}>
      <Icon name="cart" size={18} />
      <span className="hidden sm:inline">Giỏ thuê</span>
      <span className="grid min-w-6 place-items-center bg-ink px-1 font-mono text-xs text-kraft-light">{count}</span>
    </button>
  );
}

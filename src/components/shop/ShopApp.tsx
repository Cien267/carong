import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import type { ShopData } from '../../lib/schema';
import { indexById, priceCart } from '../../lib/pricing';
import { vnd } from '../../lib/format';
import { useCart, useCartHydration } from '../../stores/cart';
import AddonRow from './AddonRow';
import CartDrawer from './CartDrawer';
import ComboCard from './ComboCard';
import DurationToggle from './DurationToggle';
import GearCard from './GearCard';
import Icon from '../icons/Icon';

type Tab = 'combo' | 'gear';

export default function ShopApp({ data }: { data: ShopData }) {
  useCartHydration();
  const [tab, setTab] = useState<Tab>('combo');
  const [categoryId, setCategoryId] = useState<string>('all');

  const storedDuration = useCart((s) => s.durationId);
  const setDuration = useCart((s) => s.setDuration);
  const qty = useCart((s) => s.qty);
  const openDrawer = useCart((s) => s.openDrawer);
  const drawerOpen = useCart((s) => s.drawerOpen);

  // Gói không còn hợp lệ (vd đã tắt trong JSON) thì rơi về gói đầu tiên.
  const duration = data.durations.find((d) => d.id === storedDuration) ?? data.durations[0]!;
  const productsById = useMemo(() => indexById(data.products), [data.products]);
  const categoriesById = useMemo(() => indexById(data.categories), [data.categories]);
  const priced = useMemo(() => priceCart(data, duration.id, qty), [data, duration.id, qty]);

  // Link "#do-le" từ hero mở thẳng tab đồ lẻ.
  useEffect(() => {
    const sync = () => {
      if (location.hash === '#do-le') {
        setTab('gear');
        document.getElementById('thue')?.scrollIntoView();
      }
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setTab((t) => (t === 'combo' ? 'gear' : 'combo'));
  };

  const gear = data.products.filter((p) => categoryId === 'all' || p.categoryId === categoryId);
  const tabBtn = (id: Tab, label: string, sub: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={tab === id}
      aria-controls={`panel-${id}`}
      tabIndex={tab === id ? 0 : -1}
      onClick={() => setTab(id)}
      onKeyDown={onTabKey}
      className={`min-h-12 flex-1 px-3 py-2 text-left ${tab === id ? 'bg-ink text-kraft-light' : 'hover:bg-kraft-light'}`}
    >
      <span className="block font-semibold leading-tight">{label}</span>
      <span className="block font-mono text-[11px] opacity-75">{sub}</span>
    </button>
  );

  return (
    <section id="thue" className="scroll-mt-14 pb-16 pt-12 md:pt-16" aria-labelledby="thue-title">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="thue-title" className="font-display text-4xl leading-tight md:text-6xl">Chọn đồ đi rong</h2>
            <p className="mt-2 max-w-md text-ink/80">Thuê trọn bộ cho nhanh, hoặc tự phối từng món. Giá bên dưới đổi theo gói thời gian bạn chọn.</p>
          </div>
          <DurationToggle durations={data.durations} value={duration.id} onChange={setDuration} />
        </div>
      </div>

      <div className="sticky top-14 z-20 mt-8 border-y border-dashed border-ink bg-kraft">
        <div role="tablist" aria-label="Cách thuê" className="mx-auto flex max-w-6xl">
          {tabBtn('combo', 'Combo trọn gói', 'rẻ hơn thuê lẻ')}
          {tabBtn('gear', 'Thuê đồ lẻ', 'tự phối từng món')}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div role="tabpanel" id="panel-combo" aria-labelledby="tab-combo" hidden={tab !== 'combo'} className="pt-8">
          <div className="grid gap-5 md:grid-cols-3">
            {data.combos.map((c) => (
              <ComboCard key={c.id} combo={c} productsById={productsById} duration={duration} />
            ))}
          </div>
        </div>

        <div role="tabpanel" id="panel-gear" aria-labelledby="tab-gear" hidden={tab !== 'gear'} className="pt-8">
          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Lọc theo loại">
            {[{ id: 'all', label: 'Tất cả' }, ...data.categories].map((c) => (
              <button key={c.id} type="button" aria-pressed={categoryId === c.id} onClick={() => setCategoryId(c.id)} className={`min-h-11 border-[1.5px] border-dashed border-ink px-3 text-sm ${categoryId === c.id ? 'bg-ink text-kraft-light' : 'hover:bg-kraft-light'}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {gear.map((p) => (
              <GearCard key={p.id} product={p} category={categoriesById[p.categoryId]} duration={duration} />
            ))}
          </div>
          <p className="meta mt-5">Thuê đủ bộ thì combo thường rẻ hơn. Xem tab Combo trọn gói để so.</p>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-3xl md:text-5xl">Thêm chút ấm</h2>
          <p className="mt-2 max-w-md text-ink/80">Chọn thêm vài món nhâm nhi. Tính một lần, không đổi theo số ngày thuê.</p>
          <ul className="mt-6 divide-y divide-dashed divide-ink border-y border-dashed border-ink">
            {data.addons.map((a) => (
              <AddonRow key={a.id} addon={a} />
            ))}
          </ul>
        </div>
      </div>

      {priced.count > 0 && !drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-dashed border-ink bg-kraft px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
          <button type="button" className="btn btn-primary w-full justify-between" onClick={openDrawer}>
            <span className="flex items-center gap-2"><Icon name="cart" size={18} />Giỏ thuê · {priced.count} món</span>
            <span>{vnd(priced.total)}</span>
          </button>
        </div>
      )}

      <CartDrawer data={data} durationId={duration.id} />
    </section>
  );
}

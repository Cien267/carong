import type { Combo, Duration, Product } from '../../lib/schema';
import { comboAlaCarte } from '../../lib/pricing';
import { vnd } from '../../lib/format';
import { useCart } from '../../stores/cart';
import Placeholder from './Placeholder';
import QtyStepper from './QtyStepper';

interface Props { combo: Combo; productsById: Record<string, Product>; duration: Duration }

export default function ComboCard({ combo, productsById, duration }: Props) {
  const qty = useCart((s) => s.qty.combo[combo.id] ?? 0);
  const setQty = useCart((s) => s.setQty);
  const openDrawer = useCart((s) => s.openDrawer);

  const price = combo.pricing[duration.id] ?? 0;
  const separate = comboAlaCarte(combo, productsById, duration.id);
  const saving = separate - price;
  const soldOut = combo.stock === 0;

  return (
    <article className="stamp flex flex-col bg-kraft-light/60 p-3">
      <div className="relative">
        <Placeholder image={combo.image} label={combo.name} className="aspect-[4/3]" />
        <span className="absolute left-2 top-2 bg-olive px-2 py-1 font-mono text-[11px] text-kraft-light">{combo.tag}</span>
      </div>

      <h3 className="mt-4 font-display text-2xl leading-tight">{combo.name}</h3>
      <p className="mt-1 text-[15px] italic text-ink/80">{combo.vibe}</p>

      <div className="mt-4 border-t border-dashed border-ink pt-3">
        <p className="meta mb-2">Trong túi {combo.items.length} món</p>
        <ul className="space-y-1 text-sm">
          {combo.items.map((it) => (
            <li key={it.productId} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-ink" />
              {productsById[it.productId]?.name}
              {it.qty > 1 ? ` x${it.qty}` : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 border-t border-dashed border-ink pt-3">
        <p className="meta mb-2">Đồ pha kèm, dùng hết thì thôi</p>
        <ul className="space-y-1 text-sm">
          {combo.consumables.map((c) => (
            <li key={c} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-terra" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-end justify-between gap-3 border-t border-dashed border-ink pt-4">
          <div>
            <p className="text-2xl font-semibold leading-none">{vnd(price)}</p>
            <p className="meta mt-1">{duration.priceSuffix}</p>
          </div>
          {saving > 0 && (
            <p className="meta text-right">
              Thuê lẻ <s>{vnd(separate)}</s>
              <br />
              <strong className="font-semibold text-ink">Tiết kiệm {vnd(saving)}</strong>
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          {qty === 0 ? (
            <button type="button" className="btn btn-primary w-full" disabled={soldOut} onClick={() => setQty('combo', combo.id, 1)}>
              {soldOut ? 'Tạm hết bộ' : 'Chọn bộ này'}
            </button>
          ) : (
            <>
              <QtyStepper value={qty} max={combo.stock} label={combo.name} onChange={(n) => setQty('combo', combo.id, n)} />
              <button type="button" className="btn btn-ghost flex-1" onClick={openDrawer}>Xem giỏ thuê</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

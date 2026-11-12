import type { Addon } from '../../lib/schema';
import { vnd } from '../../lib/format';
import { useCart } from '../../stores/cart';
import Icon from '../icons/Icon';
import QtyStepper from './QtyStepper';

export default function AddonRow({ addon }: { addon: Addon }) {
  const qty = useCart((s) => s.qty.addon[addon.id] ?? 0);
  const setQty = useCart((s) => s.setQty);
  const checked = qty > 0;
  const id = `addon-${addon.id}`;

  return (
    <li className="flex items-start gap-3 py-4">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => setQty('addon', addon.id, e.target.checked ? 1 : 0)} />
      <label htmlFor={id} className="mt-0.5 grid size-7 shrink-0 cursor-pointer place-items-center border-[1.5px] border-ink bg-kraft-light peer-checked:bg-ink peer-checked:text-kraft-light peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terra">
        {checked && <Icon name="check" size={16} />}
        <span className="sr-only">Chọn {addon.name}</span>
      </label>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <label htmlFor={id} className="cursor-pointer font-semibold">{addon.name}</label>
          {addon.tags.includes('caffeine-free') && <span className="border border-olive px-1.5 font-mono text-[11px] text-olive">không caffeine</span>}
        </p>
        <p className="mt-1 text-sm text-ink/75">{addon.description}</p>
        <p className="meta mt-1">{addon.unit}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-semibold">{vnd(addon.price)}</p>
        {checked && <QtyStepper value={qty} max={addon.stock} label={addon.name} onChange={(n) => setQty('addon', addon.id, n)} />}
      </div>
    </li>
  );
}

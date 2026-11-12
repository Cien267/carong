import type { Category, Duration, Product } from '../../lib/schema';
import type { IconName } from '../icons/paths';
import { vnd } from '../../lib/format';
import { useCart } from '../../stores/cart';
import Icon from '../icons/Icon';
import Placeholder from './Placeholder';
import QtyStepper from './QtyStepper';

interface Props { product: Product; category?: Category; duration: Duration }

export default function GearCard({ product, category, duration }: Props) {
  const qty = useCart((s) => s.qty.product[product.id] ?? 0);
  const setQty = useCart((s) => s.setQty);
  const price = product.pricing[duration.id] ?? 0;
  const soldOut = product.stock === 0;

  return (
    <article className="stamp flex gap-3 bg-kraft-light/60 p-3">
      <Placeholder image={product.image} label={product.name} className="size-24 shrink-0 self-start sm:size-28" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="meta flex items-center gap-1.5">
          <Icon name={(category?.id ?? 'box') as IconName} size={14} />
          {category?.label}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 text-[13px] leading-snug text-ink/75">{product.specs}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p className="font-semibold">
            {vnd(price)} <span className="meta font-normal">{duration.priceSuffix}</span>
          </p>
          {qty === 0 ? (
            <button type="button" className="btn btn-ghost !min-h-11" disabled={soldOut} onClick={() => setQty('product', product.id, 1)}>
              {soldOut ? 'Tạm hết' : 'Thêm'}
            </button>
          ) : (
            <QtyStepper value={qty} max={product.stock} label={product.name} onChange={(n) => setQty('product', product.id, n)} />
          )}
        </div>
      </div>
    </article>
  );
}

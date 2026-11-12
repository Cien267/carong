import Icon from '../icons/Icon';

interface Props { value: number; max: number; label: string; onChange: (n: number) => void }

export default function QtyStepper({ value, max, label, onChange }: Props) {
  return (
    <div className="inline-flex items-stretch border-[1.5px] border-ink" role="group" aria-label={`Số lượng ${label}`}>
      <button type="button" className="grid size-11 place-items-center hover:bg-kraft-light" onClick={() => onChange(value - 1)} aria-label={`Bớt ${label}`}>
        <Icon name="minus" size={16} />
      </button>
      <output className="grid min-w-9 place-items-center border-x-[1.5px] border-ink font-mono text-sm" aria-live="polite">{value}</output>
      <button type="button" className="grid size-11 place-items-center hover:bg-kraft-light disabled:opacity-40" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Thêm ${label}`}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

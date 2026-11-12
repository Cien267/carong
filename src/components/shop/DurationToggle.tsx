import type { Duration } from '../../lib/schema';

interface Props { durations: Duration[]; value: string; onChange: (id: string) => void }

export default function DurationToggle({ durations, value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Thời gian thuê" className="stamp inline-flex bg-kraft-light p-1">
      {durations.map((d) => {
        const on = d.id === value;
        return (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(d.id)}
            className={`min-h-11 px-4 text-left leading-tight ${on ? 'bg-ink text-kraft-light' : 'hover:bg-kraft'}`}
          >
            <span className="block text-sm font-semibold">{d.label}</span>
            <span className="block font-mono text-[11px] opacity-75">{d.note}</span>
          </button>
        );
      })}
    </div>
  );
}

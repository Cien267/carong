import { useRef, useState, type KeyboardEvent } from "react"
import type { ManualGuide } from "../lib/schema"
import Icon from "./icons/Icon"

const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
}

export default function ManualTabs({ guides }: { guides: ManualGuide[] }) {
  const [active, setActive] = useState(guides[0]?.comboId ?? "")
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function onKeyDown(e: KeyboardEvent, index: number) {
    const last = guides.length - 1
    let next = -1
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = last
    if (next < 0) return
    e.preventDefault()
    const id = guides[next]!.comboId
    setActive(id)
    tabRefs.current[id]?.focus()
  }

  return (
    <div className="mx-auto max-w-6xl px-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="manual-title" className="font-display text-4xl md:text-6xl">
            Hướng dẫn pha
          </h2>
          <p className="mt-2 max-w-md text-ink/80">
            Pha cà phê ngoài trời chỉ cần vài bước đơn giản. Bạn hãy chọn bộ
            mình định thuê để xem trước cách pha.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Chọn bộ pha"
          className="stamp inline-flex max-w-full self-start overflow-x-auto bg-kraft-light p-1 md:self-auto"
        >
          {guides.map((g, i) => {
            const on = g.comboId === active
            return (
              <button
                key={g.comboId}
                ref={(el) => {
                  tabRefs.current[g.comboId] = el
                }}
                type="button"
                role="tab"
                id={`manual-tab-${g.comboId}`}
                aria-selected={on}
                aria-controls={`manual-panel-${g.comboId}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(g.comboId)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`min-h-11 shrink-0 px-3 text-sm font-semibold ${on ? "bg-ink text-kraft-light" : "hover:bg-kraft"}`}
              >
                {g.tabLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mọi panel đều có trong HTML (inactive chỉ bị hidden) nên Google vẫn đọc được cả 3 quy trình. */}
      {guides.map((g) => (
        <div
          key={g.comboId}
          role="tabpanel"
          id={`manual-panel-${g.comboId}`}
          aria-labelledby={`manual-tab-${g.comboId}`}
          hidden={g.comboId !== active}
          className="mt-8"
        >
          <ol
            className={`stamp grid ${COLS[g.steps.length] ?? "md:grid-cols-3"}`}
          >
            {g.steps.map((s, i) => (
              <li
                key={s.id}
                className={`p-5 ${i > 0 ? "border-t border-dashed border-ink md:border-l md:border-t-0" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="meta">
                    Bước {i + 1}/{g.steps.length}
                  </span>
                  <Icon name={s.icon} size={28} />
                </div>
                <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
                  {s.body}
                </p>
                <p className="meta mt-4 border-t border-dashed border-ink pt-3">
                  {s.hint}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

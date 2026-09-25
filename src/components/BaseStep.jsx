import { BASES, VOLUMES } from '../data/ingredients.js'
import { baseNutrition, fmt } from '../utils/nutrition.js'

/* Cup drawn at the size of the volume */
function CupIcon({ scale }) {
  return (
    <svg viewBox="0 0 40 52" className="cup-icon" style={{ '--cup-scale': scale }} aria-hidden="true">
      <rect x="8" y="2" width="24" height="7" rx="2" fill="currentColor" />
      <path d="M5 11h30l-3 36a4 4 0 0 1-4 3.6H12a4 4 0 0 1-4-3.6z" fill="currentColor" opacity=".18" />
      <path d="M6.3 26h27.4l-1.7 21a4 4 0 0 1-4 3.6H12a4 4 0 0 1-4-3.6z" fill="currentColor" />
    </svg>
  )
}

export default function BaseStep({ order, onBase, onVolume }) {
  return (
    <div className="step">
      <div className="step-head">
        <p className="step-count">Step 1 of 3</p>
        <h1>Choose your base</h1>
      </div>

      <section aria-labelledby="vol-title">
        <h2 id="vol-title" className="section-title">What size?</h2>
        <div className="volume-row">
          {VOLUMES.map((v, i) => {
            const selected = order.volume === v.ml
            return (
              <button
                key={v.ml}
                type="button"
                className="volume-card"
                aria-pressed={selected}
                onClick={() => onVolume(v.ml)}
              >
                <CupIcon scale={0.7 + i * 0.15} />
                <span className="volume-label">{v.label}</span>
                <span className="volume-ml">{v.ml} ml</span>
                <span className="volume-price">{v.price > 0 ? `+${fmt.price(v.price)}` : 'Included'}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="base-title">
        <h2 id="base-title" className="section-title">Which liquid?</h2>
        <div className="tile-grid">
          {BASES.map((b) => {
            const n = baseNutrition(b.id, order.volume)
            const selected = order.baseId === b.id
            return (
              <button
                key={b.id}
                type="button"
                className="tile"
                aria-pressed={selected}
                onClick={() => onBase(b.id)}
              >
                {selected && (
                  <span className="tile-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="tile-visual" style={{ '--tile-bg': b.color }} aria-hidden="true">
                  {b.emoji}
                </span>
                <span className="tile-name">{b.name}</span>
                <span className="tile-kcal">{fmt.kcal(n.kcal)}</span>
                <span className="tile-meta">
                  P {fmt.g(n.protein)} C {fmt.g(n.carbs)} F {fmt.g(n.fat)}
                </span>
                <span className="tile-price">{b.price > 0 ? `+${fmt.price(b.price)}` : 'Included'}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

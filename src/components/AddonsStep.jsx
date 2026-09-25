import { useRef, useState } from 'react'
import { ADDON_CATEGORIES } from '../data/ingredients.js'
import AddonTile from './AddonTile.jsx'

export default function AddonsStep({ order, onChange }) {
  const [activeCat, setActiveCat] = useState(ADDON_CATEGORIES[0].id)
  const gridRef = useRef(null)
  const category = ADDON_CATEGORIES.find((c) => c.id === activeCat)

  const countIn = (cat) => cat.items.reduce((n, it) => n + (order.addons[it.id] ?? 0), 0)

  const select = (id) => {
    setActiveCat(id)
    gridRef.current?.closest('.kiosk-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="step step-addons">
      <nav className="rail" aria-label="Ingredient categories">
        <ul role="tablist" aria-orientation="vertical">
          {ADDON_CATEGORIES.map((cat) => {
            const n = countIn(cat)
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-selected={cat.id === activeCat}
                  aria-controls="addons-panel"
                  className="rail-item"
                  onClick={() => select(cat.id)}
                >
                  <span className="rail-icon" aria-hidden="true">{cat.icon}</span>
                  <span className="rail-label">{cat.name}</span>
                  {n > 0 && <span className="rail-badge">{n}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="addons-body" ref={gridRef}>
        <div className="step-head">
          <p className="step-count">Step 2 of 3</p>
          <h1>{category.name}</h1>
          <p className="step-sub">{category.hint} Tap an ingredient to add it.</p>
        </div>

        <div id="addons-panel" role="tabpanel" aria-labelledby={`tab-${category.id}`} className="tile-grid">
          {category.items.map((item) => (
            <AddonTile
              key={item.id}
              item={item}
              qty={order.addons[item.id] ?? 0}
              onChange={(d) => onChange(item.id, d)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

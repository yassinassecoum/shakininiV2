import { useRef, useState } from 'react'
import { fmt } from '../utils/nutrition.js'

/**
 * Kiosk-style ingredient tile: tap the tile to add a serving,
 * the − button appears as soon as there is at least one.
 */
export default function AddonTile({ item, qty, onChange }) {
  const [pops, setPops] = useState([])
  const idRef = useRef(0)
  const maxed = qty >= item.max

  const add = () => {
    if (maxed) return
    onChange(1)
    const id = ++idRef.current
    setPops((p) => [...p, id])
    setTimeout(() => setPops((p) => p.filter((x) => x !== id)), 750)
  }

  return (
    <div className="tile addon-tile" data-active={qty > 0}>
      <button
        type="button"
        className="tile-hit"
        onClick={add}
        disabled={maxed}
        aria-label={`Add ${item.name}, ${item.portion}, ${Math.round(item.kcal)} kilocalories. Quantity: ${qty}`}
      />

      {qty > 0 && (
        <span className="tile-qty" aria-hidden="true">
          ×{qty}
        </span>
      )}

      <span className="tile-visual" style={{ '--tile-bg': `${item.color}33` }} aria-hidden="true">
        {item.emoji}
        {pops.map((id) => (
          <span key={id} className="tile-pop">
            +{Math.round(item.kcal)} kcal
          </span>
        ))}
      </span>
      <span className="tile-name">{item.name}</span>
      <span className="tile-portion">{item.portion}</span>
      <span className="tile-kcal">{fmt.kcal(item.kcal)}</span>
      <span className="tile-meta">
        P {fmt.g(item.protein)} C {fmt.g(item.carbs)} F {fmt.g(item.fat)}
      </span>

      <span className="tile-foot">
        <span className="tile-price">{fmt.price(item.price)}</span>
        {qty > 0 ? (
          <span className="tile-stepper">
            <button type="button" onClick={() => onChange(-1)} aria-label={`Remove one serving of ${item.name}`}>
              −
            </button>
            <button type="button" onClick={add} disabled={maxed} aria-label={`Add one serving of ${item.name}`}>
              +
            </button>
          </span>
        ) : (
          <span className="tile-add" aria-hidden="true">
            +
          </span>
        )}
      </span>
      {maxed && <span className="tile-max">Maximum reached</span>}
    </div>
  )
}

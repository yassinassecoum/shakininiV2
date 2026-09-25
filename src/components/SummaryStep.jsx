import { ADDONS_BY_ID, BASES_BY_ID, BASE_PRICE, VOLUMES } from '../data/ingredients.js'
import { addonNutrition, baseNutrition, fmt } from '../utils/nutrition.js'
import QtyControl from './QtyControl.jsx'

export default function SummaryStep({ order, nutrition, price, customer, onCustomer, onChange, onRemove, onEdit, onSubmit }) {
  const base = BASES_BY_ID[order.baseId]
  const volume = VOLUMES.find((v) => v.ml === order.volume)
  const baseN = baseNutrition(order.baseId, order.volume)
  const baseLinePrice = BASE_PRICE + (base?.price ?? 0) + (volume?.price ?? 0)
  const lines = Object.entries(order.addons).map(([id, qty]) => ({ id, qty, item: ADDONS_BY_ID[id] }))

  return (
    <div className="step step-recap">
      <div className="step-head">
        <p className="step-count">Step 3 of 3</p>
        <h1>Your shaker</h1>
        <p className="step-sub">Adjust the quantities if needed, then place your order to get your QR code.</p>
      </div>

      <ul className="recap-list">
        <li className="recap-line recap-line-base">
          <span className="recap-emoji" style={{ '--tile-bg': base?.color }} aria-hidden="true">{base?.emoji}</span>
          <span className="recap-info">
            <span className="recap-name">{base?.name}</span>
            <span className="recap-sub">
              {volume?.label} base · {order.volume} ml · {fmt.kcal(baseN.kcal)}
            </span>
          </span>
          <button type="button" className="btn btn-small" onClick={() => onEdit(0)}>
            Edit
          </button>
          <span className="recap-price">{fmt.price(baseLinePrice)}</span>
        </li>

        {lines.map(({ id, qty, item }) => (
          <li key={id} className="recap-line">
            <span className="recap-emoji" style={{ '--tile-bg': `${item.color}33` }} aria-hidden="true">{item.emoji}</span>
            <span className="recap-info">
              <span className="recap-name">{item.name}</span>
              <span className="recap-sub">
                {item.portion} · {fmt.kcal(addonNutrition(id, qty).kcal)}
              </span>
            </span>
            <span className="recap-controls">
              <QtyControl value={qty} max={item.max} label={item.name} onChange={(d) => onChange(id, d)} />
              <button type="button" className="recap-remove" onClick={() => onRemove(id)} aria-label={`Remove ${item.name}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </span>
            <span className="recap-price">{fmt.price(item.price * qty)}</span>
          </li>
        ))}

        {lines.length === 0 && (
          <li className="recap-empty">
            No add-ons yet.
            <button type="button" className="btn btn-small" onClick={() => onEdit(1)}>
              Add ingredients
            </button>
          </li>
        )}
      </ul>

      {lines.length > 0 && (
        <button type="button" className="recap-more" onClick={() => onEdit(1)}>
          + Add something else
        </button>
      )}

      <div className="recap-totals">
        <div>
          <span className="recap-totals-label">Total</span>
          <span className="recap-totals-kcal">{fmt.kcal(nutrition.kcal)}</span>
          <span className="recap-totals-macros">
            {fmt.g(nutrition.protein)} protein, {fmt.g(nutrition.carbs)} carbs, {fmt.g(nutrition.fat)} fat
          </span>
        </div>
        <span className="recap-totals-price">{fmt.price(price)}</span>
      </div>

      <form
        className="name-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <label htmlFor="customer">Your first name, so we can call you at the counter</label>
        <input
          id="customer"
          type="text"
          autoComplete="given-name"
          maxLength={30}
          placeholder="Optional"
          value={customer}
          onChange={(e) => onCustomer(e.target.value)}
        />
      </form>
    </div>
  )
}

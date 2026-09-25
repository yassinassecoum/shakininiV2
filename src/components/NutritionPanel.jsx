import { SHAKER_CAPACITY_ML } from '../data/ingredients.js'
import useAnimatedNumber from '../hooks/useAnimatedNumber.js'
import { fmt, macroSplit } from '../utils/nutrition.js'

const MACROS = [
  { key: 'protein', label: 'Protein', cls: 'm-protein' },
  { key: 'carbs', label: 'Carbs', cls: 'm-carbs' },
  { key: 'fat', label: 'Fat', cls: 'm-fat' },
]

function MacroValue({ value }) {
  const v = useAnimatedNumber(value)
  return <strong>{fmt.g(v)}</strong>
}

export default function NutritionPanel({ nutrition, price, volume, fillMl }) {
  const split = macroSplit(nutrition)
  const overflow = fillMl > SHAKER_CAPACITY_ML
  const kcal = useAnimatedNumber(nutrition.kcal)

  return (
    <div className="nutri">
      <div className="nutri-kcal">
        <span className="nutri-kcal-value">{Math.round(kcal)}</span>
        <span className="nutri-kcal-unit">kcal</span>
        <span className="nutri-price">{fmt.price(volume ? price : 0)}</span>
      </div>

      <div
        className="energy-bar"
        role="img"
        aria-label={`Energy split: protein ${Math.round(split.protein)}%, carbs ${Math.round(split.carbs)}%, fat ${Math.round(split.fat)}%`}
      >
        {MACROS.map((m) => (
          <span key={m.key} className={m.cls} style={{ flexGrow: split[m.key] || 0.0001 }} />
        ))}
      </div>

      <dl className="macro-list">
        {MACROS.map((m) => (
          <div key={m.key} className="macro">
            <dt>
              <span className={`dot ${m.cls}`} aria-hidden="true" />
              {m.label}
            </dt>
            <dd>
              <MacroValue value={nutrition[m.key]} />
              <span>{Math.round(split[m.key])}%</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="nutri-volume" data-warn={overflow}>
        {volume
          ? overflow
            ? `About ${Math.round(fillMl)} ml: that’s more than the ${SHAKER_CAPACITY_ML} ml shaker holds. Remove an ingredient or pick a smaller size.`
            : `About ${Math.round(fillMl)} ml in a ${SHAKER_CAPACITY_ML} ml shaker.`
          : 'Indicative values, based on standard servings.'}
      </p>
    </div>
  )
}

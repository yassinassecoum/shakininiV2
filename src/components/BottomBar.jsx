import useAnimatedNumber from '../hooks/useAnimatedNumber.js'
import { fmt } from '../utils/nutrition.js'

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function BottomBar({
  steps,
  current,
  allDone = false,
  canGoTo,
  onSelect,
  onCancel,
  onNext,
  nextDisabled,
  nextLabel,
  kcal,
  price,
  onOpenSheet,
}) {
  const kcalAnim = useAnimatedNumber(kcal)

  return (
    <footer className="k-bottom">
      {onCancel ? (
        <button type="button" className="k-cancel" onClick={onCancel}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="k-cancel-label">Cancel</span>
        </button>
      ) : (
        <span className="k-cancel-spacer" />
      )}

      <nav className="k-steps" aria-label="Order steps">
        <ol>
          {steps.map((s, i) => {
            const state = allDone || i < current ? 'done' : i === current ? 'current' : 'todo'
            return (
              <li key={s.id} data-state={state}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  disabled={allDone || !canGoTo(i)}
                  aria-current={!allDone && i === current ? 'step' : undefined}
                >
                  <span className="k-step-num">{state === 'done' ? <Check /> : i + 1}</span>
                  <span className="k-step-label">{s.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="k-checkout">
        <button type="button" className="k-total" onClick={onOpenSheet} aria-label="View my shaker and macros">
          <span className="k-total-kcal">
            {Math.round(kcalAnim)} <small>kcal</small>
          </span>
          <span className="k-total-price">{fmt.price(price)}</span>
        </button>
        <button type="button" className="k-next" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
  )
}

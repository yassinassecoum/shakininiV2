import Logo from './Logo.jsx'
import ShakerScene from './ShakerScene.jsx'

const DEMO_ADDONS = { strawberries: 1, banana: 1, blueberries: 1 }

export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <div className="welcome-stage" aria-hidden="true">
        <ShakerScene liquidColor="#E7A3B4" fillMl={520} addons={DEMO_ADDONS} shakeKey={0} />
      </div>

      <div className="welcome-copy">
        <h1 className="welcome-logo">
          <Logo size="xl" />
        </h1>
        <p className="welcome-title">Your shaker, one ingredient at a time.</p>
        <p className="welcome-sub">Choose your base, add your protein and fruit, track your calories live.</p>

        <ol className="welcome-steps" aria-label="How it works">
          <li><span>1</span>Base</li>
          <li><span>2</span>Add-ons</li>
          <li><span>3</span>Summary & QR</li>
        </ol>

        <div className="welcome-choices" role="group" aria-label="Where will you drink your shaker?">
          <button type="button" className="welcome-choice" onClick={() => onStart('eat-in')}>
            <span className="welcome-choice-icon" aria-hidden="true">🪑</span>
            <span className="welcome-choice-label">Eat in</span>
          </button>
          <button type="button" className="welcome-choice" onClick={() => onStart('takeaway')}>
            <span className="welcome-choice-icon" aria-hidden="true">🛍️</span>
            <span className="welcome-choice-label">Takeaway</span>
          </button>
        </div>
      </div>
    </div>
  )
}

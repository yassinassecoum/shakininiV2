import Logo from './Logo.jsx'

export default function KioskHeader({ onBack, backLabel, mode, onToggleMode }) {
  return (
    <header className="k-header">
      <div>
        {onBack && (
          <button type="button" className="k-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="k-back-label">{backLabel}</span>
          </button>
        )}
      </div>

      <Logo size="md" />

      <div className="k-header-end">
        <button
          type="button"
          className="k-mode"
          onClick={onToggleMode}
          disabled={!onToggleMode}
          aria-label={`Mode: ${mode === 'eat-in' ? 'eat in' : 'takeaway'}${onToggleMode ? '. Change' : ''}`}
        >
          <span aria-hidden="true">{mode === 'eat-in' ? '🪑' : '🛍️'}</span>
          <span className="k-mode-label" aria-hidden="true">{mode === 'eat-in' ? 'Eat in' : 'Takeaway'}</span>
        </button>
      </div>
    </header>
  )
}

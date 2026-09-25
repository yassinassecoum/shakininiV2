import { useEffect } from 'react'
import ShakerScene from './ShakerScene.jsx'
import NutritionPanel from './NutritionPanel.jsx'

/**
 * "My shaker" panel: fixed right-hand column on large screens,
 * sheet that slides up from the bottom on mobile.
 */
export default function LivePanel({
  open,
  onClose,
  liquidColor,
  fillMl,
  addons,
  hasBase,
  shakeKey,
  onShake,
  nutrition,
  price,
  volume,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div className="sheet-backdrop" data-open={open} onClick={onClose} aria-hidden="true" />
      <aside className="live" data-open={open} aria-label="My shaker, live">
        <div className="sheet-handle">
          <span>My shaker</span>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="stage">
          <ShakerScene liquidColor={liquidColor} fillMl={fillMl} addons={addons} shakeKey={shakeKey} />
          {hasBase ? (
            <button type="button" className="shake-btn" onClick={onShake}>
              Shake it
            </button>
          ) : (
            <p className="stage-empty">Choose a base to fill your shaker.</p>
          )}
        </div>
        <NutritionPanel nutrition={nutrition} price={price} volume={volume} fillMl={fillMl} />
      </aside>
    </>
  )
}

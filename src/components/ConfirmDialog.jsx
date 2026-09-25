import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onConfirm, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal?.()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="k-dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-labelledby="dialog-title"
    >
      <div className="k-dialog-inner">
        <h2 id="dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="k-dialog-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} autoFocus>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

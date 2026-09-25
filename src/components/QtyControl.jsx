export default function QtyControl({ value, max, onChange, label }) {
  return (
    <div className="qty" data-active={value > 0}>
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={value === 0}
        aria-label={`Remove one serving of ${label}`}
      >
        −
      </button>
      <output aria-live="polite" aria-label={`Quantity of ${label}`}>{value}</output>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={value >= max}
        aria-label={`Add one serving of ${label}`}
      >
        +
      </button>
    </div>
  )
}

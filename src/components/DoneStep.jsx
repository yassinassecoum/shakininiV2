import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { ADDONS_BY_ID, BASES_BY_ID, BASE_PRICE, VOLUMES } from '../data/ingredients.js'
import { addonNutrition, baseNutrition, fmt } from '../utils/nutrition.js'

/** Final screen: summary table + ticket with the QR code. */
export default function DoneStep({ receipt }) {
  const { orderId, customer, mode, order, nutrition, price, text } = receipt
  const qrRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const base = BASES_BY_ID[order.baseId]
  const volume = VOLUMES.find((v) => v.ml === order.volume)
  const baseN = baseNutrition(order.baseId, order.volume)
  const baseLinePrice = BASE_PRICE + (base?.price ?? 0) + (volume?.price ?? 0)
  const lines = Object.entries(order.addons).map(([id, qty]) => ({ id, qty, item: ADDONS_BY_ID[id] }))

  const download = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `shakinini-${orderId}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="step step-done">
      <div className="step-head">
        <p className="step-count">Order confirmed · {mode === 'eat-in' ? 'Eat in' : 'Takeaway'}</p>
        <h1>Order ready</h1>
        <p className="step-sub">Show this QR code at the counter: it contains all the details of your order.</p>
      </div>

      <table className="order-table">
        <caption className="sr-only">Order details</caption>
        <thead>
          <tr>
            <th scope="col">Ingredient</th>
            <th scope="col" className="num">Calories</th>
            <th scope="col" className="num">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <div className="order-item">
                <span className="order-emoji" aria-hidden="true">{base?.emoji}</span>
                <span>
                  {base?.name}
                  <small>{order.volume} ml · base</small>
                </span>
              </div>
            </th>
            <td className="num">{fmt.kcal(baseN.kcal)}</td>
            <td className="num">{fmt.price(baseLinePrice)}</td>
          </tr>
          {lines.map(({ id, qty, item }) => (
            <tr key={id}>
              <th scope="row">
                <div className="order-item">
                  <span className="order-emoji" aria-hidden="true">{item.emoji}</span>
                  <span>
                    {item.name}
                    <small>
                      {qty} × {item.portion}
                    </small>
                  </span>
                </div>
              </th>
              <td className="num">{fmt.kcal(addonNutrition(id, qty).kcal)}</td>
              <td className="num">{fmt.price(item.price * qty)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td className="num">{fmt.kcal(nutrition.kcal)}</td>
            <td className="num">{fmt.price(price)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="ticket">
        <div className="ticket-qr" ref={qrRef}>
          <QRCodeCanvas
            value={text}
            size={232}
            level="M"
            marginSize={2}
            bgColor="#FFFFFF"
            fgColor="#1E1B4B"
            title={`QR code for order ${orderId}`}
          />
        </div>
        <div className="ticket-info">
          <span className="ticket-id">{orderId}</span>
          {customer && <span className="ticket-name">For {customer}</span>}
          <pre className="ticket-text">{text}</pre>
          <div className="ticket-actions">
            <button type="button" className="btn btn-primary" onClick={download}>
              Download QR code
            </button>
            <button type="button" className="btn btn-ghost" onClick={copy}>
              {copied ? 'Summary copied' : 'Copy summary'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

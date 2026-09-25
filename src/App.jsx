import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import KioskHeader from './components/KioskHeader.jsx'
import BottomBar from './components/BottomBar.jsx'
import Welcome from './components/Welcome.jsx'
import BaseStep from './components/BaseStep.jsx'
import AddonsStep from './components/AddonsStep.jsx'
import SummaryStep from './components/SummaryStep.jsx'
import DoneStep from './components/DoneStep.jsx'
import LivePanel from './components/LivePanel.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import { ADDONS_BY_ID } from './data/ingredients.js'
import { filledVolume, makeOrderId, mixColor, orderSummaryText, totalNutrition, totalPrice } from './utils/nutrition.js'

export const STEPS = [
  { id: 'base', label: 'Base' },
  { id: 'addons', label: 'Add-ons' },
  { id: 'summary', label: 'Summary & QR' },
]

const initialOrder = { baseId: null, volume: 350, addons: {} }

function orderReducer(state, action) {
  switch (action.type) {
    case 'setBase':
      return { ...state, baseId: action.baseId }
    case 'setVolume':
      return { ...state, volume: action.volume }
    case 'changeAddon': {
      const item = ADDONS_BY_ID[action.id]
      const current = state.addons[action.id] ?? 0
      const next = Math.max(0, Math.min(item?.max ?? 3, current + action.delta))
      const addons = { ...state.addons }
      if (next === 0) delete addons[action.id]
      else addons[action.id] = next
      return { ...state, addons }
    }
    case 'removeAddon': {
      const addons = { ...state.addons }
      delete addons[action.id]
      return { ...state, addons }
    }
    case 'reset':
      return initialOrder
    default:
      return state
  }
}

export default function App() {
  // screen : 'welcome' → 'order' → 'done'
  const [screen, setScreen] = useState('welcome')
  const [mode, setMode] = useState('takeaway')
  const [step, setStep] = useState(0)
  const [order, dispatch] = useReducer(orderReducer, initialOrder)
  const [customer, setCustomer] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const contentRef = useRef(null)

  // Each step starts back at the top, like a new kiosk screen
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [step, screen])

  const nutrition = useMemo(() => totalNutrition(order), [order])
  const price = useMemo(() => totalPrice(order), [order])
  const liquidColor = useMemo(() => mixColor(order), [order])
  const fillMl = useMemo(() => (order.baseId ? filledVolume(order) : 0), [order])

  const canGoTo = (i) => i === 0 || order.baseId !== null

  const goTo = (i) => {
    if (!canGoTo(i)) return
    setStep(i)
    setSheetOpen(false)
  }

  const start = (m) => {
    setMode(m)
    setScreen('order')
    setStep(0)
  }

  const resetAll = () => {
    dispatch({ type: 'reset' })
    setCustomer('')
    setReceipt(null)
    setStep(0)
    setSheetOpen(false)
    setScreen('welcome')
  }

  const back = () => {
    if (step === 0) setScreen('welcome')
    else goTo(step - 1)
  }

  const validate = () => {
    const orderId = makeOrderId()
    const createdAt = new Date()
    const name = customer.trim()
    setReceipt({
      orderId,
      createdAt,
      customer: name,
      mode,
      order,
      nutrition,
      price,
      text: orderSummaryText(order, { orderId, customer: name, createdAt, mode }),
    })
    setScreen('done')
  }

  const next = () => {
    if (step < STEPS.length - 1) goTo(step + 1)
    else validate()
  }

  const addToShaker = (id, delta) => {
    dispatch({ type: 'changeAddon', id, delta })
  }

  if (screen === 'welcome') {
    return <Welcome onStart={start} />
  }

  const done = screen === 'done'
  // On the final screen, the panel shows the confirmed order
  const shown = done ? receipt.order : order
  const shownNutrition = done ? receipt.nutrition : nutrition
  const shownPrice = done ? receipt.price : price

  return (
    <div className="kiosk" data-step={done ? 'done' : STEPS[step].id}>
      <KioskHeader
        onBack={done ? null : back}
        backLabel={step === 0 ? 'Home' : `Back: ${STEPS[step - 1].label}`}
        mode={mode}
        onToggleMode={done ? null : () => setMode((m) => (m === 'eat-in' ? 'takeaway' : 'eat-in'))}
      />

      <main className="kiosk-main">
        <div className="kiosk-content" ref={contentRef}>
          {done && <DoneStep receipt={receipt} />}
          {!done && step === 0 && (
            <BaseStep
              order={order}
              onBase={(baseId) => dispatch({ type: 'setBase', baseId })}
              onVolume={(volume) => dispatch({ type: 'setVolume', volume })}
            />
          )}
          {!done && step === 1 && <AddonsStep order={order} onChange={addToShaker} />}
          {!done && step === 2 && (
            <SummaryStep
              order={order}
              nutrition={nutrition}
              price={price}
              customer={customer}
              onCustomer={setCustomer}
              onChange={addToShaker}
              onRemove={(id) => dispatch({ type: 'removeAddon', id })}
              onEdit={goTo}
              onSubmit={validate}
            />
          )}
        </div>

        <LivePanel
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          liquidColor={liquidColor}
          fillMl={fillMl}
          addons={shown.addons}
          hasBase={!!shown.baseId}
          shakeKey={shakeKey}
          onShake={() => setShakeKey((k) => k + 1)}
          nutrition={shownNutrition}
          price={shownPrice}
          volume={shown.baseId ? shown.volume : 0}
        />
      </main>

      <BottomBar
        steps={STEPS}
        current={step}
        allDone={done}
        canGoTo={canGoTo}
        onSelect={goTo}
        onCancel={done ? null : () => setCancelOpen(true)}
        onNext={done ? resetAll : next}
        nextDisabled={!done && !order.baseId}
        nextLabel={done ? 'New order' : step === 0 ? 'Choose add-ons' : step === 1 ? 'View summary' : 'Place order'}
        kcal={shownNutrition.kcal}
        price={shown.baseId ? shownPrice : 0}
        onOpenSheet={() => setSheetOpen(true)}
      />

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel your order?"
        body="Your shaker will be emptied and you’ll go back to the home screen."
        confirmLabel="Yes, cancel"
        cancelLabel="Keep ordering"
        onConfirm={() => {
          setCancelOpen(false)
          resetAll()
        }}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  )
}

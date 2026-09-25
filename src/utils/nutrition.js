import { ADDONS_BY_ID, BASES_BY_ID, BASE_PRICE, VOLUMES } from '../data/ingredients.js'

const EMPTY = { kcal: 0, protein: 0, carbs: 0, fat: 0 }

/** Base values for a given volume (catalogue values are per 100 ml). */
export function baseNutrition(baseId, volumeMl) {
  const base = BASES_BY_ID[baseId]
  if (!base) return { ...EMPTY }
  const f = volumeMl / 100
  return {
    kcal: base.kcal * f,
    protein: base.protein * f,
    carbs: base.carbs * f,
    fat: base.fat * f,
  }
}

/** Values of an add-on multiplied by its quantity. */
export function addonNutrition(addonId, qty) {
  const a = ADDONS_BY_ID[addonId]
  if (!a || qty <= 0) return { ...EMPTY }
  return {
    kcal: a.kcal * qty,
    protein: a.protein * qty,
    carbs: a.carbs * qty,
    fat: a.fat * qty,
  }
}

function sum(a, b) {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
  }
}

/** Total for the whole shaker. */
export function totalNutrition(order) {
  let total = baseNutrition(order.baseId, order.volume)
  for (const [id, qty] of Object.entries(order.addons)) {
    total = sum(total, addonNutrition(id, qty))
  }
  return total
}

/** Energy split of the macros in % (4 / 4 / 9 kcal per gram). */
export function macroSplit({ protein, carbs, fat }) {
  const p = protein * 4
  const c = carbs * 4
  const f = fat * 9
  const t = p + c + f
  if (t === 0) return { protein: 0, carbs: 0, fat: 0 }
  return { protein: (p / t) * 100, carbs: (c / t) * 100, fat: (f / t) * 100 }
}

export function totalPrice(order) {
  const base = BASES_BY_ID[order.baseId]
  const volume = VOLUMES.find((v) => v.ml === order.volume)
  let price = BASE_PRICE + (base?.price ?? 0) + (volume?.price ?? 0)
  for (const [id, qty] of Object.entries(order.addons)) {
    price += (ADDONS_BY_ID[id]?.price ?? 0) * qty
  }
  return Math.round(price * 100) / 100
}

export function addonCount(order) {
  return Object.values(order.addons).reduce((n, q) => n + q, 0)
}

/* ---------- Mix colour for the 3D view ---------- */

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

function rgbToHex(rgb) {
  return '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

/**
 * Weighted average of colours: the base counts by its volume,
 * each add-on by its `tint` × quantity.
 */
export function mixColor(order) {
  const base = BASES_BY_ID[order.baseId]
  if (!base) return '#EDEDED'
  const layers = [{ color: base.color, weight: order.volume / 250 }]
  for (const [id, qty] of Object.entries(order.addons)) {
    const a = ADDONS_BY_ID[id]
    if (a && a.tint > 0) layers.push({ color: a.color, weight: a.tint * qty })
  }
  const totalW = layers.reduce((s, l) => s + l.weight, 0)
  const rgb = [0, 0, 0]
  for (const l of layers) {
    const c = hexToRgb(l.color)
    for (let i = 0; i < 3; i++) rgb[i] += (c[i] * l.weight) / totalW
  }
  return rgbToHex(rgb)
}

/** Approximate volume taken up in the shaker (the base + ~the solids). */
export function filledVolume(order) {
  let ml = order.volume
  for (const [id, qty] of Object.entries(order.addons)) {
    const a = ADDONS_BY_ID[id]
    if (!a) continue
    // Fruits and grains take up space, powders barely any.
    ml += (a.particle ? 45 : 12) * qty
  }
  return ml
}

/* ---------- Formatting ---------- */

export const fmt = {
  kcal: (v) => `${Math.round(v)} kcal`,
  g: (v) => `${v < 10 ? Math.round(v * 10) / 10 : Math.round(v)} g`,
  price: (v) => v.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' }),
}

/* ---------- Order ---------- */

export function makeOrderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  for (let i = 0; i < 5; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `SK-${id}`
}

/** Text encoded in the QR code: readable by any scanner. */
export function orderSummaryText(order, { orderId, customer, createdAt, mode }) {
  const base = BASES_BY_ID[order.baseId]
  const n = totalNutrition(order)
  const lines = [
    `SHAKININI · Order ${orderId}`,
    customer ? `Customer: ${customer}` : null,
    mode ? (mode === 'eat-in' ? 'Eat in' : 'Takeaway') : null,
    `Date: ${createdAt.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}`,
    '',
    `Base: ${base?.name ?? '—'} ${order.volume} ml`,
  ]
  for (const [id, qty] of Object.entries(order.addons)) {
    const a = ADDONS_BY_ID[id]
    if (a && qty > 0) lines.push(`+ ${a.name} x${qty} (${a.portion})`)
  }
  lines.push(
    '',
    `Calories: ${Math.round(n.kcal)} kcal`,
    `Protein ${Math.round(n.protein)} g · Carbs ${Math.round(n.carbs)} g · Fat ${Math.round(n.fat)} g`,
    `Total: ${fmt.price(totalPrice(order))}`,
  )
  return lines.filter((l) => l !== null).join('\n')
}

/**
 * Adult daily reference intakes (EU Regulation 1169/2011),
 * used to fill the macro rings.
 */
export const REFERENCE_INTAKES = { kcal: 2000, protein: 50, carbs: 260, fat: 70 }

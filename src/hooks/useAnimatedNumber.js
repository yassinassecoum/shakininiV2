import { useEffect, useRef, useState } from 'react'

const reduce =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Rolls a number towards its new value (calorie counter). */
export default function useAnimatedNumber(value, duration = 450) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const displayRef = useRef(value)

  useEffect(() => {
    if (reduce) {
      displayRef.current = value
      setDisplay(value)
      return
    }
    fromRef.current = displayRef.current
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = fromRef.current + (value - fromRef.current) * eased
      displayRef.current = v
      setDisplay(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return display
}

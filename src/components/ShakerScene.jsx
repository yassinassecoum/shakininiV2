import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ADDONS_BY_ID, SHAKER_CAPACITY_ML } from '../data/ingredients.js'

/* ---------- Shaker dimensions (three.js units) ---------- */
const BODY_H = 2.6
const R_BOTTOM = 0.66
const R_TOP = 0.78
const WALL = 0.035 // visual thickness between glass and liquid
const FLOOR = 0.04 // height of the bottom
const MAX_FILL_H = BODY_H - 0.22 // height reached at full capacity

const GRAPHITE = '#1E1B4B' // blueberry
const ACCENT = '#FF5A6E' // strawberry
const BANANA = '#FFD84D'

/** Inner radius of the shaker at height y. */
const innerRadius = (y) => R_BOTTOM + ((R_TOP - R_BOTTOM) * y) / BODY_H - WALL

/** Converts ml into liquid height. */
const mlToHeight = (ml) => FLOOR + (Math.min(ml, SHAKER_CAPACITY_ML) / SHAKER_CAPACITY_ML) * MAX_FILL_H

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* Deterministic pseudo-random generator (positions stay stable between renders). */
function seeded(seedStr) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------- Glass ---------- */
function Glass({ theme }) {
  const geometry = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(R_BOTTOM - 0.08, 0),
      new THREE.Vector2(R_BOTTOM - 0.02, 0.015),
      new THREE.Vector2(R_BOTTOM, 0.07),
      new THREE.Vector2(R_TOP, BODY_H),
    ]
    return new THREE.LatheGeometry(pts, 72)
  }, [])

  return (
    <group>
      <mesh geometry={geometry} renderOrder={3}>
        <meshPhysicalMaterial
          color="#E4EAF6"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Vertical highlight, fake but effective */}
      <mesh position={[0, BODY_H / 2, 0]} renderOrder={4}>
        <cylinderGeometry args={[R_TOP + 0.004, R_BOTTOM + 0.004, BODY_H - 0.2, 24, 1, true, -1.05, 0.13]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <Graduations theme={theme} />
      <BrandLabel />
    </group>
  )
}

/* ml graduations printed on the glass */
function Graduations({ theme }) {
  const texture = useMemo(() => {
    const W = 200
    const H = 1024
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 27, 75, 0.72)'
    ctx.font = '600 30px "DM Sans", system-ui, sans-serif'
    ctx.textBaseline = 'middle'
    for (let ml = 100; ml <= SHAKER_CAPACITY_ML; ml += 50) {
      const y = (1 - mlToHeight(ml) / BODY_H) * H
      const major = ml % 100 === 0
      ctx.fillRect(0, y - 2, major ? 56 : 30, 4)
      if (major) ctx.fillText(`${ml}`, 68, y)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [theme])

  // Arc ~0.5 units wide, facing the camera.
  return (
    <mesh position={[0, BODY_H / 2, 0]} renderOrder={5}>
      <cylinderGeometry args={[R_TOP + 0.003, R_BOTTOM + 0.003, BODY_H, 24, 1, true, 0.12, 0.7]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

/* "Shakinini" label printed on the back of the shaker */
function BrandLabel() {
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let alive = true
    const fonts = document.fonts
    if (!fonts?.load) {
      setFontReady(true)
      return
    }
    fonts
      .load('800 120px "Bricolage Grotesque"')
      .catch(() => {})
      .finally(() => alive && setFontReady(true))
    return () => {
      alive = false
    }
  }, [])

  const texture = useMemo(() => {
    const W = 1024
    const H = 300
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, W, H)
    // small ring + wordmark
    ctx.lineCap = 'round'
    ctx.lineWidth = 22
    ctx.strokeStyle = 'rgba(30, 27, 75, 0.15)'
    ctx.beginPath()
    ctx.arc(190, H / 2, 46, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = BANANA
    ctx.beginPath()
    ctx.arc(190, H / 2, 46, -Math.PI / 2, Math.PI * 0.95)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = GRAPHITE
    ctx.font = '800 108px "Bricolage Grotesque", "Arial Narrow", sans-serif'
    ctx.fillText('shakinini', 270, H / 2 + 4)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontReady])

  const y0 = 0.9
  const h = 0.62
  const rAt = (y) => R_BOTTOM + ((R_TOP - R_BOTTOM) * y) / BODY_H + 0.006
  // ~150° arc on the back (opposite the graduations)
  return (
    <mesh position={[0, y0 + h / 2, 0]} renderOrder={6}>
      <cylinderGeometry args={[rAt(y0 + h), rAt(y0), h, 64, 1, true, Math.PI - 1.3, 2.6]} />
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.05} side={THREE.FrontSide} />
    </mesh>
  )
}

/* ---------- Liquid ---------- */
function Liquid({ color, targetHeight, fillRef, shakeRef }) {
  const meshRef = useRef()
  const foamRef = useRef()
  const matRef = useRef()
  const foamMatRef = useRef()
  const groupRef = useRef()
  const targetColor = useMemo(() => new THREE.Color(color), [color])
  const foamTarget = useMemo(() => new THREE.Color(color).lerp(new THREE.Color('#FFFFFF'), 0.45), [color])

  // Unit cylinder: the top vertices are moved every frame
  const { geometry, original } = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1, 1, 72, 1, false)
    g.translate(0, 0.5, 0)
    return { geometry: g, original: g.attributes.position.array.slice() }
  }, [])

  const lastH = useRef(-1)

  useFrame((state, delta) => {
    const f = fillRef.current
    // Smooth rise / fall of the level
    f.h = THREE.MathUtils.damp(f.h, targetHeight, 4, delta)
    const h = f.h
    const visible = h > FLOOR + 0.01
    meshRef.current.visible = visible
    foamRef.current.visible = visible

    if (Math.abs(h - lastH.current) > 0.0005) {
      const pos = geometry.attributes.position
      const rBottom = innerRadius(FLOOR)
      const rTop = innerRadius(h)
      for (let i = 0; i < pos.count; i++) {
        const ox = original[i * 3]
        const oy = original[i * 3 + 1]
        const oz = original[i * 3 + 2]
        const top = oy > 0.5
        const r = top ? rTop : rBottom
        pos.setXYZ(i, ox * r, top ? h : FLOOR, oz * r)
      }
      pos.needsUpdate = true
      geometry.computeVertexNormals()
      geometry.computeBoundingSphere()
      lastH.current = h
    }

    foamRef.current.position.y = h + 0.002
    const rf = innerRadius(h) * 0.97
    foamRef.current.scale.set(rf, rf, 1)

    matRef.current.color.lerp(targetColor, 1 - Math.exp(-5 * delta))
    foamMatRef.current.color.lerp(foamTarget, 1 - Math.exp(-5 * delta))

    // Slight surface wobble, stronger while shaking
    const t = state.clock.elapsedTime
    const agitation = 0.012 + shakeRef.current.intensity * 0.06
    groupRef.current.rotation.x = Math.sin(t * 1.7) * agitation
    groupRef.current.rotation.z = Math.cos(t * 1.3) * agitation
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry} renderOrder={1} visible={false}>
        <meshStandardMaterial ref={matRef} color={color} roughness={0.35} transparent opacity={0.82} />
      </mesh>
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2} visible={false}>
        <circleGeometry args={[1, 72]} />
        <meshStandardMaterial ref={foamMatRef} color={color} roughness={0.8} transparent opacity={0.95} />
      </mesh>
    </group>
  )
}

/* ---------- Floating ingredient chunks ---------- */
const PARTICLE_STYLES = {
  chunk: { perPortion: 4, size: [0.07, 0.11], geometry: () => new THREE.IcosahedronGeometry(1, 0) },
  flake: { perPortion: 7, size: [0.05, 0.07], geometry: () => new THREE.CylinderGeometry(1, 1, 0.25, 7) },
  seed: { perPortion: 22, size: [0.018, 0.026], geometry: () => new THREE.SphereGeometry(1, 6, 6) },
}

function particleKind(id) {
  if (id === 'chia' || id === 'flax') return 'seed'
  if (id === 'oats') return 'flake'
  return 'chunk'
}

function Particles({ addonId, qty, color, fillRef, shakeRef }) {
  const kind = particleKind(addonId)
  const style = PARTICLE_STYLES[kind]
  const count = style.perPortion * qty
  const meshRef = useRef()
  const geometry = useMemo(() => style.geometry(), [style])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const items = useMemo(() => {
    const rand = seeded(addonId)
    return Array.from({ length: count }, (_, i) => {
      const surface = kind !== 'seed' && i % 3 === 0 // a third float at the surface
      return {
        angle: rand() * Math.PI * 2,
        radius: Math.sqrt(rand()) * 0.78,
        yFrac: surface ? 1 : 0.1 + rand() * 0.8,
        size: style.size[0] + rand() * (style.size[1] - style.size[0]),
        phase: rand() * Math.PI * 2,
        speed: 0.6 + rand() * 0.8,
        spin: new THREE.Euler(rand() * 6, rand() * 6, rand() * 6),
      }
    })
  }, [addonId, count, kind, style])

  // Hide everything before the first frame (avoids a flash on mount)
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    dummy.scale.setScalar(0)
    dummy.updateMatrix()
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, dummy.matrix)
    mesh.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const h = fillRef.current.h
    const t = state.clock.elapsedTime
    const mix = 1 + shakeRef.current.intensity * 6
    items.forEach((p, i) => {
      const a = p.angle + t * 0.15 * p.speed * mix
      const baseY = p.yFrac === 1 ? h - 0.015 : FLOOR + (h - FLOOR) * p.yFrac
      const y = baseY + Math.sin(t * p.speed * mix + p.phase) * 0.03
      const r = innerRadius(Math.max(y, FLOOR)) * p.radius
      dummy.position.set(Math.cos(a) * r, Math.min(y, h - 0.01), Math.sin(a) * r)
      dummy.rotation.set(p.spin.x + t * 0.3 * mix, p.spin.y, p.spin.z + t * 0.2)
      const s = h > FLOOR + 0.1 ? p.size : 0.0001
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} key={count} renderOrder={0}>
      <meshStandardMaterial color={color} roughness={0.6} />
    </instancedMesh>
  )
}

/* ---------- Lid ---------- */
function Lid() {
  return (
    <group position={[0, BODY_H, 0]}>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[R_TOP + 0.05, R_TOP + 0.04, 0.26, 64]} />
        <meshStandardMaterial color={GRAPHITE} roughness={0.45} />
      </mesh>
      {/* screw thread grooves */}
      {[0.06, 0.13, 0.2].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R_TOP + 0.05, 0.008, 8, 64]} />
          <meshStandardMaterial color="#2D2966" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[R_TOP - 0.1, R_TOP + 0.04, 0.12, 64]} />
        <meshStandardMaterial color={GRAPHITE} roughness={0.45} />
      </mesh>
      {/* spout cap */}
      <mesh position={[0.28, 0.43, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.12, 40]} />
        <meshStandardMaterial color={ACCENT} roughness={0.4} />
      </mesh>
      {/* carry handle */}
      <mesh position={[-0.3, 0.46, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.16, 0.045, 16, 40, Math.PI]} />
        <meshStandardMaterial color={GRAPHITE} roughness={0.45} />
      </mesh>
    </group>
  )
}

/* ---------- Full shaker ---------- */
function Shaker({ liquidColor, fillMl, addons, shakeKey, theme }) {
  const groupRef = useRef()
  const fillRef = useRef({ h: FLOOR })
  const shakeRef = useRef({ start: -10, intensity: 0 })
  const pendingShake = useRef(false)

  useEffect(() => {
    if (shakeKey > 0) pendingShake.current = true
  }, [shakeKey])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pendingShake.current) {
      shakeRef.current.start = t
      pendingShake.current = false
    }
    const DURATION = prefersReducedMotion ? 0.4 : 1.2
    const e = t - shakeRef.current.start
    const g = groupRef.current
    if (e < DURATION) {
      const k = 1 - e / DURATION
      shakeRef.current.intensity = k
      if (!prefersReducedMotion) {
        g.position.y = Math.abs(Math.sin(e * 22)) * 0.25 * k
        g.rotation.z = Math.sin(e * 22) * 0.16 * k
      }
    } else {
      shakeRef.current.intensity = 0
      g.position.y = THREE.MathUtils.lerp(g.position.y, 0, 0.2)
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, 0.2)
    }
  })

  const targetHeight = fillMl > 0 ? mlToHeight(fillMl) : FLOOR

  const particleAddons = Object.entries(addons)
    .map(([id, qty]) => ({ id, qty, item: ADDONS_BY_ID[id] }))
    .filter(({ item, qty }) => item?.particle && qty > 0)

  return (
    <group ref={groupRef}>
      <Liquid color={liquidColor} targetHeight={targetHeight} fillRef={fillRef} shakeRef={shakeRef} />
      {particleAddons.map(({ id, qty, item }) => (
        <Particles key={id} addonId={id} qty={qty} color={item.color} fillRef={fillRef} shakeRef={shakeRef} />
      ))}
      <Glass theme={theme} />
      <Lid />
    </group>
  )
}

export default function ShakerScene({ theme = 'light', ...props }) {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setSupported(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch {
      setSupported(false)
    }
  }, [])

  if (!supported) {
    return <p className="stage-fallback">Your browser can’t display 3D. Macro tracking still works.</p>
  }

  return (
    <Canvas
      className="shaker-canvas"
      dpr={[1, 2]}
      camera={{ position: [0, 2.1, 6.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="3D preview of the shaker"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={theme === 'dark' ? 1.4 : 0.6} color="#DCE6FF" />
      <pointLight position={[0, 1.2, 2.5]} intensity={0.5} />

      <group position={[0, -1.45, 0]}>
        <Shaker {...props} theme={theme} />
        <ContactShadows position={[0, 0, 0]} opacity={theme === 'dark' ? 0.7 : 0.3} scale={4} blur={2.6} far={2} color="#000000" />
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={1.1}
        target={[0, -0.1, 0]}
      />
    </Canvas>
  )
}

'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  count: number
  /** 0..1 scroll progress through the sequence */
  progress: number
  className?: string
  /** 'vertical' matches “scroll down” and feels like a strand */
  orientation?: 'vertical' | 'horizontal'
}

function Beads({ count, progress, orientation }: { count: number; progress: number; orientation: 'vertical' | 'horizontal' }) {
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const gap = 0.42
    const start = -((count - 1) * gap) / 2

    return new Array(count).fill(0).map((_, i) => {
      const p = start + i * gap
      return orientation === 'vertical' ? new THREE.Vector3(0, p, 0) : new THREE.Vector3(p, 0, 0)
    })
  }, [count, orientation])

  // Smooth highlight progression
  const activeIndex = Math.min(count - 1, Math.max(0, Math.floor(progress * count)))
  const activeT = progress * count - activeIndex

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!group.current) return

    // More dynamic pinned-scroll feel: the strand travels further and has a bit more parallax.
    const travel = 1.35
    group.current.position.y = (progress - 0.5) * travel

    // Add a gentle “dolly” illusion with z, so it feels like the beads move through space.
    group.current.position.z = -0.18 + Math.sin(progress * Math.PI) * 0.22

    // Luxury motion (still restrained, but more noticeable)
    group.current.rotation.z = Math.sin(t * 0.28) * 0.06
    group.current.rotation.y = Math.sin(t * 0.2) * 0.08
  })

  return (
    <group ref={group}>
      {positions.map((pos, i) => {
        const d = Math.abs(i - (progress * (count - 1)))
        const glow = Math.max(0, 1 - d)
        const isActive = i === activeIndex

        // Make the strand read on both light + dark photography.
        const radius = 0.12 + glow * 0.03
        const opacity = 0.32 + glow * 0.62
        const emissiveIntensity = 0.08 + glow * 0.55

        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshPhysicalMaterial
              color={isActive ? '#ddc48a' : '#ffffff'}
              emissive={isActive ? '#b28a3a' : '#0b0b0b'}
              emissiveIntensity={emissiveIntensity}
              metalness={0.35}
              roughness={0.16 + (1 - glow) * 0.55}
              clearcoat={0.9}
              clearcoatRoughness={0.22}
              transmission={0.35}
              thickness={0.6}
              ior={1.35}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}

      {/* “thread” line behind beads */}
      <mesh position={[0, 0, -0.06]} rotation={orientation === 'horizontal' ? [0, 0, Math.PI / 2] : [0, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, (count - 1) * 0.42 + 0.35, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.15} roughness={0.85} transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

export function BeadStrand3D({ count, progress, className, orientation = 'vertical' }: Props) {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0

  return (
    <div className={className} aria-label="Signature beads (3D scroll indicator)">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.15, 2.0], fov: 40 }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.5, 2, 3]} intensity={1.15} color={'#fff2df'} />
        <directionalLight position={[-2.5, -1.5, 2.5]} intensity={0.55} color={'#e7eefc'} />

        <Beads count={count} progress={p} orientation={orientation} />
      </Canvas>
    </div>
  )
}

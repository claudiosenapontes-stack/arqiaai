'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  count: number
  activeIndex: number
  className?: string
  /** 'vertical' matches “scroll down” and feels like a strand */
  orientation?: 'vertical' | 'horizontal'
}

function Beads({ count, activeIndex, orientation }: { count: number; activeIndex: number; orientation: 'vertical' | 'horizontal' }) {
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const gap = 0.42
    const start = -((count - 1) * gap) / 2

    return new Array(count).fill(0).map((_, i) => {
      const p = start + i * gap
      return orientation === 'vertical' ? new THREE.Vector3(0, p, 0) : new THREE.Vector3(p, 0, 0)
    })
  }, [count, orientation])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      // very subtle “luxury” motion — avoid anything that feels like a game UI
      group.current.rotation.z = Math.sin(t * 0.25) * 0.03
      group.current.rotation.y = Math.sin(t * 0.18) * 0.04
    }
  })

  return (
    <group ref={group}>
      {positions.map((pos, i) => {
        const isActive = i === activeIndex
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial
              color={isActive ? '#d8c08a' : '#ffffff'}
              emissive={isActive ? '#8a6b2a' : '#000000'}
              emissiveIntensity={isActive ? 0.25 : 0}
              metalness={isActive ? 0.65 : 0.15}
              roughness={isActive ? 0.22 : 0.7}
              transparent
              opacity={isActive ? 0.95 : 0.25}
            />
          </mesh>
        )
      })}

      {/* “thread” line behind beads */}
      <mesh position={[0, 0, -0.06]} rotation={orientation === 'horizontal' ? [0, 0, Math.PI / 2] : [0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, (count - 1) * 0.42 + 0.35, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

export function BeadStrand3D({ count, activeIndex, className, orientation = 'vertical' }: Props) {
  return (
    <div className={className} aria-label="Signature beads (3D scroll indicator)">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 2.2], fov: 42 }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[2.5, 2, 3]} intensity={0.85} />
        <directionalLight position={[-2.5, -1.5, 2.5]} intensity={0.35} />

        <Beads count={count} activeIndex={activeIndex} orientation={orientation} />
      </Canvas>
    </div>
  )
}

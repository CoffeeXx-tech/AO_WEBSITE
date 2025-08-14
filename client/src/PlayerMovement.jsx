import { useFrame } from '@react-three/fiber'
import { useStore } from './store'

export default function PlayerMovement() {
  const input = useStore((s) => s.input)
  const me = useStore((s) => s.me)
  const players = useStore((s) => s.players)
  const BOOST_MULTIPLIER = useStore((s) => s.BOOST_MULTIPLIER || 2) // domyślnie x2

  useFrame((state, delta) => {
    const p = players.get(me)
    if (!p) return

    let speed = 0.1 // podstawowa prędkość
    if (p.isBoosted) speed *= BOOST_MULTIPLIER

    if (input.left) p.x -= speed
    if (input.right) p.x += speed
    if (input.up) p.z -= speed
    if (input.down) p.z += speed
  })

  return null
}

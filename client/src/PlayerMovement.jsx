import { useFrame } from '@react-three/fiber';
import { useStore } from './store';

export default function PlayerMovement() {
  const input = useStore((s) => s.input);
  const me = useStore((s) => s.me);
  const players = useStore((s) => s.players);
  const setPlayer = useStore((s) => s.setPlayer);
  const BOOST_MULTIPLIER = useStore((s) => s.BOOST_MULTIPLIER);

  useFrame(() => {
    const p = players.get(me);
    if (!p) return;

    let speed = 0.1;
    if (p.isBoosted) speed *= BOOST_MULTIPLIER;

    const newPos = { ...p };
    if (input.left) newPos.x -= speed;
    if (input.right) newPos.x += speed;
    if (input.up) newPos.z -= speed;
    if (input.down) newPos.z += speed;

    setPlayer(me, newPos);
  });

  return null;
}

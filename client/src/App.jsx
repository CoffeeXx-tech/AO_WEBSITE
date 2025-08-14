import { Canvas } from '@react-three/fiber';
import { useStore } from './store';

function Player({ state }) {
  return (
    <mesh position={[state.x, state.y, state.z]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function App() {
  const players = useStore((s) => s.players);

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />

      {[...players.values()].map(player => (
        <Player key={player.id} state={player} />
      ))}
    </Canvas>
  )
}

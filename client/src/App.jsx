// App.jsx
import { Canvas } from '@react-three/fiber';
import { useStore } from './store';

function Player({ state }) {
  return (
    <mesh position={[state.x, state.y + 1, state.z]}> 
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={state.color || 'orange'} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

export default function App() {
  const players = useStore((s) => s.players);

  if (players.size === 0) {
    const defaultPlayer = { id: 'me', x: 0, y: 0, z: 0, color: 'orange' };
    players.set(defaultPlayer.id, defaultPlayer);
  }

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 5, 10], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />

      <Floor />

      {[...players.values()].map((player) => (
        <Player key={player.id} state={player} />
      ))}
    </Canvas>
  );
}


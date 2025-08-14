import { Canvas } from '@react-three/fiber';
import { useStore } from './store';
import { useEffect } from 'react';
import io from 'socket.io-client';

// Socket.io
const socket = io('http://localhost:3001');

function Player({ state }) {
  return (
    <mesh position={[state.x, 0.5, state.z]}>
      <boxGeometry args={[1, 1, 1]} />
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
  const setPlayers = useStore((s) => s.setPlayers);
  const setMe = useStore((s) => s.setMe);

  useEffect(() => {
    socket.on('welcome', ({ id, snapshot }) => {
      setMe(id);
      const updated = snapshot.map((p, index) => ({
        ...p,
        x: index * 2,
        z: 0,
        color: 'orange',
      }));
      setPlayers(updated);
    });

    socket.on('player_joined', ({ id }) => {
      const newPlayer = { id, x: players.size * 2, z: 0, color: 'orange' };
      setPlayers([...players.values(), newPlayer]);
    });

    socket.on('player_left', ({ id }) => {
      const filtered = [...players.values()].filter((p) => p.id !== id);
      setPlayers(filtered);
    });
  }, [players, setPlayers, setMe]);

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh', display: 'block' }}
      camera={{ position: [0, 10, 10], fov: 75 }}
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

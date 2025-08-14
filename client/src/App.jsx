// App.jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useStore } from './store';
import { useEffect } from 'react';
import io from 'socket.io-client';

// --- Socket.io ---
const socket = io('http://localhost:3001'); // Twój serwer

// --- Komponent gracza ---
function Player({ state }) {
  return (
    <mesh position={[state.x, 0.5, state.z]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={state.color || 'orange'} />
    </mesh>
  );
}

// --- Podłoga ---
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

// --- Keyboard Input ---
function KeyboardInput() {
  const setInput = useStore((s) => s.setInput);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = { w: 'up', s: 'down', a: 'left', d: 'right' };
      if (keyMap[e.key]) setInput({ [keyMap[e.key]]: true });
    };
    const handleKeyUp = (e) => {
      const keyMap = { w: 'up', s: 'down', a: 'left', d: 'right' };
      if (keyMap[e.key]) setInput({ [keyMap[e.key]]: false });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setInput]);

  return null;
}

// --- App ---
export default function App() {
  const players = useStore((s) => s.players);
  const setPlayers = useStore((s) => s.setPlayers);
  const me = useStore((s) => s.me);
  const setMe = useStore((s) => s.setMe);

  useEffect(() => {
    socket.on('welcome', ({ id, snapshot }) => {
      setMe(id);

      // ustawiamy pozycje wszystkich graczy
      const updated = snapshot.map((p, index) => ({
        ...p,
        x: index * 2, // każdy kolejny gracz +2 w prawo
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
    <>
      <Canvas camera={{ position: [0, 10, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />

        <Floor />

        {[...players.values()].map((player) => (
          <Player key={player.id} state={player} />
        ))}
      </Canvas>

      <KeyboardInput />
    </>
  );
}

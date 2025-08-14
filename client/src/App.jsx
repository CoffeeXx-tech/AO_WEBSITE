// App.jsx
import { Canvas } from '@react-three/fiber';
import { useStore } from './store';
import PlayerMovement from './PlayerMovement';
import { useEffect } from 'react';

// --- Komponent gracza ---
function Player({ state }) {
  return (
    <mesh position={[state.x, state.y + 1, state.z]}>
      <boxGeometry args={[1, 2, 1]} />
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

// --- Kamera podążająca za graczem ---
function CameraFollow() {
  const players = useStore((s) => s.players);
  const me = useStore((s) => s.me);

  useFrame(({ camera }) => {
    const player = players.get(me);
    if (!player) return;

    camera.position.lerp(
      { x: player.x, y: player.y + 5, z: player.z + 10 },
      0.1
    );
    camera.lookAt(player.x, player.y + 1, player.z);
  });

  return null;
}

// --- App ---
export default function App() {
  const players = useStore((s) => s.players);

  // domyślny gracz jeśli backend jeszcze nie odpowiedział
  if (players.size === 0) {
    const defaultPlayer = { id: 'me', x: 0, y: 0, z: 0, color: 'orange', isBoosted: false };
    players.set(defaultPlayer.id, defaultPlayer);
  }

  return (
    <>
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

        <PlayerMovement />
        <CameraFollow />
      </Canvas>

      <KeyboardInput />
    </>
  );
}


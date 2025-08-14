// App.jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useStore } from './store';
import { useEffect } from 'react';
import PlayerMovement from './PlayerMovement';

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

function KeyboardInput() {
  const setInput = useStore((s) => s.setInput);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const map = { w: 'up', s: 'down', a: 'left', d: 'right', ':':'', 'ArrowUp':'up','ArrowDown':'down','ArrowLeft':'left','ArrowRight':'right',' ': 'jump' };
      if (map[e.key]) setInput({ [map[e.key]]: true });
    };
    const handleKeyUp = (e) => {
      const map = { w: 'up', s: 'down', a: 'left', d: 'right', 'ArrowUp':'up','ArrowDown':'down','ArrowLeft':'left','ArrowRight':'right',' ': 'jump' };
      if (map[e.key]) setInput({ [map[e.key]]: false });
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

export default function App() {
  const players = useStore((s) => s.players);
  const me = useStore((s) => s.me);
  const socket = useStore((s) => s.socket);

  useEffect(() => {
    socket.on('welcome', ({ id, snapshot }) => {
      useStore.getState().setMe(id);
      useStore.getState().setPlayers(snapshot);
    });

    socket.on('player_joined', ({ id }) => {
      useStore.getState().players.set(id, { id, x:0,y:0,z:0 });
    });

    socket.on('player_left', ({ id }) => {
      useStore.getState().players.delete(id);
    });

    socket.on('state', (snapshot) => {
      useStore.getState().setPlayers(snapshot);
    });

    return () => {
      socket.off('welcome');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('state');
    };
  }, [socket]);

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 5, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />

        <Floor />
        {[...players.values()].map((p) => (
          <Player key={p.id} state={p} />
        ))}

        <PlayerMovement />

        <CameraFollowInline players={players} me={me} />
      </Canvas>

      <KeyboardInput />
    </>
  );
}

function CameraFollowInline({ players, me }) {
  useFrame(({ camera }) => {
    const player = players.get(me);
    if (!player) return;
    camera.position.lerp({ x: player.x, y: player.y + 5, z: player.z + 10 }, 0.1);
    camera.lookAt(player.x, player.y + 1, player.z);
  });
  return null;
}

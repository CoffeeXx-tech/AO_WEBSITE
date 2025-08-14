import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useStore } from './store';
import Horse from './Horse';
import KeyboardInput from './KeyboardInput';
import PlayerMovement from './PlayerMovement';
import SpellCharge from './SpellCharge';
import SpellBar from './SpellBar';
import SpellIcon from './SpellIcon';
import SpellUseKey from './SpellUseKey';
import Map from './Map'; // <-- nasza mapa

function CameraFollow() {
  const me = useStore((s) => s.me);
  const players = useStore((s) => s.players);

  useFrame(({ camera }) => {
    const p = players.get(me);
    if (!p) return;
    const offset = new THREE.Vector3(0, 5, -10);
    const targetPosition = new THREE.Vector3(p.x, p.y, p.z).add(
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), p.yaw)
    );
    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(p.x, p.y + 1, p.z);
  });

  return null;
}

export default function App() {
  const players = useStore((s) => s.players);

  return (
    <>
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{ position: [0, 5, -10], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} />
        
        <Map /> {/* tutaj renderujemy mapę */}

        {[...players.values()].map((player) => (
          <Horse
            key={player.id}
            state={player}
            color={player.id === useStore.getState().me ? 'orange' : 'blue'}
          />
        ))}

        <CameraFollow />
        <PlayerMovement />
      </Canvas>

      <KeyboardInput />
      <SpellBar />
      <SpellIcon />
      <SpellCharge />
      <SpellUseKey />
    </>
  );
}

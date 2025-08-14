import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function Map() {
  const { scene } = useGLTF('/models/map/myMap.glb');

  // Możesz ustawić skalę, pozycję, obrót
  return (
    <primitive
      object={scene}
      scale={[50, 50, 50]}   // zmień jak mapa jest za duża/mała
      position={[0, 0, 0]} // przesunięcie mapy
      rotation={[0, 0, 0]} // w radianach (Math.PI = 180 stopni)
    />
  );
}

// Preload pliku, żeby szybciej się wczytywał
useGLTF.preload('/models/map/myMap.glb');

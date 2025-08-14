import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function Player({ player, socket, myId }) {
  const ref = useRef();
  const [pos, setPos] = useState({ x: player.x, y: player.y, z: player.z });

  // ruch tylko dla własnego gracza
  useFrame(() => {
    if (player.id !== myId) {
      ref.current.position.set(player.x, player.y, player.z);
      return;
    }

    const speed = 0.1;
    const keys = {
      ArrowUp: [0, 0, -1],
      ArrowDown: [0, 0, 1],
      ArrowLeft: [-1, 0, 0],
      ArrowRight: [1, 0, 0],
    };

    let moved = false;
    let nx = pos.x;
    let ny = pos.y;
    let nz = pos.z;

    for (let key in keys) {
      if (pressedKeys[key]) {
        nx += keys[key][0] * speed;
        ny += keys[key][1] * speed;
        nz += keys[key][2] * speed;
        moved = true;
      }
    }

    if (moved) {
      setPos({ x: nx, y: ny, z: nz });
      socket.emit("move", { x: nx, y: ny, z: nz });
    }

    ref.current.position.set(nx, ny, nz);
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={player.id === myId ? "orange" : "blue"} />
    </mesh>
  );
}

// globalnie śledzimy wciśnięte klawisze
const pressedKeys = {};
window.addEventListener("keydown", (e) => (pressedKeys[e.key] = true));
window.addEventListener("keyup", (e) => (pressedKeys[e.key] = false));

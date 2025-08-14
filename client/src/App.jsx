import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Player from "./Player";

export default function App() {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    s.on("welcome", ({ id, snapshot }) => {
      setMyId(id);
      setPlayers(snapshot);
    });

    s.on("player_joined", (player) => {
      setPlayers((prev) => [...prev, player]);
    });

    s.on("player_left", (id) => {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    });

    s.on("state", (state) => {
      setPlayers(state);
    });

    return () => s.disconnect();
  }, []);

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {players.map((p) => (
        <Player key={p.id} player={p} socket={socket} myId={myId} />
      ))}
    </Canvas>
  );
}

import { useEffect } from 'react'
import { useStore } from './store'

export default function KeyboardInput() {
  const input = useStore((s) => s.input);
  const setInput = useStore((s) => s.setInput);
  const socket = useStore((s) => s.socket);

  useEffect(() => {
    const down = (e) => {
      switch (e.code) {
        case "ArrowLeft": case "KeyD": setInput({ left: 1 }); break;
        case "ArrowRight": case "KeyA": setInput({ right: 1 }); break;
        case "KeyQ": setInput({ strafeLeft: 1 }); break;
        case "KeyE": setInput({ strafeRight: 1 }); break;
        case "Space": setInput({ jump: true }); break;
        case "ShiftLeft": case "ShiftRight": setInput({ drift: true }); break;
        case "KeyW": setInput({ up: 1 }); break;
        case "KeyS": setInput({ down: 1 }); break;
      }
    }
    const up = (e) => {
      switch (e.code) {
        case "ArrowLeft": case "KeyD": setInput({ left: 0 }); break;
        case "ArrowRight": case "KeyA": setInput({ right: 0 }); break;
        case "KeyQ": setInput({ strafeLeft: 0 }); break;
        case "KeyE": setInput({ strafeRight: 0 }); break;
        case "Space": setInput({ jump: false }); break;
        case "ShiftLeft": case "ShiftRight": setInput({ drift: false }); break;
        case "KeyW": setInput({ up: 0 }); break;
        case "KeyS": setInput({ down: 0 }); break;
      }
    }

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    }
  }, [setInput]);

  useEffect(() => {
    if (!socket) return;
    const id = setInterval(() => socket.emit("input", input), 50);
    return () => clearInterval(id);
  }, [socket, input]);

  return null;
}

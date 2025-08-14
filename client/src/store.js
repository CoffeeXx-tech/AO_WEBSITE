// store.js
import { create } from 'zustand';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // zmień jeśli serwer jest gdzie indziej

export const useStore = create((set, get) => ({
  me: null,
  players: new Map(),
  input: {},
  socket,
  setInput: (input) => {
    set({ input: { ...get().input, ...input } });
    if (get().me) socket.emit('input', input);
  },
  setMe: (id) => set({ me: id }),
  setPlayers: (playersArray) => {
    const map = new Map();
    playersArray.forEach((p) => map.set(p.id, p));
    set({ players: map });
  },
}));

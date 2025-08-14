// store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  me: null,
  players: new Map(),
  input: { up: false, down: false, left: false, right: false },

  setMe: (id) => set({ me: id }),

  setPlayers: (newPlayers) =>
    set(() => {
      const map = new Map();
      newPlayers.forEach((p) => map.set(p.id, p));
      return { players: map };
    }),

  setPlayer: (id, player) =>
    set((state) => {
      const map = new Map(state.players);
      map.set(id, player);
      return { players: map };
    }),

  setInput: (input) =>
    set((state) => ({ input: { ...state.input, ...input } })),
}));

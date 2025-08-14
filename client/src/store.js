import { create } from 'zustand';

export const useStore = create((set) => ({
  me: null,
  players: new Map(),
  input: { up: 0, down: 0, left: 0, right: 0 },
  
  setMe: (id) => set({ me: id }),
  
  setPlayers: (newPlayers) =>
    set((state) => {
      const map = new Map(state.players);
      newPlayers.forEach((p) => map.set(p.id, p));
      return { players: map };
    }),
  
  setPlayer: (id, player) =>
    set((state) => {
      const map = new Map(state.players);
      map.set(id, player);
      return { players: map };
    }),
  
  setInput: (newInput) =>
    set((state) => ({ input: { ...state.input, ...newInput } })),
}));

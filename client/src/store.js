import { create } from 'zustand';

export const useStore = create((set) => ({
  me: null,
  players: new Map(),
  setMe: (id) => set({ me: id }),
  setPlayers: (list) =>
    set(() => {
      const map = new Map();
      list.forEach((p) => map.set(p.id, p));
      return { players: map };
    }),
}));

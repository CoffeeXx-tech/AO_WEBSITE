import { create } from 'zustand';

export const useStore = create((set) => ({
  players: new Map(),
  me: 'me', // domyślny ID gracza
  input: { up: false, down: false, left: false, right: false },
  BOOST_MULTIPLIER: 2,
  setInput: (newInput) => set((state) => ({
    input: { ...state.input, ...newInput }
  })),
  setPlayer: (id, data) => set((state) => {
    const newPlayers = new Map(state.players);
    newPlayers.set(id, { ...newPlayers.get(id), ...data });
    return { players: newPlayers };
  }),
}));

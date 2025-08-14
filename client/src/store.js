// store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  players: new Map(),
}));

import { create } from 'zustand'
import { io } from 'socket.io-client'

export const useStore = create((set, get) => {
  const socket = io('https://ao-website.onrender.com');

  socket.on('welcome', ({ id, snapshot }) => {
    const mePlayer = { id, x:0, y:0, z:0, yaw:0 }
    const allPlayers = new Map([[id, mePlayer]])
    set({ me: id, players: allPlayers })
  })

  socket.on('player_joined', ({ id }) => {
    set(state => {
      const players = new Map(state.players)
      players.set(id, { id, x:0, y:0, z:0, yaw:0 })
      return { players }
    })
  })

  return {
    me: null,
    players: new Map(),
    socket
  }
})

import { create } from 'zustand'
import { io } from 'socket.io-client'

const BOOST_DURATION = 5000; // 5 sekund
const BOOST_MULTIPLIER = 2;  // przyspieszenie x2

export const useStore = create((set, get) => {
  const socket = io('https://ao-website.onrender.com');

  // Obsługa powitania i snapshotu z serwera
  socket.on('welcome', ({ id, snapshot }) => {
    // Twój własny gracz – startowa pozycja y=1 żeby koń był nad ziemią
    const mePlayer = { id, x:0, y:1, z:0, yaw:0, spellPoints:0, currentSpell:null, isBoosted:false }

    // Łączymy snapshot z serwera z własnym graczem
    const allPlayers = new Map([
      [id, mePlayer], // najpierw własny gracz
      ...snapshot.map(p => [p.id, { ...p, spellPoints:0, currentSpell:null, isBoosted:false, y:1 }])
    ])

    set({ me: id, players: allPlayers })
  })

  socket.on('player_joined', ({ id }) => {
    set(state => {
      const players = new Map(state.players)
      players.set(id, { id, x:0, y:1, z:0, yaw:0, spellPoints:0, currentSpell:null, isBoosted:false })
      return { players }
    })
  })

  socket.on('player_left', ({ id }) => {
    set(state => {
      const players = new Map(state.players)
      players.delete(id)
      return { players }
    })
  })

  socket.on('state', (playersArray) => {
    set({ 
      players: new Map(playersArray.map(p => [
        p.id, 
        { ...p, spellPoints: p.spellPoints || 0, currentSpell: p.currentSpell || null, isBoosted: p.isBoosted || false, y: p.y || 1 }
      ])) 
    })
  })

  // Automatyczne ładowanie spellPoints co sekundę (dla siebie)
  setInterval(() => {
    set(state => {
      if (state.spellPoints < 10) {
        const newPoints = state.spellPoints + 1
        let newSpell = state.currentSpell
        if (newPoints >= 10 && !state.currentSpell) {
          const spells = ['boost', 'fog', 'shield']
          newSpell = spells[Math.floor(Math.random() * spells.length)]
        }
        return { spellPoints: Math.min(newPoints, 10), currentSpell: newSpell }
      }
      return {}
    })
  }, 1000)

  // Funkcja aktywująca boost
  const activateBoost = (playerId) => {
    set(state => {
      const players = new Map(state.players)
      const p = players.get(playerId)
      if (!p || state.spellPoints < 10) return { players }

      p.isBoosted = true
      return { players, spellPoints:0, currentSpell:null }
    })

    setTimeout(() => {
      set(state2 => {
        const players2 = new Map(state2.players)
        const p2 = players2.get(get().me)
        if (p2) p2.isBoosted = false
        return { players: players2 }
      })
    }, BOOST_DURATION)
  }

  return {
    me: null,
    players: new Map(),
    input: {},
    spellPoints:0,
    currentSpell:null,
    setInput: (partial) => set(state => ({ input: { ...state.input, ...partial } })),
    setSpellPoints: (points) => set({ spellPoints: points }),
    setCurrentSpell: (spell) => set({ currentSpell: spell }),
    socket,
    activateBoost,
    BOOST_MULTIPLIER
  }
})

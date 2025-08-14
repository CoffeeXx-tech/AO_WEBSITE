import { useStore } from './store'

export default function SpellIcon() {
  const currentSpell = useStore((s) => s.currentSpell)
  if (!currentSpell) return null

  return (
    <div style={{
      position: 'absolute',
      bottom: 50,
      left: 20,
      width: '40px',
      height: '40px',
      backgroundColor: 'yellow',
      textAlign: 'center',
      lineHeight: '40px',
      borderRadius: '5px',
      fontWeight: 'bold'
    }}>
      {currentSpell[0].toUpperCase()}
    </div>
  )
}

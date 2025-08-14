import { useStore } from './store'

export default function SpellBar() {
  const spellCharge = useStore((s) => s.spellCharge)
  const maxCharge = 10

  const percentage = (spellCharge / maxCharge) * 100

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '200px',
      height: '20px',
      backgroundColor: '#444',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '2px solid #222',
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: '#0ff',
        transition: 'width 0.2s',
      }} />
    </div>
  )
}

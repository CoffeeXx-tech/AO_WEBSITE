import { useEffect } from 'react';
import { useStore } from './store';

export default function SpellCharge() {
  useEffect(() => {
    const interval = setInterval(() => {
      useStore.setState(state => {
        // jeśli mamy już zaklęcie, nie zwiększamy punktów
        if (state.currentSpell) return {};

        // zwiększamy punkty dopóki nie osiągną 10
        if (state.spellPoints < 10) {
          return { spellPoints: state.spellPoints + 1 };
        }

        // gdy punkty osiągną 10 i nie mamy zaklęcia – losujemy zaklęcie
        if (state.spellPoints >= 10 && !state.currentSpell) {
          const spells = ['boost', 'fog', 'shield'];
          const spell = spells[Math.floor(Math.random() * spells.length)];
          return { currentSpell: spell };
        }

        return {};
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const spellPoints = useStore(state => state.spellPoints);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      width: '150px',
      height: '20px',
      border: '1px solid white'
    }}>
      <div style={{
        width: `${(spellPoints / 10) * 100}%`,
        height: '100%',
        backgroundColor: 'cyan',
        transition: 'width 1s linear'
      }} />
    </div>
  );
}

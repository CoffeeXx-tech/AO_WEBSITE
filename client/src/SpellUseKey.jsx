import { useEffect } from 'react';
import { useStore } from './store';

export default function SpellUseKey() {
  const activateBoost = useStore(state => state.activateBoost);
  const me = useStore(state => state.me);
  const currentSpell = useStore(state => state.currentSpell);
  const setSpellPoints = useStore(state => state.setSpellPoints);
  const setCurrentSpell = useStore(state => state.setCurrentSpell);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // przykładowy klawisz: spacja
      if (e.code === 'KeyQ' && currentSpell && me) {
        // aktywujemy zaklęcie
        if (currentSpell === 'boost') {
          activateBoost(me);
        }
        // inne zaklęcia można obsłużyć tutaj

        // resetujemy pasek i currentSpell
        setSpellPoints(0);
        setCurrentSpell(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpell, me, activateBoost, setSpellPoints, setCurrentSpell]);

  return null; // komponent nic nie renderuje
}

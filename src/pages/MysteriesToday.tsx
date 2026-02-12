import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { getMysteriesForToday, MYSTERY_SETS, type MysterySetId } from '../data/rosary';
import { prefetchReadings } from '../api/readings';

const SET_NAMES: Record<MysterySetId, string> = {
  joy: 'Joyful',
  sorrow: 'Sorrowful',
  glorious: 'Glorious',
  luminous: 'Luminous',
};

export function MysteriesToday() {
  const todaySet = getMysteriesForToday();
  const mysteries = MYSTERY_SETS[todaySet];

  /* Prefetch readings for all mysteries so they're ready when the user navigates */
  useEffect(() => {
    prefetchReadings(mysteries.map((m) => m.id));
  }, [todaySet]);

  return (
    <div className="mysteries-today">
      <p className="mysteries-today__label">Today's Mysteries</p>
      <h1 className="mysteries-today__heading">{SET_NAMES[todaySet]} Mysteries</h1>

      <div className="mysteries-today__list">
        {mysteries.map((m, i) => (
          <a
            key={m.id}
            href={`/mysteries/${todaySet}?m=${m.number}`}
            className="mysteries-today__card"
            onClick={(e: Event) => {
              e.preventDefault();
              route(`/mysteries/${todaySet}?m=${m.number}`);
            }}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className="mysteries-today__num">{m.number}</span>
            <span className="mysteries-today__name">{m.name}</span>
          </a>
        ))}
      </div>

      <a
        href={`/mysteries/${todaySet}`}
        className="mysteries-today__cta glass-btn"
        onClick={(e: Event) => {
          e.preventDefault();
          route(`/mysteries/${todaySet}`);
        }}
      >
        Begin the First Mystery →
      </a>
    </div>
  );
}

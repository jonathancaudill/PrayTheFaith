import { route } from 'preact-router';
import { getMysteriesForToday, MYSTERY_SETS, type MysterySetId } from '../data/rosary';

const SET_NAMES: Record<MysterySetId, string> = {
  joy: 'Joyful',
  sorrow: 'Sorrowful',
  glorious: 'Glorious',
  luminous: 'Luminous',
};

export function MysteriesToday() {
  const todaySet = getMysteriesForToday();
  const mysteries = MYSTERY_SETS[todaySet];

  return (
    <div className="mysteries-today">
      <p className="mysteries-today__label">{SET_NAMES[todaySet]} Mysteries</p>
      <h1 className="mysteries-today__heading">Today's Mysteries</h1>

      <div className="mysteries-today__list">
        {mysteries.map((m, i) => (
          <a
            key={m.id}
            href={`/mysteries/${todaySet}/${i}`}
            className="mysteries-today__card"
            onClick={(e: Event) => {
              e.preventDefault();
              route(`/mysteries/${todaySet}/${i}`);
            }}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className="mysteries-today__num">{m.number}</span>
            <span className="mysteries-today__name">{m.name}</span>
          </a>
        ))}
      </div>

      <a
        href={`/mysteries/${todaySet}/0`}
        className="mysteries-today__cta glass-btn"
        onClick={(e: Event) => {
          e.preventDefault();
          route(`/mysteries/${todaySet}/0`);
        }}
      >
        Begin the First Mystery →
      </a>
    </div>
  );
}

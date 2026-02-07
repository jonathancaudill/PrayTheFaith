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
    <div className="page-content">
        <h1 className="page-title">Mysteries for today</h1>
        <p className="mysteries-set-label">{SET_NAMES[todaySet]} Mysteries</p>
        <ul className="mysteries-list">
          {mysteries.map((m, i) => (
            <li key={m.id}>
              <a
                href={`/mysteries/${todaySet}/${i}`}
                onClick={(e) => {
                  e.preventDefault();
                  route(`/mysteries/${todaySet}/${i}`);
                }}
              >
                {m.number}. {m.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="swipe-hint glass-btn">
          <a
            href={`/mysteries/${todaySet}/0`}
            onClick={(e) => {
              e.preventDefault();
              route(`/mysteries/${todaySet}/0`);
            }}
          >
            Start with the first mystery →
          </a>
        </p>
      </div>
  );
}

import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { route } from 'preact-router';
import { MYSTERY_SETS, getMysteriesForToday, type MysterySetId } from '../data/rosary';

const API_BASE =
  typeof import.meta.env !== 'undefined' &&
  (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL
    ? (import.meta.env as { VITE_API_URL: string }).VITE_API_URL
    : '';

const SUPABASE_URL = typeof import.meta.env !== 'undefined' ? (import.meta.env as { VITE_SUPABASE_URL?: string }).VITE_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof import.meta.env !== 'undefined' ? (import.meta.env as { VITE_SUPABASE_ANON_KEY?: string }).VITE_SUPABASE_ANON_KEY : '';
const USE_SUPABASE_REST = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const SET_NAMES: Record<MysterySetId, string> = {
  joy: 'Joyful',
  sorrow: 'Sorrowful',
  glorious: 'Glorious',
  luminous: 'Luminous',
};

interface Reading {
  id: string;
  mystery_id: string;
  reference: string;
  text: string;
}

type Props = {
  set?: string;
  index?: string;
};

export function Mystery({ set: setParam, index: indexParam }: Props) {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const pathParts = pathname.split('/').filter(Boolean);
  const setFromUrl = pathParts[1] as MysterySetId | undefined;
  const indexFromUrl = pathParts[2];
  const set = (setParam ?? setFromUrl ?? getMysteriesForToday()) as MysterySetId;
  const index = Math.min(
    Math.max(0, parseInt(indexParam ?? indexFromUrl ?? '0', 10)),
    4,
  );
  const mysteries = MYSTERY_SETS[set] || MYSTERY_SETS[getMysteriesForToday()];
  const mystery = mysteries[index];

  const [readings, setReadings] = useState<Reading[]>([]);
  const [showMeditation, setShowMeditation] = useState(true);
  const [readingIndex, setReadingIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [slideMode, setSlideMode] = useState<'h' | 'v'>('v');

  /* Fetch readings for this mystery */
  useEffect(() => {
    if (!mystery?.id) return;

    const normalize = (raw: unknown[]): Reading[] =>
      raw
        .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
        .map((x) => ({
          id: String(x.id ?? ''),
          mystery_id: String(x.mystery_id ?? ''),
          reference: String(x.reference ?? ''),
          text: String(x.text ?? ''),
        }))
        .filter((x) => x.reference || x.text);

    if (USE_SUPABASE_REST) {
      const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/readings?mystery_id=eq.${encodeURIComponent(mystery.id)}&order=id.asc`;
      fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => (Array.isArray(data) ? normalize(data) : []))
        .then(setReadings)
        .catch(() => setReadings([]));
      return;
    }

    const url = `${API_BASE}/api/readings?mystery_id=${encodeURIComponent(mystery.id)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    fetch(url, { signal: controller.signal })
      .then((r) => {
        clearTimeout(timeoutId);
        if (!r.ok) return r.text().then(() => []);
        return r.json();
      })
      .then((data) => {
        const raw = Array.isArray(data)
          ? data
          : Array.isArray((data as { rows?: unknown[] })?.rows)
            ? (data as { rows: unknown[] }).rows
            : [];
        return normalize(raw);
      })
      .then(setReadings)
      .catch(() => {
        clearTimeout(timeoutId);
        setReadings([]);
      });
  }, [mystery?.id]);

  /* Reset reading state when navigating to a different mystery via link */
  useEffect(() => {
    setShowMeditation(true);
    setReadingIndex(0);
  }, [set, index]);

  const hasReadings = readings.length > 0;
  const currentReading = hasReadings ? readings[readingIndex] : null;
  const totalPages = hasReadings ? 1 + readings.length : 1;
  const currentPage = showMeditation ? 0 : readingIndex + 1;
  const showingMeditation = showMeditation || !hasReadings;
  const showingLastReading =
    hasReadings && !showMeditation && readingIndex === readings.length - 1;

  /* ---- navigation callbacks ---- */

  const goNextMystery = useCallback(() => {
    if (index < mysteries.length - 1) {
      setSlideMode('v');
      setDirection('next');
      setShowMeditation(true);
      setReadingIndex(0);
      route(`/mysteries/${set}/${index + 1}`);
    }
  }, [set, index, mysteries.length]);

  const goPrevMystery = useCallback(() => {
    if (index > 0) {
      setSlideMode('v');
      setDirection('prev');
      setShowMeditation(true);
      setReadingIndex(0);
      route(`/mysteries/${set}/${index - 1}`);
    }
  }, [set, index]);

  const goNextReading = useCallback(() => {
    if (showMeditation && hasReadings) {
      setSlideMode('h');
      setDirection('next');
      setShowMeditation(false);
      setReadingIndex(0);
    } else if (!showMeditation && readingIndex < readings.length - 1) {
      setSlideMode('h');
      setDirection('next');
      setReadingIndex((i) => i + 1);
    }
  }, [showMeditation, hasReadings, readingIndex, readings.length]);

  const goPrevReading = useCallback(() => {
    if (!showMeditation && readingIndex > 0) {
      setSlideMode('h');
      setDirection('prev');
      setReadingIndex((i) => i - 1);
    } else if (!showMeditation && readingIndex === 0) {
      setSlideMode('h');
      setDirection('prev');
      setShowMeditation(true);
    }
  }, [showMeditation, readingIndex]);

  /* ---- hint text ---- */
  let hintText = '';
  if (hasReadings && showingMeditation) {
    hintText = 'readings →';
  } else if (
    index < mysteries.length - 1 &&
    (showingLastReading || !hasReadings)
  ) {
    hintText = 'next mystery ↓';
  }

  const animClass = `mystery-anim mystery-anim--${slideMode}-${direction}`;

  return (
    <>
      <div className="mystery-page">
        <span className="mystery-set-badge">
          {SET_NAMES[set]} · Mystery {mystery.number}
        </span>
        <h1 className="mystery-title">{mystery.name}</h1>

        <div
          key={`${mystery.id}-${showMeditation}-${readingIndex}`}
          className={`mystery-body ${animClass}`}
        >
          {showingMeditation ? (
            <>
              <p className="mystery-meditation">{mystery.meditation}</p>
              {mystery.reflection && (
                <p className="mystery-reflection">{mystery.reflection}</p>
              )}
            </>
          ) : currentReading ? (
            <>
              <p className="mystery-reading-ref">{currentReading.reference}</p>
              <p className="mystery-reading-text">{currentReading.text}</p>
            </>
          ) : null}
        </div>

        {totalPages > 1 && (
          <div className="mystery-dots">
            {Array.from({ length: totalPages }, (_, i) => (
              <span
                key={i}
                className={`mystery-dot${i === currentPage ? ' mystery-dot--active' : ''}`}
              />
            ))}
          </div>
        )}

        {hintText && <p className="mystery-hint glass-btn">{hintText}</p>}
      </div>

      <SwipeListeners
        onSwipeLeft={goNextReading}
        onSwipeRight={goPrevReading}
        onSwipeDown={goNextMystery}
        onSwipeUp={goPrevMystery}
      />
    </>
  );
}

/* ================================================================== */

function SwipeListeners({
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
  onSwipeUp,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeDown: () => void;
  onSwipeUp: () => void;
}) {
  const lastActionTimeRef = useRef(0);
  const CONTENT_ANIMATION_MS = 900;

  /* ---- touch (dominant axis) ---- */
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const min = 50;
    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const handleEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) >= min) {
        if (dx > 0) onSwipeRight();
        else onSwipeLeft();
      } else if (Math.abs(dy) >= min) {
        if (dy > 0) onSwipeDown();
        else onSwipeUp();
      }
    };
    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp]);

  /* ---- keyboard ---- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSwipeDown();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSwipeUp();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSwipeLeft();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSwipeRight();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp]);

  /* ---- wheel (dominant axis) ---- */
  useEffect(() => {
    const WHEEL_THRESHOLD = 20;
    const GESTURE_END_MS = 50;
    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const dx = e.deltaX;
      const dy = e.deltaY;
      const isHorizontal =
        Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) >= WHEEL_THRESHOLD;
      const isVertical =
        Math.abs(dy) > Math.abs(dx) && Math.abs(dy) >= WHEEL_THRESHOLD;
      if (!isHorizontal && !isVertical) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastActionTimeRef.current < CONTENT_ANIMATION_MS) return;
      const gap = lastWheelTime === 0 ? Infinity : now - lastWheelTime;
      lastWheelTime = now;
      if (gap <= GESTURE_END_MS) return;
      lastActionTimeRef.current = now;
      if (isHorizontal) {
        if (dx > 0) onSwipeLeft();
        else onSwipeRight();
      } else {
        if (dy > 0) onSwipeDown();
        else onSwipeUp();
      }
    };
    window.addEventListener('wheel', handleWheel, {
      passive: false,
      capture: true,
    });
    return () => window.removeEventListener('wheel', handleWheel, true);
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp]);

  return null;
}

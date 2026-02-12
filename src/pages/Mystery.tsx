import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { MYSTERY_SETS, getMysteriesForToday, type MysterySetId } from '../data/rosary';
import { fetchReadings, prefetchReadings, type Reading } from '../api/readings';

const SET_NAMES: Record<MysterySetId, string> = {
  joy: 'Joyful',
  sorrow: 'Sorrowful',
  glorious: 'Glorious',
  luminous: 'Luminous',
};

/* m=1 is Mystery 1 (first), m=2 is Mystery 2, etc. */
function getInitialIndex(): number {
  if (typeof window === 'undefined') return 0;
  const params = new URLSearchParams(window.location.search);
  const m = params.get('m');
  const num = Math.min(Math.max(1, parseInt(m ?? '1', 10)), 5);
  return num - 1;
}

function updateMysteryUrl(set: string, index: number): void {
  if (typeof window === 'undefined') return;
  const m = index + 1;
  const url = `/mysteries/${set}?m=${m}`;
  window.history.replaceState(null, '', url);
}

type Props = {
  set?: string;
};

export function Mystery({ set: setParam }: Props) {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const pathParts = pathname.split('/').filter(Boolean);
  const setFromUrl = pathParts[1] as MysterySetId | undefined;
  const set = (setParam ?? setFromUrl ?? getMysteriesForToday()) as MysterySetId;
  const mysteries = MYSTERY_SETS[set] || MYSTERY_SETS[getMysteriesForToday()];

  const [index, setIndex] = useState(getInitialIndex);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showMeditation, setShowMeditation] = useState(true);
  const [readingIndex, setReadingIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [slideMode, setSlideMode] = useState<'h' | 'v'>('v');

  const mystery = mysteries[index];

  /* Fetch readings for this mystery (uses cache if prefetched) */
  useEffect(() => {
    if (!mystery?.id) return;
    fetchReadings(mystery.id).then(setReadings);
  }, [mystery?.id]);

  /* Prefetch readings for all mysteries in the set (faster when navigating) */
  useEffect(() => {
    const ms = MYSTERY_SETS[set] || MYSTERY_SETS[getMysteriesForToday()];
    prefetchReadings(ms.map((m) => m.id));
  }, [set]);

  /* Sync index from URL on popstate (back/forward) */
  useEffect(() => {
    const onPopState = () => setIndex(getInitialIndex());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /* Reset reading state when navigating to a different mystery */
  useEffect(() => {
    setShowMeditation(true);
    setReadingIndex(0);
  }, [index]);

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
      const next = index + 1;
      setSlideMode('v');
      setDirection('next');
      setShowMeditation(true);
      setReadingIndex(0);
      setIndex(next);
      updateMysteryUrl(set, next);
    }
  }, [set, index, mysteries.length]);

  const goPrevMystery = useCallback(() => {
    if (index > 0) {
      const prev = index - 1;
      setSlideMode('v');
      setDirection('prev');
      setShowMeditation(true);
      setReadingIndex(0);
      setIndex(prev);
      updateMysteryUrl(set, prev);
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
  if (
    index < mysteries.length - 1 &&
    (showingMeditation || showingLastReading || !hasReadings)
  ) {
    hintText = 'next mystery ↓';
  }

  const animClass = `mystery-anim mystery-anim--${slideMode}-${direction}`;

  return (
    <>
      <div className="mystery-page">
        <div
          key={`${mystery.id}-${showMeditation}-${readingIndex}`}
          className={`mystery-page__inner ${animClass}`}
        >
          <div className="mystery-page__head">
            <span className="mystery-set-badge">
              {SET_NAMES[set]} · Mystery {mystery.number}
            </span>
            <h1 className="mystery-title">{mystery.name}</h1>
          </div>

          <div className="mystery-page__content">
            <div className="mystery-body">
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
          </div>

          <div className="mystery-page__foot">
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
          </div>
        </div>
        <div className="mystery-hint-slot">
          <p
            className={`mystery-hint mystery-hint--glass mystery-hint--static${index === mysteries.length - 1 ? ' mystery-hint--faded' : ''}`}
            role={index < mysteries.length - 1 ? 'button' : undefined}
            tabIndex={index < mysteries.length - 1 ? 0 : undefined}
            onClick={index < mysteries.length - 1 ? goNextMystery : undefined}
            onKeyDown={
              index < mysteries.length - 1
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goNextMystery();
                    }
                  }
                : undefined
            }
            aria-hidden={index === mysteries.length - 1}
          >
            {(index < mysteries.length - 1 && hintText) || 'next mystery ↓'}
          </p>
        </div>
      </div>

      <SwipeListeners
        onSwipeLeft={goNextReading}
        onSwipeRight={goPrevReading}
        onSwipeUp={goNextMystery}
        onSwipeDown={goPrevMystery}
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

  /* ---- touch (dominant axis, single-swipe lock) ---- */
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const min = 50;
    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const handleEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastActionTimeRef.current < CONTENT_ANIMATION_MS) return;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) >= min) {
        lastActionTimeRef.current = now;
        if (dx > 0) onSwipeRight();
        else onSwipeLeft();
      } else if (Math.abs(dy) >= min) {
        lastActionTimeRef.current = now;
        /* Swipe up = next, swipe down = prev (matches GuidedRosary) */
        if (dy < 0) onSwipeUp();
        else onSwipeDown();
      }
    };
    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp]);

  /* ---- keyboard (ArrowDown=next, ArrowUp=prev; matches GuidedRosary) ---- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSwipeUp();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSwipeDown();
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
        /* Scroll down = next, scroll up = prev (matches GuidedRosary) */
        if (dy > 0) onSwipeUp();
        else onSwipeDown();
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

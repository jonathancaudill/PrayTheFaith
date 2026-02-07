import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { route } from 'preact-router';
import { MYSTERY_SETS, getMysteriesForToday, type MysterySetId } from '../data/rosary';

const API_BASE = typeof import.meta.env !== 'undefined' && (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL
  ? (import.meta.env as { VITE_API_URL: string }).VITE_API_URL
  : '';

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
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pathParts = pathname.split('/').filter(Boolean);
  const setFromUrl = pathParts[1] as MysterySetId | undefined;
  const indexFromUrl = pathParts[2];
  const set = (setParam ?? setFromUrl ?? getMysteriesForToday()) as MysterySetId;
  const index = Math.min(Math.max(0, parseInt(indexParam ?? indexFromUrl ?? '0', 10)), 4);
  const mysteries = MYSTERY_SETS[set] || MYSTERY_SETS[getMysteriesForToday()];
  const mystery = mysteries[index];
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showMeditation, setShowMeditation] = useState(true);
  const [readingIndex, setReadingIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (!mystery?.id) return;
    const url = `${API_BASE}/api/readings?mystery_id=${encodeURIComponent(mystery.id)}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) ? data : [])
      .then(setReadings)
      .catch(() => setReadings([]));
  }, [mystery?.id]);

  const hasReadings = readings.length > 0;
  const currentReading = hasReadings ? readings[readingIndex] : null;

  const goNextMystery = useCallback(() => {
    setDirection('next');
    if (index < mysteries.length - 1) {
      route(`/mysteries/${set}/${index + 1}`);
    }
  }, [set, index, mysteries.length]);

  const goPrevMystery = useCallback(() => {
    setDirection('prev');
    if (index > 0) {
      route(`/mysteries/${set}/${index - 1}`);
    }
  }, [set, index]);

  const goNextReading = useCallback(() => {
    setDirection('next');
    if (showMeditation && hasReadings) {
      setShowMeditation(false);
      setReadingIndex(0);
    } else if (!showMeditation && readingIndex < readings.length - 1) {
      setReadingIndex((i) => i + 1);
    }
  }, [showMeditation, hasReadings, readingIndex, readings.length]);

  const goPrevReading = useCallback(() => {
    setDirection('prev');
    if (!showMeditation && readingIndex > 0) {
      setReadingIndex((i) => i - 1);
    } else if (!showMeditation && readingIndex === 0) {
      setShowMeditation(true);
    }
  }, [showMeditation, readingIndex]);

  const showingMeditation = showMeditation || !hasReadings;
  const showingLastReading = hasReadings && !showMeditation && readingIndex === readings.length - 1;

  return (
    <>
      <div className="page-content mystery-page">
        <h1 className="mystery-title">{mystery.number}. {mystery.name}</h1>
        <div
          key={`${index}-${showMeditation}-${readingIndex}`}
          className={`mystery-content-wrap guided__content guided__content--${direction}`}
        >
          {showingMeditation ? (
            <>
              <p className="guided__title" aria-hidden="true">&nbsp;</p>
              <div className="guided__body">
                <p className="mystery-meditation">{mystery.meditation}</p>
                {mystery.reflection && <p className="mystery-reflection">{mystery.reflection}</p>}
              </div>
            </>
          ) : currentReading ? (
            <>
              <p className="guided__title mystery-reading-ref">{currentReading.reference}</p>
              <p className="guided__body mystery-reading-text">{currentReading.text}</p>
            </>
          ) : null}
        </div>
        <div className="mystery-hints">
          {hasReadings && (
            <p className="swipe-hint glass-btn">
              {showingMeditation
                ? <>swipe or scroll for meditative readings →</>
                : showingLastReading
                  ? <>swipe or scroll for the next mystery ↓</>
                  : <>swipe or scroll for meditative readings →</>}
            </p>
          )}
          {!hasReadings && (
            <p className="swipe-hint glass-btn">swipe or scroll for the next mystery ↓</p>
          )}
        </div>
      </div>
      <SwipeListeners
        onSwipeLeft={goNextReading}
        onSwipeRight={goPrevReading}
        onSwipeDown={goNextMystery}
        onSwipeUp={goPrevMystery}
        horizontalFirst={hasReadings && (showMeditation || !showingLastReading)}
      />
    </>
  );
}

function SwipeListeners({
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
  onSwipeUp,
  horizontalFirst,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeDown: () => void;
  onSwipeUp: () => void;
  horizontalFirst: boolean;
}) {
  /* Same as GuidedRosary: ignore wheel until content animation ends (one flick = one step). */
  const lastActionTimeRef = useRef(0);
  const CONTENT_ANIMATION_MS = 900;

  useEffect(() => {
    let startX = 0, startY = 0;
    const min = 50;
    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const handleEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (horizontalFirst && Math.abs(dx) >= min && Math.abs(dx) >= Math.abs(dy)) {
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
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp, horizontalFirst]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); onSwipeDown(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); onSwipeUp(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); onSwipeLeft(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onSwipeRight(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp]);

  /* Same as GuidedRosary: gap since last wheel (50ms) + lockout for content animation duration. */
  useEffect(() => {
    const WHEEL_THRESHOLD = 20;
    const GESTURE_END_MS = 50;
    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const dx = e.deltaX;
      const dy = e.deltaY;
      const useHorizontal = horizontalFirst && Math.abs(dx) >= WHEEL_THRESHOLD && Math.abs(dx) >= Math.abs(dy);
      const useVertical = Math.abs(dy) >= WHEEL_THRESHOLD;
      if (!useHorizontal && !useVertical) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastActionTimeRef.current < CONTENT_ANIMATION_MS) return;
      const gap = lastWheelTime === 0 ? Infinity : now - lastWheelTime;
      lastWheelTime = now;
      if (gap <= GESTURE_END_MS) return;
      lastActionTimeRef.current = now;
      if (useHorizontal) {
        if (dx > 0) onSwipeLeft();
        else onSwipeRight();
      } else {
        if (dy > 0) onSwipeDown();
        else onSwipeUp();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, true);
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp, horizontalFirst]);

  return null;
}

import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'preact/hooks';
import { buildRosarySteps } from '../data/rosary';

const STEPS = buildRosarySteps();

/** Glory Be has no bead; it shares the last Hail Mary bead. */
const GLORY_BE_STEP_INDICES = [6, 18, 30, 42, 54, 66];

/** Build list of step indices that own a physical bead. */
function buildBeadPositions(): number[] {
  const positions: number[] = [];
  for (let i = 0; i < STEPS.length; i++) {
    if (!GLORY_BE_STEP_INDICES.includes(i)) positions.push(i);
  }
  return positions;
}

const BEAD_POSITIONS = buildBeadPositions();

/** Map step index → bead position index (Glory Be maps to previous bead). */
function stepToPosition(stepIndex: number): number {
  const glory = GLORY_BE_STEP_INDICES.includes(stepIndex);
  const step = glory ? stepIndex - 1 : stepIndex;
  const idx = BEAD_POSITIONS.indexOf(step);
  return idx >= 0 ? idx : 0;
}

/** True after steps where a physical rosary has a chain gap. */
function hasChainGapAfter(stepIndex: number): boolean {
  if (stepIndex < 0) return false;
  if (stepIndex <= 6) return stepIndex === 2 || stepIndex === 5 || stepIndex === 6;
  if (stepIndex === 67) return true;
  const posInBlock = (stepIndex - 7) % 12;
  return posInBlock === 0 || posInBlock === 10 || posInBlock === 11;
}

const HAIL_HOLY_QUEEN_STEP_INDEX = 67;

/* ================================================================== */

export function GuidedRosary() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const currentPosition = stepToPosition(stepIndex);

  /* ---- refs for DOM measurement ---- */
  const viewportRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);

  /* ---- smooth-scroll state ---- */
  const [translateY, setTranslateY] = useState(0);
  const [animated, setAnimated] = useState(false);

  /* ---- navigation direction (drives text animation) ---- */
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  /* ---- navigation ---- */
  const goNext = useCallback(() => {
    setDirection('next');
    setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
  }, []);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setStepIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  /* ---- measure & centre the current bead (before paint) ---- */
  useLayoutEffect(() => {
    const chain = chainRef.current;
    const viewport = viewportRef.current;
    if (!chain || !viewport) return;

    const bead = chain.querySelector(
      `[data-pos="${currentPosition}"]`,
    ) as HTMLElement | null;
    if (!bead) return;

    const vpH = viewport.clientHeight;
    const beadCenter = bead.offsetTop + bead.offsetHeight / 2;
    setTranslateY(vpH / 2 - beadCenter);
  }, [currentPosition]);

  /* ---- enable CSS transition after first paint ---- */
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ---- keyboard ---- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  /* ---- touch / swipe (vertical + horizontal) ---- */
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
      /* Use the dominant axis */
      if (Math.abs(dx) > Math.abs(dy)) {
        /* Horizontal swipe: left = next, right = prev */
        if (dx < -min) goNext();
        if (dx > min) goPrev();
      } else {
        /* Vertical swipe: up = next, down = prev */
        if (dy < -min) goNext();
        if (dy > min) goPrev();
      }
    };
    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [goNext, goPrev]);

  /* ---- mouse wheel: timeout starts after previous wheel event ends; lasts GESTURE_END_MS; then next wheel can trigger a step ---- */
  useEffect(() => {
    const WHEEL_THRESHOLD = 20;
    const GESTURE_END_MS = 50;
    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      const now = Date.now();
      const gap = lastWheelTime === 0 ? Infinity : now - lastWheelTime;
      lastWheelTime = now;
      if (gap <= GESTURE_END_MS) return;
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, true);
  }, [goNext, goPrev]);

  /* ---- chain transition style ---- */
  const chainStyle = animated
    ? { transform: `translateY(${translateY}px)` }
    : { transform: `translateY(${translateY}px)`, transition: 'none' };

  /* ---- render ---- */
  return (
    <>
      <div className="guided">
        {/* ---------- bead column ---------- */}
        <div className="guided__bead-viewport" ref={viewportRef}>
          {/* Scrollable bead chain (clipped + masked) */}
          <div className="guided__bead-scroll">
            <div
              className="guided__bead-chain"
              ref={chainRef}
              style={chainStyle}
            >
              {BEAD_POSITIONS.map((stepIdx, pos) => {
                const isCurrent = pos === currentPosition;
                const afterChain = hasChainGapAfter(stepIdx);

                /* crucifix (first bead) */
                if (stepIdx === 0) {
                  return (
                    <div
                      key={pos}
                      data-pos={pos}
                      className={
                        'guided__crucifix' +
                        (isCurrent ? ' guided__crucifix--current' : '') +
                        (afterChain ? ' guided__bead--after-chain' : '')
                      }
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 24 32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2v28M8 6h8M6 10h12M12 10v12" />
                        <circle cx="12" cy="22" r="2.5" />
                      </svg>
                    </div>
                  );
                }

                /* shield (Hail Holy Queen) */
                if (stepIdx === HAIL_HOLY_QUEEN_STEP_INDEX) {
                  return (
                    <div
                      key={pos}
                      data-pos={pos}
                      className={
                        'guided__shield' +
                        (isCurrent ? ' guided__shield--current' : '') +
                        (afterChain ? ' guided__bead--after-chain' : '')
                      }
                      aria-hidden
                    />
                  );
                }

                /* regular bead */
                return (
                  <div
                    key={pos}
                    data-pos={pos}
                    className={
                      'guided__bead' +
                      (isCurrent ? ' guided__bead--current' : '') +
                      (afterChain ? ' guided__bead--after-chain' : '')
                    }
                    aria-hidden
                  />
                );
              })}
            </div>
          </div>

          {/* Liquid glass lens (CSS backdrop-filter — tracks live bead positions) */}
          <div className="glass-lens" aria-hidden />
        </div>

        {/* ---------- prayer content ---------- */}
        <div className={`guided__content guided__content--${direction} page-content`} key={stepIndex}>
          <h2 className="guided__title">{step.title}</h2>
          <p className="guided__body">{step.body}</p>
          {(step.title === 'Hail Mary' ||
            step.title === 'Our Father' ||
            step.title === 'Glory Be') && (
            <p className="guided__amen">Amen.</p>
          )}
        </div>
      </div>

      <p
        className="guided__swipe glass-btn"
        role="button"
        tabIndex={0}
        onClick={goNext}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goNext(); } }}
        aria-label="Next prayer"
      >
        swipe
        <span className="guided__swipe-arrow">↓</span>
      </p>
      <button
        type="button"
        className="guided__next-btn"
        onClick={goNext}
        aria-label="Next prayer"
      />
    </>
  );
}

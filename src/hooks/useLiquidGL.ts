/**
 * useLiquidGL – Preact hook for initialising liquidGL on DOM elements.
 *
 * Handles SPA concerns:
 *  - Deduplication: tracks which elements already have a lens (via WeakSet)
 *  - Pointer-events: restores interactivity on clickable elements
 *  - Timing: waits for the next frame so the DOM is painted before snapshot
 */

import { useEffect } from 'preact/hooks';

/* Track elements that already have a liquidGL lens attached */
const _processed = new WeakSet<Element>();

/* Counter for unique temporary class names */
let _uid = 0;

/**
 * Initialise liquidGL on elements matching `selector`.
 * Safe to call repeatedly — already-processed elements are skipped.
 *
 * @param interactive  If true, restores pointer-events on the target
 *                     elements so they remain clickable (buttons, links).
 */
export function initLiquidGL(
  selector: string,
  options: Partial<LiquidGLOptions> = {},
  interactive = false,
) {
  if (typeof window === 'undefined' || typeof window.liquidGL !== 'function') return;

  const all = document.querySelectorAll(selector);
  const fresh: Element[] = [];

  all.forEach((el) => {
    if (!_processed.has(el)) {
      fresh.push(el);
      _processed.add(el);
    }
  });

  if (fresh.length === 0) return;

  /* Add a one-time class so liquidGL only targets the new elements */
  const cls = `_lgl_${++_uid}`;
  fresh.forEach((el) => el.classList.add(cls));

  const result = window.liquidGL({ ...options, target: `.${cls}` });

  /* Clean up the temporary class */
  fresh.forEach((el) => el.classList.remove(cls));

  /* Restore critical styles for interactive elements.
     liquidGL sets opacity:0, background:transparent, pointer-events:none,
     and transition:none on every target.  With reveal:'none' the library
     never restores the transition itself, breaking hover animations.
     Undo all of that so text stays visible, buttons remain clickable,
     and hover/active transitions animate smoothly. */
  if (interactive) {
    fresh.forEach((el) => {
      const s = (el as HTMLElement).style;
      s.pointerEvents = '';
      s.opacity = '';
      s.background = '';
      s.transition = '';
    });
  }

  return result;
}

/**
 * Force the liquidGL renderer to retake its page snapshot.
 * Call after the DOM has painted new content (e.g. after a route change)
 * so glass elements refract the current page instead of a stale texture.
 */
export function refreshSnapshot() {
  window.__liquidGLRenderer__?.captureSnapshot?.();
}

/**
 * Preact hook — calls `initLiquidGL` after mount (in a rAF so the DOM
 * has painted and html2canvas can capture content).
 *
 * @param selector   CSS selector for the target element(s).
 * @param options    liquidGL options (target is overridden by selector).
 * @param interactive  Restore pointer-events for clickable elements.
 * @param deps       Extra dependency array values that trigger re-init
 *                   (e.g. route path, open state).
 */
export function useLiquidGL(
  selector: string,
  options: Partial<LiquidGLOptions> = {},
  interactive = false,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      initLiquidGL(selector, options, interactive);

      /* After every dep change (typically a route navigation) the page
         content is different, so retake the background snapshot.  This
         prevents glass elements from showing the previous page. */
      refreshSnapshot();
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...deps]);
}

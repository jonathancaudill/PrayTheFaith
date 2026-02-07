import { useMemo, useRef, useEffect } from 'preact/hooks';
import { generateLensAssets, type LensAssets } from '../utils/liquidGlass';

/**
 * Pixel diameter of the glass lens overlay.
 * Keep in sync with .glass-lens width/height in index.css.
 */
export const LENS_DIAMETER = 32;

const FILTER_ID = 'ptf-liquid-glass';

/**
 * True in Chromium-based browsers that support SVG filters as
 * backdrop-filter (Chrome, Edge, Opera — not Firefox or Safari).
 */
const supportsBackdropSvgFilter =
  typeof navigator !== 'undefined' &&
  /Chrome|Chromium/.test(navigator.userAgent) &&
  !/Firefox/.test(navigator.userAgent);

/* ------------------------------------------------------------------ */
/*  Singleton asset cache (generated once across all mounts)           */
/* ------------------------------------------------------------------ */

let _assets: LensAssets | null = null;
function getAssets(): LensAssets {
  if (!_assets) _assets = generateLensAssets(LENS_DIAMETER);
  return _assets;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function LiquidGlassLens() {
  const assets = useMemo(getAssets, []);
  const svgRef = useRef<SVGSVGElement>(null);

  // Set the hyphenated SVG attribute that JSX cannot express directly
  useEffect(() => {
    svgRef.current?.setAttribute('color-interpolation-filters', 'sRGB');
  }, []);

  return (
    <>
      {/* Hidden SVG filter definition (Chromium only) */}
      {supportsBackdropSvgFilter && (
        <svg
          ref={svgRef}
          width="0"
          height="0"
          style="position:absolute;pointer-events:none"
        >
          <defs>
            <filter id={FILTER_ID}>
              <feImage
                href={assets.displacementDataUrl}
                x="0"
                y="0"
                width={LENS_DIAMETER}
                height={LENS_DIAMETER}
                result="dmap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="dmap"
                scale={assets.filterScale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
              />
              <feGaussianBlur
                in="refracted"
                stdDeviation="0.35"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Glass lens overlay */}
      <div
        className={`glass-lens${supportsBackdropSvgFilter ? ' glass-lens--chromium' : ''}`}
        aria-hidden
      />
    </>
  );
}

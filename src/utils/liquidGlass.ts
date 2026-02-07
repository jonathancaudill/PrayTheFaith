/**
 * Liquid-glass lens asset generation.
 *
 * Produces a circular SVG displacement map (convex-squircle refraction via
 * Snell's law) and a CSS-friendly specular highlight, both as PNG data URLs.
 *
 * Call once per lens size; results are cheap to cache.
 */

/* ------------------------------------------------------------------ */
/*  Surface function                                                   */
/* ------------------------------------------------------------------ */

/** Convex squircle: y = (1 − (1−t)⁴)^¼,  t ∈ [0, 1] */
function squircle(t: number): number {
  const u = 1 - Math.max(0, Math.min(1, t));
  return Math.pow(Math.max(0, 1 - u * u * u * u), 0.25);
}

/* ------------------------------------------------------------------ */
/*  Refraction profile along one bezel radius                         */
/* ------------------------------------------------------------------ */

const NUM_SAMPLES = 127;

/**
 * Walk 127 samples along a single bezel radius and compute the lateral
 * pixel displacement caused by Snell-law refraction through the convex
 * squircle surface.
 */
function computeProfile(
  thickness: number,
  n2: number,
): { normalised: Float64Array; maxPx: number } {
  const raw = new Float64Array(NUM_SAMPLES);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = (i + 0.5) / NUM_SAMPLES; // 0 = border, 1 = flat centre

    // Numerical derivative of the surface function
    const dt = 0.0005;
    const slope =
      (squircle(Math.min(1, t + dt)) - squircle(Math.max(0, t - dt))) /
      (2 * dt);

    // Surface-normal length;  cos θ₁ = 1/nLen,  sin θ₁ = |slope|/nLen
    const nLen = Math.hypot(slope, 1);
    const sinT1 = Math.abs(slope) / nLen;

    // Snell's law (n1 = 1 for air)
    const sinT2 = sinT1 / n2;
    if (sinT2 >= 1) {
      raw[i] = 0;
      continue;
    }

    const t1 = Math.asin(Math.min(1, sinT1));
    const t2 = Math.asin(sinT2);
    raw[i] = Math.abs(squircle(t) * thickness * Math.tan(t1 - t2));
  }

  const maxPx = raw.reduce((a, b) => Math.max(a, b), 0.001);
  const normalised = new Float64Array(NUM_SAMPLES);
  for (let i = 0; i < NUM_SAMPLES; i++) normalised[i] = raw[i] / maxPx;

  return { normalised, maxPx };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface LensAssets {
  /** PNG data-URL encoding the displacement vector field (R=X, G=Y). */
  displacementDataUrl: string;
  /** Value for the SVG feDisplacementMap `scale` attribute. */
  filterScale: number;
}

/**
 * Generate a displacement-map data-URL PNG for a circular liquid-glass
 * lens of the given pixel diameter.
 */
export function generateLensAssets(
  diameter: number,
  opts: {
    bezelRatio?: number;
    thickness?: number;
    refractiveIndex?: number;
  } = {},
): LensAssets {
  const {
    bezelRatio = 0.45,
    thickness = 3.5,
    refractiveIndex = 1.5,
  } = opts;

  const R = diameter / 2;
  const bezel = R * bezelRatio;
  const { normalised, maxPx } = computeProfile(thickness, refractiveIndex);

  /* ---------- displacement map ---------- */
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = diameter;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(diameter, diameter);
  const d = img.data;

  for (let py = 0; py < diameter; py++) {
    for (let px = 0; px < diameter; px++) {
      const o = (py * diameter + px) * 4;
      const cx = px - R + 0.5;
      const cy = py - R + 0.5;
      const dist = Math.hypot(cx, cy);

      // Outside circle or in the flat centre → neutral (no displacement)
      if (dist >= R || R - dist >= bezel) {
        d[o] = d[o + 1] = d[o + 2] = 128;
        d[o + 3] = 255;
        continue;
      }

      const t = (R - dist) / bezel;
      const si = Math.min(NUM_SAMPLES - 1, Math.floor(t * NUM_SAMPLES));
      const mag = normalised[si];

      // Direction: outward from centre.  feDisplacementMap subtracts, so a
      // channel value > 128 causes sampling from the opposite side → inward
      // pull.  This is the correct behaviour for a convex lens.
      const a = Math.atan2(cy, cx);
      d[o]     = Math.round(128 + Math.cos(a) * mag * 127);
      d[o + 1] = Math.round(128 + Math.sin(a) * mag * 127);
      d[o + 2] = 128;
      d[o + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);

  return {
    displacementDataUrl: canvas.toDataURL('image/png'),
    // feDisplacementMap maps channel 0 → −scale/2, 128 → 0, 255 → +scale/2.
    // Our max channel offset from 128 is 127, so to reach maxPx displacement:
    //   scale × 127/255 = maxPx  →  scale = maxPx × 255/127
    filterScale: maxPx * (255 / 127),
  };
}

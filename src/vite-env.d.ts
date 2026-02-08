/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* ------------------------------------------------------------------ */
/*  liquidGL – global type declarations                                */
/* ------------------------------------------------------------------ */

interface LiquidGLOptions {
  target: string;
  snapshot?: string;
  resolution?: number;
  refraction?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: 'none' | 'fade';
  tilt?: boolean;
  tiltFactor?: number;
  magnify?: number;
  on?: {
    init?: (lens: LiquidGLLens) => void;
  };
}

interface LiquidGLLens {
  el: HTMLElement;
  options: LiquidGLOptions;
  rectPx: { left: number; top: number; width: number; height: number } | null;
  setShadow(enabled: boolean): void;
  setTilt(enabled: boolean): void;
  updateMetrics(): void;
}

interface LiquidGLStatic {
  (options?: Partial<LiquidGLOptions>): LiquidGLLens | LiquidGLLens[] | undefined;
  registerDynamic(elements: string | Element[] | NodeListOf<Element>): void;
  syncWith(config?: object): object;
}

interface Window {
  liquidGL: LiquidGLStatic;
  __liquidGLRenderer__?: {
    captureSnapshot?: () => void;
    addDynamicElement?: (el: string | Element[] | NodeListOf<Element>) => void;
    render?: () => void;
  };
}

declare function html2canvas(
  element: HTMLElement,
  options?: object,
): Promise<HTMLCanvasElement>;

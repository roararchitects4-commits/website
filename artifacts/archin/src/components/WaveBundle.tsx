import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { smoothPathThrough } from './AnimatedLines';

interface WaveBundleProps {
  /** `edge` anchors to a side of the section and dissolves inward; `gutter`
   * fills a column gap and dissolves at both ends. */
  variant?: 'edge' | 'gutter';
  /** Which side to anchor to — `edge` only. */
  side?: 'left' | 'right';
  /** Which end butts hard against a divider rule — `gutter` only. The opposite
   * end fades out. */
  stopAt?: 'left' | 'right';
  className?: string;
  /** Seconds before the draw-in reveal starts. */
  revealDelay?: number;
}

const LINE_COUNT = 9; // ripples stacked per bundle
const SPACING = 10; // px between adjacent ripples
const AMPLITUDE_RATIO = 0.3; // peak deviation, as a fraction of line spacing
const PERIODS = 1; // full ripples across the bundle's width
const PHASE_DRIFT = 0.3; // radians per line — tilts the crests slightly
const SAMPLES = 32;

function wavePath(index: number, width: number, height: number, phase: number): string {
  // Centre the stack in its box rather than hanging it off the top edge.
  const top = (height - LINE_COUNT * SPACING) / 2;
  const baseline = top + (index + 0.5) * SPACING;
  const amp = SPACING * AMPLITUDE_RATIO;
  const linePhase = phase + index * PHASE_DRIFT;

  const points = Array.from({ length: SAMPLES + 1 }, (_, s) => {
    const t = s / SAMPLES;

    return {
      x: t * width,
      y: baseline + amp * Math.sin(t * PERIODS * Math.PI * 2 + linePhase),
    };
  });

  return smoothPathThrough(points);
}

/** A bundle of thin, closely-stacked ripples — the contour-map motif that frames
 * the section and separates its columns. */
export function WaveBundle({
  variant = 'edge',
  side = 'left',
  stopAt = 'right',
  className = '',
  revealDelay = 0,
}: WaveBundleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const maskId = useId();
  const fadeId = useId();
  // Observed on the wrapper, not per-path: an IntersectionObserver on an SVG
  // path can sit at zero area before its `d` is generated and never fire.
  const inView = useInView(containerRef, { once: true, amount: 0.2 });

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const count = size.height > 0 && size.width > 0 ? LINE_COUNT : 0;

  useEffect(() => {
    if (!count) return;

    let frame: number;
    const startedAt = performance.now();

    const render = (now: number) => {
      // One very slow undulation so the ripples breathe without ever drifting
      // out of their bundle.
      const phase = ((now - startedAt) / 14000) * Math.PI * 2;
      const paths = svgRef.current?.querySelectorAll('path');

      paths?.forEach((path, i) => {
        path.setAttribute('d', wavePath(i, size.width, size.height, phase));
      });

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frame);
  }, [count, size.width, size.height]);

  const isGutter = variant === 'gutter';

  const layout = isGutter
    ? 'relative self-stretch'
    : `absolute inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'}`;

  // An edge bundle may only use the margin left over beside the centred grid,
  // so it can never reach under the photo or the bio copy.
  const edgeStyle: React.CSSProperties = {
    width: 'min(17.6%, max(0px, calc((100% - var(--content-max)) / 2)))',
    ...(side === 'right' ? { transform: 'scaleX(-1)' } : {}),
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${layout} ${className}`}
      style={isGutter ? undefined : edgeStyle}
    >
      <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
            {isGutter ? (
              /* Stops dead against the divider rule the bundle is trimmed to
                 meet, and fades out at the opposite end. */
              stopAt === 'right' ? (
                <>
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="10%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="90%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </>
              )
            ) : (
              <>
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="85%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </>
            )}
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${fadeId})`} />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {Array.from({ length: count }, (_, i) => (
            <motion.path
              key={i}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.85 } : undefined}
              transition={{
                duration: 1.4,
                delay: revealDelay + i * 0.06,
                ease: 'easeInOut',
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface LineDef {
  start?: [number, number];
  cp1?: [number, number];
  cp2?: [number, number];
  end?: [number, number];
  /** Alternative to start/cp1/cp2/end: a series of normalized waypoints smoothed
   * into a multi-segment Catmull-Rom curve — produces a flowing, multi-wave line
   * instead of a single Bezier arc. */
  points?: [number, number][];
}

interface AnimatedLinesProps {
  className?: string;
  lines?: LineDef[];
  /** When set, lines stay hidden and draw themselves in on scroll after this delay (seconds) instead of always being visible. */
  revealDelay?: number;
  /** When true, lines draw themselves progressively as the user scrolls through this section, instead of a timed reveal. */
  scrollDraw?: boolean;
  /** When true, the scroll-based line offset is measured from this section's own position instead of the page's total scroll — keeps the offset small for sections far down the page. */
  localScrollOffset?: boolean;
  /** How far the cursor pulls the control points, as a fraction of the SVG box.
   * Lower it where the curves have to thread past copy — at the 0.15 default a
   * curve can wander far enough to run straight through a text block. */
  drift?: number;
  /** Stroke opacity the curves settle at once drawn. The accent is a saturated
   * red, so over a white ground it carries far more weight than its opacity
   * suggests — lower this where the lines run behind copy and would otherwise
   * compete with it. */
  strokeOpacity?: number;
  /** `scrollDraw` only. The scroll window progress is measured across. The
   * default starts counting the moment the section's top edge appears at the
   * bottom of the viewport, which suits a section around a screen tall. For one
   * several screens tall that window is mostly spent before the section is
   * really in view, so the drawing is over by the time there is anything to
   * watch — measure from `start start` there instead, which counts from the
   * point the section reaches the top of the screen and so tracks scrolling
   * *through* it. */
  drawOffset?: ScrollDrawOffset;
  /** `scrollDraw` only. How much of that window a line takes to draw itself, as
   * a fraction. Raise it to keep the drawing going deeper into the section. */
  drawSpan?: number;
  /** `scrollDraw` only. Shapes the draw against scroll instead of running it
   * flat: pass an ease-in and the curve hangs back through the body of the
   * section then runs away with itself at the end. Omit for a linear draw, one
   * unit of line per unit of scroll. */
  drawEase?: (t: number) => number;
}

/** Smooths a series of points into a multi-segment cubic-Bezier path (uniform
 * Catmull-Rom) so a line can flow through several waypoints — rather than the
 * single hump a lone `M ... C ...` segment produces — while staying C1-continuous. */
export function smoothPathThrough(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  let d = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return d;
}

/** Derived from `useScroll` itself so the offset stays in step with whatever
 * shape the library expects. */
type ScrollDrawOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

function ScrollDrawnPath({
  containerRef,
  index,
  strokeOpacity,
  drawSpan,
  drawOffset,
  drawEase,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  strokeOpacity: number;
  drawSpan: number;
  drawOffset: ScrollDrawOffset;
  drawEase?: (t: number) => number;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: drawOffset,
  });

  const start = index * 0.045;
  const pathLength = useTransform(
    scrollYProgress,
    [start, start + drawSpan],
    [0, 1],
    drawEase ? { ease: drawEase } : undefined,
  );
  const opacity = useTransform(scrollYProgress, [start, start + 0.08], [0, strokeOpacity]);

  return (
    <motion.path
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="3"
      style={{ pathLength, opacity }}
    />
  );
}

export function AnimatedLines({ className = '', lines = [], revealDelay, scrollDraw, localScrollOffset = false, drift = 0.15, strokeOpacity = 0.6, drawOffset = ['start end', 'end start'], drawSpan = 0.5, drawEase }: AnimatedLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default lines if none provided: sweeping architectural curves
  const defaultLines: LineDef[] = lines.length > 0 ? lines : [
    { start: [-0.2, 1.2], cp1: [0.4, 1.1], cp2: [0.6, -0.1], end: [1.2, -0.2] },
    { start: [1.2, 0.8], cp1: [0.5, 0.9], cp2: [0.2, 0.1], end: [-0.2, 0.4] }
  ];

  useEffect(() => {
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      if (svgRef.current) {
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        // How far this section itself has scrolled through the viewport (not the
        // page's total scroll), so the offset stays small regardless of how far
        // down the page the section sits — otherwise lines in sections further
        // down the page drift far enough to spill past their intended bounds.
        const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
        const localScroll = Math.max(0, -containerTop);
        const scrollBasis = localScrollOffset ? localScroll : window.scrollY;

        const paths = svgRef.current.querySelectorAll('path');

        defaultLines.forEach((line, i) => {
          if (!paths[i]) return;

          const scrollOffset = scrollBasis * 0.05 * (i % 2 === 0 ? 1 : -1);

          if (line.points && line.points.length >= 2) {
            // Multi-waypoint smooth curve: perturb interior points only (edges
            // stay anchored) so the cursor makes the whole ribbon undulate
            // rather than just tugging a single control point.
            const offsetX = (mouseX - 0.5) * width * 0.06;
            const offsetY = (mouseY - 0.5) * height * 0.06;

            const pts = line.points.map(([nx, ny], j) => {
              const isEdge = j === 0 || j === line.points!.length - 1;
              const sign = j % 2 === 0 ? 1 : -1;

              return {
                x: nx * width + (isEdge ? 0 : sign * offsetX),
                y: ny * height + scrollOffset + (isEdge ? 0 : sign * offsetY),
              };
            });

            paths[i].setAttribute('d', smoothPathThrough(pts));
            return;
          }

          // Legacy single-arc mode
          const offsetX = (mouseX - 0.5) * width * drift;
          const offsetY = (mouseY - 0.5) * height * drift;

          const p = {
            x1: line.start![0] * width,
            y1: line.start![1] * height + scrollOffset,
            cx1: line.cp1![0] * width + offsetX,
            cy1: line.cp1![1] * height + offsetY + scrollOffset,
            cx2: line.cp2![0] * width - offsetX,
            cy2: line.cp2![1] * height - offsetY + scrollOffset,
            x2: line.end![0] * width,
            y2: line.end![1] * height + scrollOffset,
          };

          paths[i].setAttribute(
            'd',
            `M ${p.x1},${p.y1} C ${p.cx1},${p.cy1} ${p.cx2},${p.cy2} ${p.x2},${p.y2}`
          );
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [defaultLines, drift, localScrollOffset]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {defaultLines.map((_, i) => {
          if (scrollDraw) {
            return (
              <ScrollDrawnPath
                key={i}
                containerRef={containerRef}
                index={i}
                strokeOpacity={strokeOpacity}
                drawOffset={drawOffset}
                drawSpan={drawSpan}
                drawEase={drawEase}
              />
            );
          }
          if (revealDelay !== undefined) {
            return (
              <motion.path
                key={i}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: strokeOpacity }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 1.6, delay: revealDelay + i * 0.15, ease: 'easeInOut' }}
              />
            );
          }
          return (
            <path
              key={i}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              style={{ opacity: strokeOpacity }}
            />
          );
        })}
      </svg>
    </div>
  );
}

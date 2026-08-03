import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedLinesProps {
  className?: string;
  lines?: {
    start: [number, number];
    cp1: [number, number];
    cp2: [number, number];
    end: [number, number];
  }[];
  /** When set, lines stay hidden and draw themselves in on scroll after this delay (seconds) instead of always being visible. */
  revealDelay?: number;
  /** When true, lines draw themselves progressively as the user scrolls through this section, instead of a timed reveal. */
  scrollDraw?: boolean;
  /** When true, the scroll-based line offset is measured from this section's own position instead of the page's total scroll — keeps the offset small for sections far down the page. */
  localScrollOffset?: boolean;
}

function ScrollDrawnPath({ containerRef, index }: { containerRef: React.RefObject<HTMLDivElement | null>; index: number }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const start = index * 0.045;
  const pathLength = useTransform(scrollYProgress, [start, start + 0.5], [0, 1]);
  const opacity = useTransform(scrollYProgress, [start, start + 0.08], [0, 0.6]);

  return (
    <motion.path
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="3"
      style={{ pathLength, opacity }}
    />
  );
}

export function AnimatedLines({ className = '', lines = [], revealDelay, scrollDraw, localScrollOffset = false }: AnimatedLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default lines if none provided: sweeping architectural curves
  const defaultLines = lines.length > 0 ? lines : [
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
          if (paths[i]) {
            // Apply offset based on mouse position and scroll position
            const offsetX = (mouseX - 0.5) * width * 0.15;
            const offsetY = (mouseY - 0.5) * height * 0.15;
            const scrollOffset = scrollBasis * 0.05 * (i % 2 === 0 ? 1 : -1);

            const p = {
              x1: line.start[0] * width,
              y1: line.start[1] * height + scrollOffset,
              cx1: line.cp1[0] * width + offsetX,
              cy1: line.cp1[1] * height + offsetY + scrollOffset,
              cx2: line.cp2[0] * width - offsetX,
              cy2: line.cp2[1] * height - offsetY + scrollOffset,
              x2: line.end[0] * width,
              y2: line.end[1] * height + scrollOffset,
            };

            paths[i].setAttribute(
              'd',
              `M ${p.x1},${p.y1} C ${p.cx1},${p.cy1} ${p.cx2},${p.cy2} ${p.x2},${p.y2}`
            );
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [defaultLines]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {defaultLines.map((_, i) => {
          if (scrollDraw) {
            return <ScrollDrawnPath key={i} containerRef={containerRef} index={i} />;
          }
          if (revealDelay !== undefined) {
            return (
              <motion.path
                key={i}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
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
              className="opacity-60"
            />
          );
        })}
      </svg>
    </div>
  );
}

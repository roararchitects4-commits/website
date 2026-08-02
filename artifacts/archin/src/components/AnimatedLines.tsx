import React, { useEffect, useRef } from 'react';

interface AnimatedLinesProps {
  className?: string;
  lines?: {
    start: [number, number];
    cp1: [number, number];
    cp2: [number, number];
    end: [number, number];
  }[];
}

export function AnimatedLines({ className = '', lines = [] }: AnimatedLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
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
      
      const scrollY = window.scrollY;
      
      if (svgRef.current) {
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        
        const paths = svgRef.current.querySelectorAll('path');
        
        defaultLines.forEach((line, i) => {
          if (paths[i]) {
            // Apply offset based on mouse position and scroll position
            const offsetX = (mouseX - 0.5) * width * 0.15;
            const offsetY = (mouseY - 0.5) * height * 0.15;
            const scrollOffset = scrollY * 0.05 * (i % 2 === 0 ? 1 : -1);
            
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
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {defaultLines.map((_, i) => (
          <path
            key={i}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            className="opacity-60"
          />
        ))}
      </svg>
    </div>
  );
}

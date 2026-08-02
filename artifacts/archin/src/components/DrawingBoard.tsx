import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';

export function DrawingBoard() {
  const drawParams = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-20%" },
  };

  return (
    <section id="drawWrap" className="bg-secondary-bg py-[clamp(40px,6vh,70px)] px-[max(22px,5vw)] overflow-hidden">
      <div className="max-w-[1100px] mx-auto mb-[clamp(22px,4vh,44px)]">
        <FadeIn>
          <div className="flex flex-col mb-4">
            <span className="w-[26px] h-[1px] bg-accent mb-[14px]" />
            <span className="text-[10px] tracking-[0.4em] text-muted uppercase">
              The Process
            </span>
          </div>
          <h2 className="font-serif font-light text-[clamp(30px,5.2vw,64px)] leading-[1.1] max-w-[900px]">
            From the <em className="italic text-ink">drawing board</em> to the handover.
          </h2>
        </FadeIn>
      </div>

      <div className="max-w-[1100px] mx-auto relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-secondary-bg border border-line rounded-lg mt-12 overflow-hidden group" data-cursor="view">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <svg 
          viewBox="0 0 800 500" 
          className="w-full h-full p-10 drop-shadow-xl"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ground Line */}
          <motion.line x1="50" y1="400" x2="750" y2="400" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round"
            {...drawParams} transition={{ duration: 1.5, ease: "easeInOut" }} />

          {/* Main Structure Box */}
          <motion.rect x="200" y="200" width="400" height="200" fill="none" stroke="var(--color-ink)" strokeWidth="2"
            {...drawParams} transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }} />

          {/* Roof Triangle */}
          <motion.path d="M 180,200 L 400,100 L 620,200 Z" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round"
            {...drawParams} transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }} />

          {/* Windows / Inner Details */}
          <motion.rect x="250" y="250" width="80" height="150" fill="none" stroke="var(--color-ink)" strokeWidth="1.5"
            {...drawParams} transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }} />
          <motion.rect x="360" y="250" width="180" height="150" fill="none" stroke="var(--color-ink)" strokeWidth="1.5"
            {...drawParams} transition={{ duration: 1.5, delay: 1.7, ease: "easeInOut" }} />
            
          {/* Window Mullions */}
          <motion.line x1="290" y1="250" x2="290" y2="400" stroke="var(--color-ink)" strokeWidth="1" opacity="0.6"
            {...drawParams} transition={{ duration: 1, delay: 2.2, ease: "easeInOut" }} />
          <motion.line x1="420" y1="250" x2="420" y2="400" stroke="var(--color-ink)" strokeWidth="1" opacity="0.6"
            {...drawParams} transition={{ duration: 1, delay: 2.3, ease: "easeInOut" }} />
          <motion.line x1="480" y1="250" x2="480" y2="400" stroke="var(--color-ink)" strokeWidth="1" opacity="0.6"
            {...drawParams} transition={{ duration: 1, delay: 2.4, ease: "easeInOut" }} />

          {/* Dimension Lines (Accent Color) */}
          <motion.line x1="200" y1="180" x2="600" y2="180" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4 4"
            {...drawParams} transition={{ duration: 1, delay: 2.5, ease: "easeInOut" }} />
          <motion.line x1="200" y1="170" x2="200" y2="190" stroke="var(--color-accent)" strokeWidth="1"
            {...drawParams} transition={{ duration: 0.5, delay: 2.5, ease: "easeInOut" }} />
          <motion.line x1="600" y1="170" x2="600" y2="190" stroke="var(--color-accent)" strokeWidth="1"
            {...drawParams} transition={{ duration: 0.5, delay: 2.5, ease: "easeInOut" }} />
          
          <motion.text x="400" y="170" fill="var(--color-accent)" fontSize="12" textAnchor="middle" opacity="0"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3 }}>
            14.5m
          </motion.text>
        </svg>

        <div className="absolute bottom-6 left-6 text-[10px] tracking-[0.4em] text-ink uppercase">
          Technical Drawing / Elev. A
        </div>
      </div>
    </section>
  );
}

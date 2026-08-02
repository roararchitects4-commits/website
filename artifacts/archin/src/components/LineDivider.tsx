import React from 'react';
import { motion } from 'framer-motion';

export function LineDivider() {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-[max(22px,5vw)] py-2 bg-background">
      <svg 
        className="w-full h-[52px] md:h-[34px] overflow-visible" 
        viewBox="0 0 1000 50" 
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 0,25 C 250,50 750,0 1000,25"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-80"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

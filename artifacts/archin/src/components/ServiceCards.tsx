import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';

import arch1 from '@assets/generated_images/arch-1.jpg';
import int2 from '@assets/generated_images/int-2.jpg';
import land1 from '@assets/generated_images/land-1.jpg';

export function ServiceCards() {
  const cards = [
    { num: '01', title: 'Architecture', img: arch1 },
    { num: '02', title: 'Interiors', img: int2 },
    { num: '03', title: 'Landscaping', img: land1 },
  ];

  return (
    <section id="services" className="py-[80px] px-[max(22px,8vw)] bg-background">
      <FadeIn className="text-center mb-16">
        <span className="block text-[10px] tracking-[0.4em] text-muted uppercase mb-4">
          <span className="inline-block w-[26px] h-[1px] bg-accent mb-3 align-middle" />
          <br />
          Specialisms
        </span>
        <h3 className="font-serif font-light text-[clamp(30px,4vw,52px)] text-ink">
          Three disciplines, one standard.
        </h3>
      </FadeIn>

      <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,2.4vw,30px)]">
        {cards.map((card, idx) => (
          <FadeIn key={card.num} delay={idx * 0.15}>
            <a href={`#work`} className="block relative aspect-[3/4] overflow-hidden group cursor-none" data-cursor="view">
              <motion.img 
                src={card.img} 
                alt={card.title}
                className="w-full h-full object-cover scale-105 will-change-transform"
                style={{ filter: 'saturate(0.85) brightness(0.72)' }}
                whileHover={{ scale: 1, filter: 'saturate(0.95) brightness(0.85)' }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-ink/90 to-transparent text-white">
                <div className="text-[10px] tracking-[0.4em] text-white/70 mb-2">
                  {card.num}
                </div>
                <div className="font-serif font-light text-[clamp(24px,2.6vw,36px)]">
                  {card.title}
                </div>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

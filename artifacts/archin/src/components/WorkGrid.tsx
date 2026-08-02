import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { AnimatedLines } from './AnimatedLines';

import arch1 from '@assets/generated_images/arch-1.jpg';
import arch2 from '@assets/generated_images/arch-2.jpg';
import arch3 from '@assets/generated_images/arch-3.jpg';

import int1 from '@assets/generated_images/int-1.jpg';
import int2 from '@assets/generated_images/int-2.jpg';
import int3 from '@assets/generated_images/int-3.jpg';

import land1 from '@assets/generated_images/land-1.jpg';
import land2 from '@assets/generated_images/land-2.jpg';
import land3 from '@assets/generated_images/land-3.jpg';

interface WorkItem {
  id: string;
  img: string;
  title: string;
  desc: string;
}

interface WorkRowProps {
  label: string;
  items: WorkItem[];
  reverseDelay?: boolean;
}

function WorkRow({ label, items, reverseDelay }: WorkRowProps) {
  return (
    <div className="max-w-[1520px] mx-auto mb-[100px] last:mb-0">
      <FadeIn yOffset={20}>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-[22px] h-[1px] bg-accent flex-none" />
          <span className="text-[11px] tracking-[0.32em] text-muted uppercase">
            {label}
          </span>
        </div>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(18px,2.6vw,34px)]">
        {items.map((item, idx) => {
          const delay = reverseDelay ? (2 - idx) * 0.15 : idx * 0.15;
          return (
            <FadeIn key={item.id} delay={delay} yOffset={40} className="w-full">
              <figure className="group w-full cursor-none">
                <div className="overflow-hidden aspect-[4/5] bg-secondary-bg relative" data-cursor="view">
                  <motion.img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover will-change-transform scale-105"
                    whileHover={{ scale: 1, filter: 'saturate(0.95) contrast(1.02)' }}
                    transition={{ duration: 1.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                  />
                </div>
                <figcaption className="mt-4 text-[11px] tracking-[0.03em] text-muted leading-relaxed">
                  <b className="block font-serif italic text-[15px] text-ink mb-1 font-normal tracking-normal">
                    {item.title}
                  </b>
                  {item.desc}
                </figcaption>
              </figure>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

export function WorkGrid() {
  const architecture = [
    { id: 'a1', img: arch1, title: 'Mountain House', desc: 'A minimalist white concrete retreat built into the rocky terrain.' },
    { id: 'a2', img: arch2, title: 'Forest Pavilion', desc: 'Glass and steel pavilion blending seamlessly into a dense green forest.' },
    { id: 'a3', img: arch3, title: 'The Brutalist Wing', desc: 'Museum facade with dramatic shadows and stark concrete geometry.' }
  ];

  const interiors = [
    { id: 'i1', img: int1, title: 'Sunlit Living', desc: 'Warm minimalist living room with natural light and soft textures.' },
    { id: 'i2', img: int2, title: 'Timber & Smoke', desc: 'Upscale restaurant featuring a sweeping timber slatted ceiling.' },
    { id: 'i3', img: int3, title: 'Gallery Corridor', desc: 'Sleek contemporary gallery space defined by natural light shafts.' }
  ];

  const landscaping = [
    { id: 'l1', img: land1, title: 'Terraced Hillside', desc: 'Lush terraced garden stepping down a steep elevation.' },
    { id: 'l2', img: land2, title: 'Urban Rooftop', desc: 'Modern rooftop garden oasis overlooking the city skyline.' },
    { id: 'l3', img: land3, title: 'Zen Courtyard', desc: 'Minimalist Japanese courtyard with raked gravel and specimen maple.' }
  ];

  return (
    <section id="work" className="py-[100px] px-[max(22px,5vw)] bg-background relative z-10 overflow-hidden">
      <AnimatedLines className="z-0 opacity-50" />
      <div className="relative z-10">
        <WorkRow label="Architecture" items={architecture} />
        <WorkRow label="Interiors" items={interiors} reverseDelay />
        <WorkRow label="Landscaping" items={landscaping} />
      </div>
    </section>
  );
}

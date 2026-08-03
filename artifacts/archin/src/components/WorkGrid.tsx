import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  onOpen: (item: WorkItem) => void;
}

function WorkRow({ label, items, reverseDelay, onOpen }: WorkRowProps) {
  return (
    <div className="max-w-[1680px] mx-auto mb-[100px] last:mb-0">
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
            <motion.figure
              key={item.id}
              className="group w-full max-w-[460px] mx-auto cursor-pointer"
              initial={{ x: -140, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay, type: 'spring', stiffness: 90, damping: 16 }}
              onClick={() => onOpen(item)}
            >
              <motion.div
                className="overflow-hidden aspect-[4/5] bg-secondary-bg relative rounded-[2.5rem] shadow-2xl will-change-transform border border-white/10"
                whileHover={{ scale: 1.14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              </motion.div>
              <figcaption className="mt-4 text-[11px] tracking-[0.03em] text-muted leading-relaxed">
                <b className="block font-serif italic text-[15px] text-ink mb-1 font-normal tracking-normal">
                  {item.title}
                </b>
                {item.desc}
              </figcaption>
            </motion.figure>
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

  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);

  return (
    <section id="work" className="pt-[100px] pb-[60px] px-[max(22px,5vw)] bg-white relative z-10 overflow-hidden">
      <AnimatedLines
        className="z-0"
        scrollDraw
        localScrollOffset
        lines={[
          { start: [-0.2, 0.98], cp1: [0.4, 0.92], cp2: [0.6, -0.1], end: [1.2, -0.2] },
          { start: [1.2, 0.8], cp1: [0.5, 0.9], cp2: [0.2, 0.1], end: [-0.2, 0.4] },
          { start: [-0.2, 0.15], cp1: [0.3, 0.4], cp2: [0.7, -0.15], end: [1.2, 0.1] },
        ]}
      />
      <div className="relative z-10">
        <WorkRow label="Architecture" items={architecture} reverseDelay={false} onOpen={setActiveItem} />
        <WorkRow label="Interiors" items={interiors} reverseDelay onOpen={setActiveItem} />
        <WorkRow label="Landscaping" items={landscaping} reverseDelay={false} onOpen={setActiveItem} />
      </div>

      {createPortal(
        <AnimatePresence>
          {activeItem && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
            >
              <motion.div
                className="max-w-[90vw] max-h-[90vh] overflow-hidden rounded-[2rem] bg-black shadow-[0_0_80px_rgba(0,0,0,0.85)]"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={activeItem.img}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

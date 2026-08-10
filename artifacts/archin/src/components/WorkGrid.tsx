import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { AnimatedLines } from './AnimatedLines';

import arch1 from '@assets/roar_assets/arch-1.png';
import arch2 from '@assets/roar_assets/arch-2.png';
import arch3 from '@assets/roar_assets/arch-3.jpeg';

import int1 from '@assets/roar_assets/int-1.png';
import int2 from '@assets/roar_assets/int-2.png';
import int3 from '@assets/roar_assets/int-3.png';

import land1 from '@assets/roar_assets/land-1.png';
import land2 from '@assets/roar_assets/land-2.png';
import land3 from '@assets/roar_assets/land-3.png';

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
    { id: 'a1', img: arch1, title: 'Onyx Facade', desc: 'Dark stone-clad residence layered with wood-slat canopies and vertical greenery.' },
    { id: 'a2', img: arch2, title: 'Dusk Residence', desc: 'Multi-level home glowing at twilight with cascading balconies and a private water wall.' },
    { id: 'a3', img: arch3, title: 'Sculpted Corner', desc: 'Angular contemporary villa wrapped in stone, timber and glass.' }
  ];

  const interiors = [
    { id: 'i1', img: int1, title: 'Brick & Bloom', desc: 'Warm brick-walled dining room dressed with hanging marigold garlands.' },
    { id: 'i2', img: int2, title: 'Garden View Dining', desc: 'Sunlit dining hall opening onto a leafy street through full-height glass.' },
    { id: 'i3', img: int3, title: 'Terracotta Lounge', desc: 'Amber-lit dining space framed by warm terracotta walls.' }
  ];

  const landscaping = [
    { id: 'l1', img: land1, title: 'Palm Courtyard', desc: 'Residential courtyard lined with towering palms and manicured hedges.' },
    { id: 'l2', img: land2, title: 'Central Lawn', desc: 'Open lawn framed by raised planters and stepped seating.' },
    { id: 'l3', img: land3, title: 'Poolside Retreat', desc: 'Private villa pool bordered by tropical planting and stone decking.' }
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
                className="max-w-[90vw] max-h-[90vh] overflow-hidden rounded-[2rem] bg-black shadow-[0_0_80px_rgba(0,0,0,0.85)] flex items-center justify-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={activeItem.img}
                  alt={activeItem.title}
                  className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
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

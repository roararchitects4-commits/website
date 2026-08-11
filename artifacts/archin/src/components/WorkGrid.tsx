import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { AnimatedLines } from './AnimatedLines';
import { WORK_CATEGORIES, type WorkItem } from '../data/workCategories';

interface WorkRowProps {
  slug: string;
  label: string;
  items: WorkItem[];
  reverseDelay?: boolean;
  onOpen: (item: WorkItem) => void;
}

function WorkRow({ slug, label, items, reverseDelay, onOpen }: WorkRowProps) {
  return (
    <div className="max-w-[1680px] mx-auto mb-[100px] last:mb-0">
      <FadeIn yOffset={20}>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-[22px] h-[1px] bg-accent flex-none" />
            <span className="text-[11px] tracking-[0.32em] text-muted uppercase">
              {label}
            </span>
          </div>
          <Link
            href={`/gallery/${slug}`}
            className="text-[11px] tracking-[0.15em] uppercase text-ink underline underline-offset-4 decoration-line hover:text-accent hover:decoration-accent transition-colors flex-none"
          >
            View More ↗
          </Link>
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
              viewport={{ once: true, amount: 0.45, margin: '0px 0px -120px 0px' }}
              transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
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
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);

  useEffect(() => {
    if (!activeItem) return;

    const close = () => setActiveItem(null);
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) close();
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY - e.touches[0].clientY > 10) close();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeItem]);

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
        {WORK_CATEGORIES.map((category, idx) => (
          <WorkRow
            key={category.slug}
            slug={category.slug}
            label={category.label}
            items={category.items}
            reverseDelay={idx % 2 === 1}
            onOpen={setActiveItem}
          />
        ))}
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
                className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-[2rem] bg-black shadow-[0_0_80px_rgba(0,0,0,0.85)] flex items-center justify-center"
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
                <motion.div
                  className="absolute left-0 right-0 bottom-0 px-6 sm:px-10 pt-16 pb-6 sm:pb-8 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <b className="block font-serif italic text-[20px] sm:text-[22px] text-white mb-1.5 font-normal tracking-normal">
                    {activeItem.title}
                  </b>
                  <p className="text-[13px] text-white/80 leading-relaxed tracking-[0.03em] max-w-lg">
                    {activeItem.desc}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

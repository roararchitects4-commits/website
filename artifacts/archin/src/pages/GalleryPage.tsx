import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { WORK_CATEGORIES, type WorkItem } from '../data/workCategories';
import { SITE_URL } from '../lib/siteConfig';

const PLACEHOLDER_COUNT = 3;

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  architecture: {
    title: 'Architecture Projects | ROAR Architects, Hyderabad',
    description: 'Residential and commercial architecture by ROAR Architects, designed from our studios in Hyderabad and Visakhapatnam.',
  },
  interiors: {
    title: 'Interior Design Projects | ROAR Architects, Hyderabad',
    description: 'Interior design projects by ROAR Architects, designed from our studios in Hyderabad and Visakhapatnam.',
  },
  'terrace-scaping': {
    title: 'Terrace & Outdoor Design | ROAR Architects, Hyderabad',
    description: 'Terrace and outdoor living spaces by ROAR Architects, designed from our studios in Hyderabad and Visakhapatnam.',
  },
};

export default function GalleryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = WORK_CATEGORIES.find((c) => c.slug === slug);
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  if (!category) {
    return (
      <div className="relative bg-background min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4 text-ink">Gallery not found</h1>
            <Link href="/#work" className="text-[11px] tracking-[0.2em] border-b border-accent pb-1 text-ink">
              RETURN TO OUR WORK
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const meta = CATEGORY_META[category.slug];

  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      {meta && (
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <link rel="canonical" href={`${SITE_URL}/gallery/${category.slug}`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={`${SITE_URL}/gallery/${category.slug}`} />
        </Helmet>
      )}

      <SiteHeader />

      <main className="flex-1 pt-[70px] pb-[100px] px-[max(22px,5vw)] bg-white">
        <div className="max-w-[1680px] mx-auto">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors mb-8"
          >
            ← Back to Our Work
          </Link>

          <h1 className="font-serif font-light text-[clamp(36px,5vw,64px)] text-ink mb-3">
            {category.label}
          </h1>
          <p className="text-[13px] text-muted max-w-md mb-14">
            The complete {category.label.toLowerCase()} gallery. More projects are added here regularly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(18px,2.6vw,34px)]">
            {category.items.map((item) => (
              <figure
                key={item.id}
                className="group cursor-pointer w-full max-w-[360px] mx-auto"
                onClick={() => setActiveItem(item)}
              >
                <div className="overflow-hidden aspect-[4/5] bg-secondary-bg relative rounded-[2.5rem] shadow-2xl border border-white/10">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <figcaption className="mt-4 text-[11px] tracking-[0.03em] text-muted leading-relaxed">
                  <b className="block font-serif italic text-[15px] text-ink mb-1 font-normal tracking-normal">
                    {item.title}
                  </b>
                  {item.desc}
                </figcaption>
              </figure>
            ))}

            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, idx) => (
              <figure key={`placeholder-${idx}`} className="opacity-60 w-full max-w-[360px] mx-auto">
                <div className="aspect-[4/5] rounded-[2.5rem] border-2 border-dashed border-line flex flex-col items-center justify-center gap-3 text-muted">
                  <ImagePlus size={28} strokeWidth={1.25} />
                  <span className="text-[10px] tracking-[0.18em] uppercase">More coming soon</span>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </main>

      <Footer />

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
      </AnimatePresence>
    </div>
  );
}

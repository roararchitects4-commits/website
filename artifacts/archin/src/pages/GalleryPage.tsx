import React, { useEffect, useState } from 'react';
import { useParams, useSearch, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { WORK_CATEGORIES, type WorkItem } from '../data/workCategories';
import { GALLERY_IMAGES } from '../data/galleryImages';
import { SITE_URL } from '../lib/siteConfig';

/** Repeating span pattern for the mosaic. Mixed rectangles plus `grid-auto-flow:
 * dense` let the browser backfill gaps, so the wall reads as one composition
 * rather than a plain grid. The cycle length is coprime with the column counts
 * so the same shape never lines up in a column. */
const TILE_SPANS = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
];

/** What the lightbox is showing — mosaic tiles carry no copy, featured projects do. */
type Lightbox = { img: string; title?: string; desc?: string };

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
  const search = useSearch();
  const category = WORK_CATEGORIES.find((c) => c.slug === slug);
  const [activeItem, setActiveItem] = useState<Lightbox | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Arriving from a showcase tile as /gallery/<slug>?item=<id> opens that photo
  // straight away, with the gallery itself as the backdrop.
  const requestedId = new URLSearchParams(search).get('item');

  useEffect(() => {
    if (!requestedId) return;

    const match = category?.items.find((item) => item.id === requestedId);
    if (match) setActiveItem(match);
  }, [requestedId, category]);

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
  const photos = GALLERY_IMAGES[category.slug] ?? [];

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

      <main className="flex-1 pt-2 pb-[100px] px-[max(22px,5vw)] bg-white">
        <div className="max-w-[1680px] mx-auto">
          {/* The arrow is the whole back control — it sits inline with the
              title rather than on its own line above it. */}
          <div className="flex items-baseline gap-4">
            <Link
              href="/#work"
              aria-label="Back to our work"
              className="font-serif font-light text-[clamp(18px,2.2vw,29px)] leading-none text-muted hover:text-accent transition-colors"
            >
              ←
            </Link>
            {/* leading-none as well as the smaller size: at the default line
                height the title carries half a line of air above its cap, which
                reads as a gap under the header no amount of padding tuning
                explains. */}
            <h1 className="font-serif font-light text-[clamp(20px,2.6vw,32px)] leading-none text-ink mb-3">
              {category.label}
            </h1>
          </div>
          <p className="text-[13px] text-muted max-w-md mb-10">
            {photos.length} {category.label.toLowerCase()} projects. Tap any image to open it.
          </p>

          {/* Fewer columns and taller rows than a thumbnail wall, so each
              project actually reads at a glance. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 auto-rows-[clamp(120px,11.5vw,230px)] gap-2.5 sm:gap-3 [grid-auto-flow:dense]">
            {photos.map((src, idx) => (
              <button
                key={src}
                type="button"
                aria-label={`Open ${category.label} image ${idx + 1}`}
                className={`${TILE_SPANS[idx % TILE_SPANS.length]} mosaic-tile group relative overflow-hidden rounded-xl bg-secondary-bg ring-1 ring-black/5 hover:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                /* Staggered period and phase per tile, so neighbours drift out of
                   sync and the wall breathes instead of bobbing as one slab. The
                   primes keep the cycle from re-aligning across the grid. */
                style={{
                  animationDuration: `${5.5 + (idx % 7) * 0.55}s`,
                  animationDelay: `${-((idx * 0.83) % 6).toFixed(2)}s`,
                }}
                onClick={() => setActiveItem({ img: src })}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </button>
            ))}
          </div>

          {/* Every tile hovers above the page on its own soft shadow and drifts
              on its own clock. Only `transform` is animated — the shadow is
              static and hover-swapped — because a few hundred tiles animating
              box-shadow would repaint the whole wall each frame. */}
          <style>{`
            .mosaic-tile {
              box-shadow: 0 18px 34px -14px rgba(0,0,0,0.34), 0 6px 14px -8px rgba(0,0,0,0.18);
              transition: box-shadow 300ms ease-out;
              will-change: transform;
              animation-name: mosaicFloat;
              animation-timing-function: ease-in-out;
              animation-iteration-count: infinite;
            }
            .mosaic-tile:hover {
              box-shadow: 0 34px 60px -18px rgba(0,0,0,0.44), 0 10px 22px -10px rgba(0,0,0,0.24);
            }
            @keyframes mosaicFloat {
              0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              50%      { transform: translate3d(0, -11px, 0) rotate(0.35deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              .mosaic-tile { animation: none; }
            }
          `}</style>
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
                alt={activeItem.title ?? ''}
                className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
              />
              {activeItem.title && (
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

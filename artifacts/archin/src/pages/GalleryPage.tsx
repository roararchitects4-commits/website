import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearch, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { useDismissOnScroll } from '../hooks/useDismissOnScroll';
import { WORK_CATEGORIES, type WorkItem } from '../data/workCategories';
import { GALLERY_IMAGES } from '../data/galleryImages';
import { albumBySlug } from '../data/albums';
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
  /* Categories and named project albums share the /gallery/:slug namespace.
     The page is the same mosaic either way — only the heading, where the ←
     arrow goes and the meta block differ. */
  const album = category ? undefined : albumBySlug(slug);
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

  const closeLightbox = useCallback(() => setActiveItem(null), []);
  useDismissOnScroll(activeItem !== null, closeLightbox);

  /* One shape for both, so everything below reads off a single object rather
     than branching on which of the two was matched. */
  const view = category
    ? {
        slug: category.slug,
        label: category.label,
        photos: GALLERY_IMAGES[category.slug] ?? [],
        meta: CATEGORY_META[category.slug],
      }
    : album
      ? {
          slug: album.slug,
          label: album.label,
          photos: album.photos,
          meta: {
            title: `${album.label} | ROAR Architects, Hyderabad`,
            description: album.blurb,
          },
        }
      : null;

  if (!view) {
    return (
      <div className="relative bg-background min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4 text-ink">Gallery not found</h1>
            <Link href="/work" className="text-[11px] tracking-[0.2em] border-b border-accent pb-1 text-ink">
              RETURN TO OUR WORK
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      {view.meta && (
        <Helmet>
          <title>{view.meta.title}</title>
          <meta name="description" content={view.meta.description} />
          <link rel="canonical" href={`${SITE_URL}/gallery/${view.slug}`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={view.meta.title} />
          <meta property="og:description" content={view.meta.description} />
          <meta property="og:url" content={`${SITE_URL}/gallery/${view.slug}`} />
        </Helmet>
      )}

      <SiteHeader />

      {/* pt-6 rather than the pt-2 this started at: the title's leading-none
          trims the half-line of air that used to sit above its cap, which left
          it sitting almost against the header. The padding gives that clearance
          back deliberately, where the line height was giving it by accident.
          It lifts the whole column, so the 32px between the title and the first
          row of tiles is unchanged. */}
      <main className="flex-1 pt-6 pb-[100px] px-4 sm:px-[max(22px,5vw)] bg-white">
          {/* The arrow is the whole back control — it sits inline with the
              title rather than on its own line above it.

              The negative margins cancel main's own gutter so this row can take
              the header's instead, which is what puts the arrow on the same
              vertical line as the HOME link directly above it — the two were
              about 88px apart, since the header pads by a flat 32px while the
              page below pads by 5vw.

              It also has to sit outside the 1680px column the grid uses. That
              column is centred, so past roughly 1867px it starts drifting
              inward under its own cap and no fixed padding here could have
              followed it. */}
          <div className="flex items-center gap-4 -mx-4 px-5 sm:-mx-[max(22px,5vw)] md:px-8">
            {/* Always back to the work grid, for an album as much as for a
                category. An album is opened from a card in that grid, and
                sending the arrow to the album's category instead landed the
                visitor on a page of every photograph in the category — not
                anywhere they had been. */}
            <Link
              href="/work"
              aria-label="Back to our work"
              /* The mb-3 matches the title's own bottom margin, and that is what
                 lifts the arrow. The row centres on `items-center`, which
                 centres each child's *margin* box — so the title, carrying 12px
                 of margin below it, already sat 6px above the line the arrow
                 was centring on. Giving the arrow the same margin puts the two
                 glyphs on one centre instead of the boxes. */
              className="group mb-3 inline-flex items-center justify-center transition-transform duration-300 hover:-translate-x-1"
            >
              <svg 
                className="w-[clamp(18px,5.5vw,26px)] h-[clamp(18px,5.5vw,26px)] text-[#A94F3D]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            {/* leading-none as well as the smaller size: at the default line
                height the title carries half a line of air above its cap, which
                reads as a gap under the header no amount of padding tuning
                explains. */}
            {/* Inter rather than the serif every other page title uses. This
                heading sits directly over a wall of photographs, where the
                serif's light strokes had little to hold against; the sans keeps
                its weight at the same size. font-normal, not the font-light the
                serif carried — Inter at 300 is appreciably thinner than
                Cormorant at 300 and would have read as weaker, not lighter. */}
            <h1 className="font-sans font-normal text-[clamp(18px,6vw,32px)] sm:text-[clamp(20px,2.6vw,32px)] leading-none text-ink mb-3">
              {view.label.includes(' - ') ? (
                <>
                  {/* The separator kept its own size and margins — it was only
                      set in font-sans to escape the serif, which the heading no
                      longer uses. */}
                  {view.label.split(' - ')[0]} <span className="mx-1 text-[0.9em]">-</span> {view.label.split(' - ')[1]}
                </>
              ) : (
                view.label
              )}
            </h1>
          </div>
          <div className="mb-8" />

        <div className="max-w-[1680px] mx-auto">
          {/* Fewer columns and taller rows than a thumbnail wall, so each
              project actually reads at a glance. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 auto-rows-[clamp(120px,11.5vw,230px)] gap-2.5 sm:gap-3 [grid-auto-flow:dense]">
            {view.photos.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                aria-label={`Open ${photo.caption}`}
                className={`${TILE_SPANS[idx % TILE_SPANS.length]} mosaic-tile group relative overflow-hidden rounded-xl bg-secondary-bg ring-1 ring-black/5 hover:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                /* Staggered period and phase per tile, so neighbours drift out of
                   sync and the wall breathes instead of bobbing as one slab. The
                   primes keep the cycle from re-aligning across the grid. */
                style={{
                  animationDuration: `${5.5 + (idx % 7) * 0.55}s`,
                  animationDelay: `${-((idx * 0.83) % 6).toFixed(2)}s`,
                }}
                onClick={() => setActiveItem({ img: photo.src, title: photo.caption })}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* The caption stays out of the composition until the tile is
                    pointed at or tabbed to — the wall reads as photographs, and
                    the name is there the moment you go looking for it. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pt-8 pb-2.5 text-left bg-gradient-to-t from-black/75 via-black/35 to-transparent opacity-0 translate-y-2 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
                >
                  <span className="block font-serif italic text-[13px] sm:text-[14px] leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                    {photo.caption}
                  </span>
                </span>
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
            /* The drift is a desktop flourish — space between the tiles is what
               makes it read, and a two-column phone grid has almost none, so
               the wall just judders. Dropping it also spares the phone a
               permanent compositor job across every tile in the gallery. */
            @media (max-width: 639.98px) {
              .mosaic-tile {
                animation: none;
                will-change: auto;
                box-shadow: 0 10px 20px -10px rgba(0,0,0,0.3);
              }
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
                  {/* Mosaic photos carry a caption but no blurb, so the
                      paragraph is dropped rather than rendered empty. */}
                  {/* Phone sizes only — the `sm:` values are what this block
                      shipped with. The caption lies over the photograph, so on
                      a phone every line it takes is a line of picture covered.
                      Kept in step with the same overlay in WorkGrid; the two
                      are separate lightboxes and a change to one wants making
                      to the other. */}
                  <b
                    className={`block font-serif italic text-[12px] sm:text-[22px] text-white font-normal tracking-normal ${
                      activeItem.desc ? 'mb-0.5 sm:mb-1.5' : ''
                    }`}
                  >
                    {activeItem.title}
                  </b>
                  {activeItem.desc && (
                    <p className="text-[9px] sm:text-[13px] text-white/80 leading-relaxed tracking-[0.03em] max-w-lg">
                      {activeItem.desc}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

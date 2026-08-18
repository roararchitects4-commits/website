import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, easeIn } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { AnimatedLines, type LineDef } from './AnimatedLines';
import { useDismissOnScroll } from '../hooks/useDismissOnScroll';
import { useScaledDownView } from '../hooks/useScaledDownView';
import { useIsMobile } from '../hooks/useIsMobile';
import { WORK_CATEGORIES, type WorkItem } from '../data/workCategories';

/* The curves as drawn on a wide screen: long, near-horizontal sweeps with room
   to pass either side of the copy. */
const WIDE_LINES: LineDef[] = [
  { start: [-0.2, 0.98], cp1: [0.4, 0.92], cp2: [0.6, -0.1], end: [1.2, -0.2] },
  { start: [1.2, 0.8], cp1: [0.5, 0.9], cp2: [0.2, 0.1], end: [-0.2, 0.4] },
  { start: [-0.2, 0.135], cp1: [0.3, 0.385], cp2: [0.7, -0.15], end: [1.2, 0.1] },
];

/* Phone: two lines only, each running corner to corner — top-left to
   bottom-right and top-right to bottom-left — so they cross near the middle of
   the section.

   Waypoints rather than the `start/cp1/cp2/end` arc the wide screen uses: a
   lone cubic Bezier can only bend one way, so it cannot make two waves. These
   are sampled off `x = t ± 0.22·sin(4πt)` against `y = t`, which is one full
   wave every half of the run, and `points` smooths them into one continuous
   curve. The swing has to beat the diagonal's own drift to read as a wave at
   all — over a half period the diagonal carries x along by 0.25, so at 0.22 the
   curve genuinely doubles back on itself instead of merely rippling.

   The second line is the first mirrored in x, which is what puts them on
   opposite diagonals and crosses them dead centre.

   Only the bottom ends run past the edge of the box. Each line now starts at
   the first wave's crest, a little inside and below the top corner, so the pair
   opens under the section's heading rather than running up behind it. Trimming
   there costs no wave: the crest is where the first one turns, so the two full
   oscillations below it are all still on the page. */
const PHONE_LINES: LineDef[] = [
  {
    points: [
      [0.345, 0.125],
      [0.25, 0.25],
      [0.155, 0.375],
      [0.5, 0.5],
      [0.845, 0.625],
      [0.75, 0.75],
      [0.655, 0.875],
      [1.03, 1.03],
    ],
  },
  {
    points: [
      [0.655, 0.125],
      [0.75, 0.25],
      [0.845, 0.375],
      [0.5, 0.5],
      [0.155, 0.625],
      [0.25, 0.75],
      [0.345, 0.875],
      [-0.03, 1.03],
    ],
  },
];

interface WorkRowProps {
  slug: string;
  label: string;
  items: WorkItem[];
  showcaseFrom?: number;
  reverseDelay?: boolean;
  onOpen: (item: WorkItem) => void;
}

/** Four-up catalogue panel. Tapping a tile opens that photo on the gallery page;
 * tapping the panel's own surface (partitions, caption strip) just goes to the
 * gallery. */
function ShowcasePanel({ slug, items, delay }: { slug: string; items: WorkItem[]; delay: number }) {
  const [, navigate] = useLocation();

  return (
    <motion.figure
      className="group w-full cursor-pointer"
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.45, margin: '0px 0px -120px 0px' }}
      transition={{ duration: 2.2, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/gallery/${slug}`)}
    >
      {/* On a phone the panel is full width (it spans both columns), so a 3/4
          box would run half a screen tall for what is only a teaser. It drops
          to one row of two tiles in a wide, shallow box instead; the other two
          tiles stay in the markup and reappear from md up.

          3/1 rather than the 2/1 it started at: the tiles are blurred and carry
          the label, so this reads as a band closing the row, not as pictures to
          study — at 2/1 it took as much height as the cards above it and the
          eye stopped on it. Height is set off the width, so this is the whole
          control; there is no height to trim anywhere else. */}
      <motion.div
        className="aspect-[3/1] md:aspect-[4/5] bg-secondary-bg relative rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl will-change-transform border border-white/10 p-2 md:p-3 grid grid-cols-2 grid-rows-1 md:grid-rows-2 gap-2 md:gap-3"
        whileHover={{ scale: 1.14 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Open ${item.title}`}
            className={`relative overflow-hidden rounded-[0.9rem] md:rounded-[1.1rem] shadow-lg ring-1 ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              idx > 1 ? 'hidden md:block' : ''
            }`}
            onClick={(event) => {
              // Otherwise the panel's own handler would also fire and drop the
              // selected photo.
              event.stopPropagation();
              navigate(`/gallery/${slug}?item=${item.id}`);
            }}
          >
            {/* Phone only: blurred so the panel reads as a teaser behind the
                label sitting on it rather than as four more photographs
                competing with it — these are the same shots the gallery page
                shows in full. Scaled up slightly because a blur samples past
                the element's edge, which would otherwise leave a soft
                transparent rim inside the tile. Written with `max-md:` rather
                than an `md:` reset so the desktop classes are left exactly as
                they were — in particular nothing here can outrank the
                group-hover zoom, which is also a transform. */}
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover max-md:blur-[2px] max-md:scale-105 transition-transform duration-500 group-hover:scale-[1.12]"
            />
          </button>
        ))}

        {/* Phone only: the label sits on the panel instead of below it. The
            wrapper spans the panel so the pill centres on it, but stays
            transparent to clicks — only the pill itself takes them, leaving the
            four tiles underneath reachable everywhere else.

            No plate behind it — the words sit straight on the photographs, so
            the panel reads as one picture with a label over it rather than as
            a picture with a chip stuck to it. Two things stand in for the
            plate the type has lost: it is white, because black held up only
            while it had an opaque ground under it and these tiles run from
            pale interiors to a night elevation; and it carries its own shadow,
            which is what keeps it legible over the lighter shots now nothing
            else separates the two. The blur on the tiles does the rest. */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none md:hidden">
          <button
            type="button"
            className="pointer-events-auto rounded-sm px-1 text-[15px] leading-none tracking-[0.16em] uppercase text-white font-medium whitespace-nowrap [text-shadow:0_1px_12px_rgba(0,0,0,0.65),0_1px_3px_rgba(0,0,0,0.55)] transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/gallery/${slug}`);
            }}
          >
            Explore more →
          </button>
        </div>
      </motion.div>
      {/* Desktop keeps the label below the panel, where it always sat. */}
      <figcaption className="mt-4 hidden md:block text-[11px] tracking-[0.13em] uppercase text-muted">
        Explore more →
      </figcaption>
    </motion.figure>
  );
}

function WorkRow({ slug, label, items, showcaseFrom, reverseDelay, onOpen }: WorkRowProps) {
  const showcase =
    showcaseFrom === undefined ? [] : items.slice(showcaseFrom, showcaseFrom + 4);
  // The showcase panel stands in for the third cell, so the row still reads as
  // three columns.
  const cards = showcase.length === 4 ? items.slice(0, showcaseFrom) : items;

  return (
    /* Matched to the earlier live iteration: the row keeps its full 1680px and
       the cards are sized down by the gutters instead, which is what gave that
       version its ~476px cards with a wide clearing between them. Narrowing the
       row got a similar card size but crowded the columns together and pulled
       the whole section in off the page — the gutters are the part that reads. */
    <div className="max-w-[1680px] mx-auto mb-[34px] last:mb-0">
      <FadeIn yOffset={20}>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-[22px] h-[1px] bg-accent flex-none" />
          {/* The label already sits above the animated lines — the section
              stacks them at z-0 and this content at z-10 — but 0.32em of
              letter-spacing leaves the curve visible through every gap between
              the letters, which is what makes it read as crossing the word. An
              opaque ground on the text itself closes those gaps, so the line
              passes behind the label and resumes on the far side. The negative
              inline margin cancels the padding, leaving the label positioned
              exactly where it was. Phone only: on desktop the curves run wide
              of the labels and a white patch would just break the line. */}
          <span className="bg-white px-1 -mx-1 text-[11px] tracking-[0.32em] text-black uppercase md:bg-transparent md:px-0 md:mx-0">
            {label}
          </span>
        </div>
      </FadeIn>

      {/* The column gutter is what sets the card size here: at three columns in
          1680px, a 126px gutter lands each card at ~476×595, the reference
          proportion. It stays on vw so the cards shrink with the window rather
          than snapping at a breakpoint. Row gap and the two-column phone layout
          keep the old tight spacing — wide gutters there would leave the cards
          too narrow to read.

          Phone only: the row gap is cut to 2px so the showcase panel sits up
          against the cards above it. Only the rows tighten — the column gutter
          keeps the clamp, since that one is what sets the card width. */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[clamp(8px,1.2vw,16px)] max-md:gap-y-[2px] md:gap-x-[clamp(16px,6.6vw,126px)]">
        {cards.map((item, idx) => {
          const delay = reverseDelay ? (2 - idx) * 0.2 : idx * 0.2;
          return (
            <motion.figure
              key={item.id}
              className="group w-full cursor-pointer"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.45, margin: '0px 0px -120px 0px' }}
              transition={{ duration: 2.2, delay, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onOpen(item)}
            >
              <motion.div
                className="overflow-hidden aspect-[3/4] md:aspect-[4/5] bg-secondary-bg relative rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl will-change-transform border border-white/10"
                whileHover={{ scale: 1.14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              </motion.div>
              <figcaption className="mt-2 md:mt-4 text-[9px] md:text-[11px] tracking-[0.03em] text-black leading-snug md:leading-relaxed">
                <b className="block font-serif italic text-[11px] md:text-[15px] text-ink mb-0.5 font-normal tracking-normal">
                  {item.title}
                </b>
                {/* Was `hidden md:block`, which is display:none on a phone.
                    Google crawls this site as Googlebot smartphone, so at that
                    width the description was not merely unseen by visitors — it
                    was absent from the rendered page the crawler indexes, and
                    display:none copy is discounted regardless. Clamping keeps
                    the card as compact as hiding it did while the text stays
                    real, rendered, selectable content — one line on a phone,
                    where the card is half a screen wide and a second line
                    crowds the row; the full description from md up. The clamp
                    is a visual truncation, so the whole sentence is still in
                    the DOM for the crawler either way. */}
                {/* No `block` here on purpose: `line-clamp-*` works by setting
                    `display:-webkit-box`, and `.block` is emitted after it in
                    Tailwind's output, so at equal specificity `display:block`
                    won and the clamp silently did nothing. Desktop still gets
                    `display:block` — `line-clamp-none` sets it itself. */}
                <span className="line-clamp-1 md:line-clamp-none">{item.desc}</span>
              </figcaption>
            </motion.figure>
          );
        })}

        {showcase.length === 4 && (
          <div className="col-span-2 md:col-span-1">
            <ShowcasePanel
              slug={slug}
              items={showcase}
              delay={reverseDelay ? 0 : cards.length * 0.2}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkGrid() {
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);

  const closeLightbox = useCallback(() => setActiveItem(null), []);
  useDismissOnScroll(activeItem !== null, closeLightbox);
  const scaledView = useScaledDownView();
  const isMobile = useIsMobile();

  /* Phone only: the accent curves drop to a little under half their usual
     weight, so they read as a watermark behind the cards rather than as lines
     drawn across the copy — at 0.6 they cut straight through the captions at
     phone width, where there is no room to run wide of them. */
  const lineOpacity = isMobile ? 0.28 : 0.6;

  return (
    <section id="work" className="pt-[32px] sm:pt-[40px] pb-[24px] px-4 sm:px-[max(22px,5vw)] bg-white relative z-10 overflow-hidden">
      {/* Lines draw progressively as the user scrolls. Despite the branch it
          sits in, this is the arm phones actually render — `scaledView` keys on
          viewport *height*, which only identifies a phone in the old
          `width=1440` scaled-down mode the viewport meta has since left. So the
          geometry has to be chosen by width here, or a phone would get the
          wide-screen curves. */}
      {!scaledView && (
        <AnimatedLines
          className="z-0"
          scrollDraw
          localScrollOffset
          strokeOpacity={lineOpacity}
          lines={isMobile ? PHONE_LINES : WIDE_LINES}
          /* Phone only. This section runs several screens tall here, and the
             default window opens as its top edge appears at the bottom of the
             viewport — so the drawing was finished before the first row of
             cards had arrived, and following a `#work` link put you past the
             whole window on load, with the lines already complete.

             Measured against the middle of the screen instead: progress runs
             from the section's top crossing the centre line to its bottom
             crossing it, which is what puts the growing end of each curve by
             the centre of the screen as you scroll rather than somewhere off
             the top or bottom of it.

             The ease is what makes it gather pace. Flat, the curve advances one
             unit of line per unit of scroll the whole way down; eased in, it
             hangs back through the body of the section and then runs away with
             itself over the last rows. Span stops at 0.9 rather than 1 because
             the two lines are staggered by 0.045, and at a full 1 the later of
             them would finish past the end of the window and sit permanently a
             fraction short — the ease packs most of its travel into that last
             stretch anyway, so it still lands on the final row. */
          drawOffset={isMobile ? ['start center', 'end center'] : undefined}
          drawSpan={isMobile ? 0.9 : undefined}
          drawEase={isMobile ? easeIn : undefined}
        />
      )}
      {/* Mobile: lines live-draw their path on page load (revealDelay=0),
          with shorter curves so they don't cross too far beyond the
          architecture row. */}
      {scaledView && (
        <AnimatedLines
          className="z-0"
          revealDelay={0}
          localScrollOffset
          strokeOpacity={lineOpacity}
          lines={[
            { start: [0.05, 0.75], cp1: [0.35, 0.65], cp2: [0.65, 0.15], end: [0.95, 0.08] },
            { start: [0.95, 0.6], cp1: [0.55, 0.7], cp2: [0.3, 0.25], end: [0.05, 0.35] },
            { start: [0.05, 0.18], cp1: [0.3, 0.35], cp2: [0.7, 0.02], end: [0.95, 0.12] },
          ]}
        />
      )}
      <div className="relative z-10">
        {WORK_CATEGORIES.map((category, idx) => (
          <WorkRow
            key={category.slug}
            slug={category.slug}
            label={category.label}
            items={category.items}
            showcaseFrom={category.showcaseFrom}
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
                  {/* Phone sizes only — the `sm:` values are the ones this
                      block already shipped with. The caption sits over the
                      photograph, so on a phone every line it costs is a line
                      of the image covered; smaller type gives the picture back
                      the room without losing the words. */}
                  <b className="block font-serif italic text-[12px] sm:text-[22px] text-white mb-0.5 sm:mb-1.5 font-normal tracking-normal">
                    {activeItem.title}
                  </b>
                  <p className="text-[9px] sm:text-[13px] text-white/80 leading-relaxed tracking-[0.03em] max-w-lg">
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

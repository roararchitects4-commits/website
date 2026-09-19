/* The enquiry page, at its own path. It answers to two kinds of visitor and
 * is shaped by the more demanding of them: Google Ads interiors traffic in
 * Hyderabad, who arrive cold on a click that cost money, and who the studio's
 * home page was never built to convert. "Get in Touch" in the site's nav lands
 * here too.
 *
 * It wears the site's own header and footer, so arriving from the nav reads as
 * another page of the site rather than somewhere else entirely. What it does
 * differently is the middle: the form sits above the fold with the argument for
 * the studio beside it, rather than waiting at the foot of a long scroll.
 *
 * The entrance cover plays only for someone arriving from the site's own
 * navigation, and runs shorter here than on the home page. On a paid click it
 * is skipped: the cover outlasts the patience behind that click, and a form
 * nobody sees is a click bought for nothing. See lib/appEntry for how the two
 * are told apart.
 *
 * Every claim on this page is drawn from what the site already states — the
 * project count, the two studios, the named projects in `albums.ts`. Nothing
 * here promises a delivery window, a warranty or a price the studio has not
 * published.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Check, X, ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { LeadForm } from '../components/LeadForm';
import { PageTransition } from '../components/PageTransition';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import { SITE_URL, SITE_NAME, PHONE_E164, PHONE_DISPLAY, WHATSAPP_URL } from '../lib/siteConfig';
import { WORK_CATEGORIES } from '../data/workCategories';
import { officesJsonLd } from '../data/offices';
import { isInAppNavigation } from '../lib/appEntry';
import { CONTACT_PATH } from '../lib/sections';

/* ─────────────────────────────────────────────
   Static content
───────────────────────────────────────────── */

/* Numbers already published on the home page's hero — repeated here rather
   than inflated, so the two pages cannot contradict each other. */
const STATS = [
  { value: '250+', label: 'Projects delivered' },
  { value: '7+', label: 'Cities' },
  { value: '3+', label: 'Countries' },
  { value: '2', label: 'Design studios' },
];

/* Each claim is a label and what it means. Kept apart so the label can be set
   in a heavier weight, which is what lets the four be scanned rather than
   read. */
const POINTS = [
  { label: 'Architect-led design', detail: 'thoughtful spaces shaped around your lifestyle' },
  { label: 'Complete interior solutions', detail: 'from individual spaces to entire homes' },
  { label: 'Transparent planning', detail: 'layouts, materials and finishes considered upfront' },
  { label: 'End-to-end execution', detail: 'one team from concept to handover' },
];

/* The same projects the home page's work grid shows, read straight off
   WORK_CATEGORIES rather than hand-picked again here — a project added to the
   site now appears on this page too, and the two can never drift into showing
   different work. Only the presentation differs: the home page animates them
   category by category, while this page lays every one of them out as a plain
   tile, which is what a visitor scanning a landing page can take in at a
   glance. */
/* Three named projects, one from each of the studio's categories, rather than
   a slice taken off the top of each. Named because the choice is editorial:
   these are the three the page leads with, and a rule that picked the first of
   each would quietly change them the next time the work grid is reordered.

   They are still looked up in WORK_CATEGORIES rather than given their own
   image imports, so the photograph and the title stay whatever the home page
   is showing. A title that no longer matches drops out rather than rendering
   an empty tile. */
const FEATURED_TITLES = ['Layered Facade Villa', 'Poolside Pergola', 'Skyline Terrace'];

const GALLERY: { img: string; title: string; meta: string; desc: string }[] =
  FEATURED_TITLES.flatMap((title) => {
    const category = WORK_CATEGORIES.find((c) => c.items.some((item) => item.title === title));
    const item = category?.items.find((entry) => entry.title === title);
    return category && item
      ? [{ img: item.img, title: item.title, meta: category.label, desc: item.desc }]
      : [];
  });

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function InteriorsLandingPage() {
  const [lightbox, setLightbox] = useState<{ img: string; title: string; meta: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const barSlotRef = useRef<HTMLDivElement>(null);

  /* True once the bar's resting place above the footer has fully come into
     view, at which point the bar stops following the screen and sits there. */
  const [barParked, setBarParked] = useState(false);

  /* Tracks the form's first field rather than the whole card: the bar is a way
     back to the form, and the moment it becomes useful is when the visitor has
     scrolled past where the form starts — not when its last pixel has gone.
     Starts true so the bar is down on first paint, since the form is the first
     thing under the header and a bar sliding away during load would be the
     first movement a visitor sees. */
  const [formInView, setFormInView] = useState(true);

  /* Read once, in the initial render, and kept: whether this page was opened
     from the site's own navigation. A plain call would flip to true as soon as
     App's effect ran and bring the cover up on a page already on screen. */
  const [showEntrance] = useState(isInAppNavigation);

  /* wouter leaves the scroll offset where it was, and an ad click that lands
     mid-page never sees the form. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  /* Escape closes the lightbox, and the page behind it must not scroll while
     it is open. */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  useEffect(() => {
    const element = nameFieldRef.current;
    /* No IntersectionObserver means the bar simply stays as it started, which
       is the form-visible state — never a bar stuck over the page. */
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      /* threshold 0, so this flips the moment the Name field's last pixel
         leaves the screen. */
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = barSlotRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    /* threshold 1, so this turns true exactly when the whole slot is on
       screen — which is the moment its bottom edge reaches the bottom of the
       screen, where the floating bar already is. Switching there means the bar
       changes which thing it is anchored to without appearing to move. */
    const observer = new IntersectionObserver(
      ([entry]) => setBarParked(entry.intersectionRatio >= 1),
      { threshold: 1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const canonical = `${SITE_URL}${CONTACT_PATH}`;

  return (
    <div className="relative bg-background min-h-screen">
      {/* Roughly half the home page's entrance. This is a page someone
          clicked "Get in Touch" to reach, so it should get out of the way of
          the form rather than perform. */}
      {showEntrance && <PageTransition holdMs={750} wipeMs={700} />}

      <Helmet>
        <title>Interior Designers in Hyderabad | Free Consultation — ROAR Architects</title>
        <meta
          name="description"
          content="Full home interiors, modular kitchens and wardrobes designed by architects in Hyderabad. 250+ projects delivered. Book a free design consultation with ROAR Architects."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Interior Designers in Hyderabad | ROAR Architects" />
        <meta
          property="og:description"
          content="Interiors designed by architects, with itemised estimates and one team from design through to handover. Book a free consultation."
        />
        <meta property="og:url" content={canonical} />
        {/* The studio's addresses and phone number, as structured data. On this
            page rather than the home page because this is where a search for
            "interior designers in Hyderabad" should land, and because it is the
            page that can actually do something with the visit. See
            data/offices. */}
        <script type="application/ld+json">
          {JSON.stringify(officesJsonLd(SITE_URL, SITE_NAME, PHONE_DISPLAY))}
        </script>
      </Helmet>

      {/* The site's own header and footer, so arriving here from the nav
          reads as another page of the site rather than somewhere else
          entirely. */}
      <SiteHeader />

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="scroll-mt-[60px] bg-white border-b border-line">
        {/* Two rows on a wide screen: the heading takes the first, the copy the
            second, and the form spans both down the other column. Putting the
            heading in the grid rather than above it is what lines its top edge
            up with the top of the form.

            On one column the explicit placements drop away and `order` takes
            over, so the reading order becomes heading, form, copy — the form
            still lands directly under the heading, where a phone visitor meets
            it first. */}
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_1fr] gap-x-8 lg:gap-x-14 gap-y-5 sm:gap-y-6 items-stretch">
          {/* The kicker and the headline share the grid's first row, so the
              form beside them still starts level with the top of the text. */}
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            {/* The two treatments are swapped from where they started: the
                invitation now carries the display size and the <h1> with it,
                and the promise sits under it as the small tracked line. */}
            <h1 className="text-[clamp(26px,6.5vw,36px)] font-sans font-light leading-[1.15] tracking-[-0.02em] text-accent mb-3">
              Let's create your space
            </h1>
            <p className="text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-accent">
              Thoughtfully designed. Precisely executed.
            </p>
          </div>

          {/* Left — the pitch */}
          <div className="order-3 lg:col-start-1 lg:row-start-2">
            <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] text-black/70 max-w-[470px] mb-5">
              We create refined residential interiors where architecture, functionality and
              craftsmanship come together. Every space is thoughtfully planned around the way you
              live, with careful attention to proportion, materials and the smallest details.
            </p>

            <ul className="flex flex-col gap-2.5 mb-7">
              {POINTS.map((point) => (
                <li key={point.label} className="flex items-start gap-2.5 text-[13px] leading-snug text-black/75">
                  <Check size={15} strokeWidth={2.2} className="text-accent mt-[2px] flex-none" />
                  <span>
                    <span className="font-medium text-ink">{point.label}</span> {point.detail}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-4 border-t border-line pt-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="pr-2">
                  <p className="font-sans text-[clamp(16px,3.6vw,23px)] font-bold leading-none text-accent mb-1.5">{stat.value}</p>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-black/55 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — the form. First in the DOM on a phone so it is the first
              thing under the header, which is the whole reason the page exists. */}
          {/* No longer sticky: the card now fills the column top to bottom, so
              there is no short card left to follow the scroll. */}
          <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex">
            <LeadForm id="enquiry" nameFieldRef={nameFieldRef} />
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="pt-5 sm:pt-7 pb-12 sm:pb-16">
        {/* The heading runs on the hero's grid — same max width, same gutters —
            so "Work" starts on the same line as the copy above it. The cards
            below keep the work grid's wider track, which is what holds them to
            the size they have on the home page. */}
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <FadeIn>
            {/* justify-end rather than between: the heading that used to hold
                the left of this row is gone, and a lone child in a
                justify-between row sits left. */}
            <div className="flex flex-wrap items-end justify-end gap-4 mb-5">
              {/* The home page's work section rather than the interiors album:
                  "all projects" should mean all of them, and /gallery/interiors
                  is one category of the three. /work renders the home page and
                  scrolls to the grid — see lib/sections. */}
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink border-b border-accent pb-1 hover:text-accent transition-colors"
              >
                See all projects <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="px-4 sm:px-[max(22px,5vw)]">
          <div className="max-w-[1680px] mx-auto">
            {/* The album card from the home page's work grid, rebuilt here: the
                same portrait crop, corner radius, shadow and hover swell, and the
                caption sitting under the picture rather than printed over it. See
                components/WorkGrid.tsx — the two are meant to be indistinguishable.

                A <figure> with an onClick rather than a <button>, matching the work
                grid, which wraps the whole card in one clickable figure. */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[clamp(8px,1.2vw,16px)] max-md:gap-y-[2px] md:gap-x-[clamp(16px,6.6vw,126px)]">
              {GALLERY.map((item, index) => (
                <FadeIn key={item.title} delay={Math.min(index, 5) * 0.05} yOffset={18}>
                  <figure
                    className="group w-full cursor-pointer"
                    onClick={() => setLightbox(item)}
                  >
                    <motion.div
                      className="overflow-hidden aspect-[3/4] md:aspect-[4/5] bg-secondary-bg relative rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl will-change-transform border border-white/10"
                      whileHover={{ scale: 1.14 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img
                        src={item.img}
                        alt={`${item.title} — ${item.meta} by ${SITE_NAME}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    </motion.div>
                    <figcaption className="mt-2 md:mt-4 text-[9px] md:text-[11px] tracking-[0.03em] text-black leading-snug md:leading-relaxed">
                      <b className="block font-sans text-[11px] md:text-[15px] text-ink mb-0.5 font-normal tracking-normal">
                        {item.title}
                      </b>
                      {/* `block` is load bearing: truncate works by hiding overflow,
                          and an inline box ignores overflow entirely. */}
                      <span className="block truncate">{item.desc}</span>
                    </figcaption>
                  </figure>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STICKY MOBILE CTA ══
          Phone only, and only once the form itself has scrolled off screen —
          it stands in for the form, so it stays down while the real one is
          still in front of the visitor. Desktop has the room to show the form
          beside the copy and never needs it.

          The outer slot sits in the flow just above the footer and always
          holds the bar's height, whether the bar is floating over the screen
          or parked in it. That reserved space is what stops the footer
          shifting when the two swap, and it is also the bar's last position:
          scroll to the end and it comes to rest here rather than covering the
          footer. */}
      <div
        ref={barSlotRef}
        className="lg:hidden relative h-[calc(4.25rem+env(safe-area-inset-bottom))]"
      >
        <div
          className={`${barParked ? 'absolute' : 'fixed'} bottom-0 inset-x-0 z-50 bg-white border-t border-line px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex items-center gap-2.5 transition-transform duration-300 ease-out ${
            formInView && !barParked ? 'translate-y-full' : 'translate-y-0'
          }`}
          /* Hidden from taps and from a screen reader while it is off screen,
             since a translated element is still in the page. */
          aria-hidden={formInView && !barParked}
          style={{ pointerEvents: formInView && !barParked ? 'none' : undefined }}
        >
          <a
            href={`tel:+${PHONE_E164}`}
            className="flex-none flex items-center justify-center gap-2 border border-accent text-accent rounded-full h-12 px-5 text-[11px] tracking-[0.16em] uppercase"
          >
            <Phone size={15} strokeWidth={2} />
            Call
          </a>
          <button
            type="button"
            onClick={scrollToForm}
            className="flex-1 bg-accent text-white rounded-full h-12 text-[11px] tracking-[0.18em] uppercase"
          >
            Book consultation
          </button>
        </div>
      </div>

      <Footer />

      {/* ══ LIGHTBOX ══ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X size={26} strokeWidth={1.5} />
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1100px] w-full"
            >
              <img
                src={lightbox.img}
                alt={lightbox.title}
                className="w-full max-h-[76vh] object-contain rounded-lg"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                <div>
                  <p className="text-white text-[15px]">{lightbox.title}</p>
                  <p className="text-white/55 text-[10px] tracking-[0.18em] uppercase mt-1">{lightbox.meta}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLightbox(null);
                    scrollToForm();
                  }}
                  className="text-[11px] tracking-[0.2em] uppercase border border-white/40 text-white rounded-full py-2.5 px-6 hover:bg-white hover:text-ink transition-colors"
                >
                  Get this look
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

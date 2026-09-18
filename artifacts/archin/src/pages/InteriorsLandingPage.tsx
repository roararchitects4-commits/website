/* Paid-campaign landing page — the destination for Google Ads interiors
 * traffic in Hyderabad, living at its own path so ad spend lands somewhere
 * built to convert rather than on the studio's home page.
 *
 * It deliberately breaks three of the site's conventions, and each break is the
 * point of the page:
 *
 *   - No SiteHeader. A visitor who arrives from an ad has one job here, and a
 *     nav bar is six ways to leave before reaching the form. The header is
 *     replaced by a logo and a phone number that cannot navigate away.
 *   - The entrance cover plays only for someone arriving from the site's own
 *     navigation, and runs shorter here than on the home page. On a paid click
 *     it is skipped entirely: a form nobody sees is a click bought for nothing.
 *     See lib/appEntry for how the two are told apart.
 *   - The form is above the fold and repeated at the foot, rather than living
 *     once at the bottom like the home page's CTA.
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
import { PageTransition } from '../components/PageTransition';
import { Footer } from '../components/Footer';
import { SITE_URL, SITE_NAME, PHONE_E164, WHATSAPP_URL } from '../lib/siteConfig';
import { WORK_CATEGORIES } from '../data/workCategories';
import { isInAppNavigation } from '../lib/appEntry';
import logo from '@/assets/logo/logo.png';

/** The campaign path, exported so App can match it without repeating the
 *  string — it also uses it to suppress the floating social buttons, which
 *  would otherwise sit on top of this page's sticky mobile call bar. */
export const INTERIORS_LANDING_PATH = '/interior-design-hyderabad';

const WHATSAPP_MESSAGE =
  "Hi, I'd like to book a free interior design consultation with ROAR Architects.";

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

/* The same projects the home page's work grid shows, read straight off
   WORK_CATEGORIES rather than hand-picked again here — a project added to the
   site now appears on this page too, and the two can never drift into showing
   different work. Only the presentation differs: the home page animates them
   category by category, while this page lays every one of them out as a plain
   tile, which is what a visitor scanning a landing page can take in at a
   glance. */
/* Two per category rather than the first six, which would have been all
   architecture before an interior appeared. The grid is three columns at its
   widest, so this lands as exactly two rows with every category in them. */
const TILES_PER_CATEGORY = 2;

/* The grid narrows to two columns below `lg`, so the same six tiles that make
   two rows on a desktop make three on a phone. The last two are dropped there
   to keep it at two rows either way — a CSS hide rather than a shorter list,
   since which tiles are surplus depends purely on the breakpoint. */
const TILES_ON_PHONE = 4;

const GALLERY: { img: string; title: string; meta: string }[] = WORK_CATEGORIES.flatMap(
  (category) =>
    category.items.slice(0, TILES_PER_CATEGORY).map((item) => ({
      img: item.img,
      title: item.title,
      meta: category.label,
    })),
);

/* Three fields, deliberately. Every extra question is another chance to
   abandon the form, and a name with a working phone number is all the studio
   needs to open the conversation — the brief, the budget and the timing are
   what the callback is for. */
const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
};

type FormState = typeof EMPTY_FORM;

const fieldClass =
  'w-full bg-white border border-line rounded-lg py-4 px-4 text-black text-[16px] placeholder:text-black/45 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors';

const labelClass = 'block text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-2';

/* ─────────────────────────────────────────────
   Lead form
───────────────────────────────────────────── */
function LeadForm({ id }: { id?: string }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Honeypot — hidden from people, filled in by naive bots. The API drops any
     submission carrying a value here. */
  const [company, setCompany] = useState('');

  /* Whatever the ad appended to the URL, forwarded with the lead so the studio
     can tell which campaign paid for it. Read once on mount: wouter rewrites
     the path on navigation but the query string is the one the visitor landed
     with, and that is the one worth recording. */
  const source = useMemo(
    () => (typeof window === 'undefined' ? '' : window.location.search.replace(/^\?/, '')),
    [],
  );

  const set = (field: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  /* `type="tel"` only picks the on-screen keyboard — it accepts any character
     typed into it, so the value is filtered here. Doing it on change rather
     than on keypress cleans up pastes and autofill too. A leading + survives so
     a number can still be given as +91…; 15 digits is E.164's maximum. */
  const updatePhone = (raw: string) => {
    const plus = raw.trimStart().startsWith('+') ? '+' : '';
    setForm((f) => ({ ...f, phone: plus + raw.replace(/\D/g, '').slice(0, 15) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!form.name || !form.phone) return;

    setSending(true);
    setError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, company, source }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Something went wrong. Please try again.');
      }

      /* Cleared only once the mail is actually away — wiping the fields on a
         failed send would make the visitor retype the lot. */
      setForm(EMPTY_FORM);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div
        id={id}
        className="bg-white border border-accent rounded-2xl p-8 sm:p-10 text-center shadow-[0_18px_50px_-24px_rgba(42,36,32,0.35)]"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
          <Check size={22} className="text-accent" strokeWidth={2} />
        </div>
        <p className="font-sans text-[22px] font-light text-ink mb-2">Thank you, we have your details.</p>
        <p className="text-[14px] leading-relaxed text-black/65 mb-6">
          One of our designers will call you shortly. If you would rather not wait, message us directly.
        </p>
        <a
          href={WHATSAPP_URL(WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase border border-accent text-accent rounded-full py-3 px-8 hover:bg-accent hover:text-white transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      /* h-full lets the card fill the hero's right column so its foot lines up
         with the copy beside it; in the closing section the parent has no fixed
         height, so it simply sizes to its content there. */
      className="bg-white border border-accent rounded-2xl p-6 sm:p-8 w-full h-full flex flex-col justify-center shadow-[0_18px_50px_-24px_rgba(42,36,32,0.35)]"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Name*</label>
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone*</label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            placeholder="10-digit mobile"
            value={form.phone}
            onChange={(e) => updatePhone(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email (optional)</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set('email')(e.target.value)}
            className={fieldClass}
          />
        </div>

        {/* Honeypot — parked off-screen rather than display:none, since some
            bots skip fields they can see are hidden. Never announced to
            assistive tech, never focusable by keyboard. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="absolute left-[-9999px] w-px h-px opacity-0"
        />

        {error && (
          <p role="alert" className="text-[13px] text-accent leading-relaxed">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-white text-accent font-semibold text-[13px] tracking-[0.24em] uppercase rounded-full py-5 mt-2 border border-accent hover:bg-accent hover:text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-accent"
        >
          {sending ? 'Sending…' : 'Submit'}
        </button>

      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function InteriorsLandingPage() {
  const [lightbox, setLightbox] = useState<{ img: string; title: string; meta: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const barSlotRef = useRef<HTMLDivElement>(null);

  /* True once the bar's resting place above the footer has fully come into
     view, at which point the bar stops following the screen and sits there. */
  const [barParked, setBarParked] = useState(false);

  /* The sticky call bar is a stand-in for the form, so it has no business
     covering the bottom of the screen while the real form is still on it.
     Starts true so the bar is down on first paint — the form is the first
     thing under the header, and a bar sliding away as the page loads would be
     the first movement a visitor sees. */
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
    const element = formRef.current;
    /* No IntersectionObserver means the bar simply stays as it started, which
       is the form-visible state — never a bar stuck over the page. */
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      /* A sliver counts as visible: by the time the last field has gone past
         the top of the screen the visitor has left the form behind, and that
         is the moment the bar earns its place. */
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

  const canonical = `${SITE_URL}${INTERIORS_LANDING_PATH}`;

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
      </Helmet>

      {/* ── Minimal header. The logo is the only link, and it goes to the home
          page in this same tab, as a site logo is expected to. ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={logo} alt={`${SITE_NAME} logo`} className="w-8 sm:w-9 h-auto" />
            <span
              className="text-[13px] sm:text-[15px] tracking-tight whitespace-nowrap"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#A5342C' }}
            >
              ROAR ARCHITECTS
            </span>
          </Link>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="scroll-mt-[64px] bg-white border-b border-line">
        {/* Two rows on a wide screen: the heading takes the first, the copy the
            second, and the form spans both down the other column. Putting the
            heading in the grid rather than above it is what lines its top edge
            up with the top of the form.

            On one column the explicit placements drop away and `order` takes
            over, so the reading order becomes heading, form, copy — the form
            still lands directly under the heading, where a phone visitor meets
            it first. */}
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_1fr] gap-x-8 lg:gap-x-14 gap-y-5 sm:gap-y-6 items-stretch">
          {/* Same treatment as the home page's "Get In Touch", down to the clamp
              and the weight — see components/CTA.tsx. It doubles as the page's
              <h1>, which went missing when the old headline came off. */}
          <h1 className="order-1 lg:col-start-1 lg:row-start-1 text-[clamp(28px,8vw,38px)] font-sans font-light leading-none tracking-[-0.02em] text-accent">
            Get In Touch
          </h1>

          {/* Left — the pitch */}
          <div className="order-3 lg:col-start-1 lg:row-start-2">
            <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] text-black/70 max-w-[470px] mb-5">
              Full homes, modular kitchens and wardrobes across Hyderabad. We plan the space the way
              we plan a building, with light, storage and circulation settled first and finishes
              after. Then we price it line by line and build it ourselves.
            </p>

            <ul className="flex flex-col gap-2.5 mb-7">
              {[
                'Brief the architect who designs your home, not a salesperson',
                'Layouts and materials signed off before anything is ordered',
                'Itemised estimates with every unit, finish and fitting priced',
                'One team from the first drawing to handover',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[13px] leading-snug text-black/75">
                  <Check size={15} strokeWidth={2.2} className="text-accent mt-[2px] flex-none" />
                  {point}
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
          <div ref={formRef} className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex">
            <LeadForm id="enquiry" />
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <h2 className="font-sans text-[clamp(17px,3.2vw,26px)] tracking-[0.26em] uppercase text-accent">
                Our work
              </h2>
            </div>
            <Link
              href="/gallery/interiors"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink border-b border-accent pb-1 hover:text-accent transition-colors"
            >
              See all projects <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        {/* A plain responsive grid rather than the mosaic the gallery pages use:
            on a landing page every tile should read at a glance, and the mosaic's
            mixed spans make some of them thumbnails. */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {GALLERY.map((item, index) => (
            <FadeIn
              key={item.title}
              delay={Math.min(index, 5) * 0.05}
              yOffset={18}
              className={index >= TILES_ON_PHONE ? 'hidden lg:block' : undefined}
            >
              <button
                type="button"
                onClick={() => setLightbox(item)}
                className="group relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-secondary-bg block text-left"
              >
                <img
                  src={item.img}
                  alt={`${item.title} — ${item.meta} by ${SITE_NAME}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <span className="absolute left-3 right-3 bottom-3 text-white">
                  <span className="block text-[12px] sm:text-[13px] leading-tight">{item.title}</span>
                  <span className="block text-[9px] sm:text-[10px] tracking-[0.16em] uppercase opacity-75 mt-1">
                    {item.meta}
                  </span>
                </span>
              </button>
            </FadeIn>
          ))}
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

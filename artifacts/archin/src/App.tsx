import React, { useEffect, useState } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { PageTransition } from './components/PageTransition';
import { About } from './components/About';
import { Statement } from './components/Statement';
import { WorkGrid } from './components/WorkGrid';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { SiteHeader } from './components/SiteHeader';
import { FloatingSocialIcons } from './components/FloatingSocialIcons';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import TeamPage from './pages/TeamPage';
import { SITE_URL } from './lib/siteConfig';
import housePlan from '@assets/house-plan.png';
import logo from '@/assets/logo/logo.png';
import floorPlanIcon from '@/assets/icons/floor-plan.png';
import foundationIcon from '@/assets/icons/foundation.png';
import structureIcon from '@/assets/icons/structure.png';
import fenestrationIcon from '@/assets/icons/fenestration.png';
import facadeIcon from '@/assets/icons/facade.png';
import detailingIcon from '@/assets/icons/detailing.png';

/* ─────────────────────────────────────────────
   Bottom-bar icons
───────────────────────────────────────────── */
const BOTTOM_ITEMS = [
  { label: 'FLOOR PLAN',   icon: floorPlanIcon   },
  { label: 'FOUNDATION',   icon: foundationIcon  },
  { label: 'STRUCTURE',    icon: structureIcon   },
  { label: 'FENESTRATION', icon: fenestrationIcon},
  { label: 'FACADE',       icon: facadeIcon      },
  { label: 'DETAILING',    icon: detailingIcon   },
];

/* Repeat the item list several times per track so a single track is always
   wider than the viewport — otherwise the marquee runs out of content and
   visibly jumps instead of circling continuously. */
const BOTTOM_ITEMS_REPEATED = Array(4).fill(BOTTOM_ITEMS).flat();

function BottomBarTrack() {
  return (
    <div className="flex items-center flex-none animate-[heroBottomBarScroll_52s_linear_infinite]">
      {BOTTOM_ITEMS_REPEATED.map((item, idx) => (
        <div key={`${item.label}-${idx}`} className="flex items-center flex-none">
          <div className="flex items-center gap-2 group cursor-pointer px-6 flex-none">
            <img
              src={item.icon}
              alt=""
              className="w-7 h-7 object-contain opacity-55 group-hover:opacity-85 transition-opacity flex-none"
            />
            <span className="font-sans text-[11px] tracking-[0.1em] text-[#2a2420]/65 group-hover:text-[#2a2420] transition-colors whitespace-nowrap">
              {item.label}
            </span>
          </div>
          <span className="text-[#2a2420]/25 text-base select-none flex-none">/</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Live stat counters
───────────────────────────────────────────── */
const STATS = [
  { value: 250, suffix: '+', label: 'PROJECTS'  },
  { value: 3,   suffix: '+', label: 'COUNTRIES' },
  { value: 7,   suffix: '+', label: 'CITIES'    },
  { value: 7,   suffix: '+', label: 'YEARS'     },
];

/* PageTransition holds the arc/loading cover for ~1950ms (800ms hold + 1150ms wipe) — wait for it to clear before counting up. */
const COUNT_UP_START_DELAY_MS = 2000;

function useCountUp(target: number, durationMs = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf: number;
    let cancelled = false;

    const delayTimer = setTimeout(() => {
      if (cancelled) return;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    }, COUNT_UP_START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  return count;
}

function StatItem({ value, suffix, label, bordered }: { value: number; suffix: string; label: string; bordered: boolean }) {
  const count = useCountUp(value);
  return (
    <div className={`flex flex-col py-4 pr-5 ${bordered ? 'border-l border-[rgba(42,36,32,0.12)] pl-5' : ''}`}>
      <span className="hero-stat-value font-sans font-normal leading-none text-[#18140f]">
        {count}{suffix}
      </span>
      <span className="font-sans text-[9px] tracking-[0.22em] text-black mt-1.5 uppercase">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section id="top" className="hero-section flex flex-col" style={{ minHeight: 'calc(81vh - 53px)' }}>

      {/* ── Main content area ── */}
      <div className="relative flex flex-1">

        {/* Left edge: vertical label */}
        <div className="hidden xl:flex items-center justify-center w-11 flex-none border-r border-[rgba(42,36,32,0.1)] py-8 select-none">
          <span className="hero-vert-label font-sans text-[9px] tracking-[0.3em] text-[#2a2420] opacity-40 uppercase whitespace-nowrap">
            SHAPED BY PURPOSE &nbsp;/&nbsp; BUILT TO LAST.
          </span>
        </div>

        {/* Two-column layout: headline + sketch stacked on the left, ROAR brand on the right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] items-center px-5 sm:px-8 lg:px-10 py-6 gap-x-6 gap-y-10">

          {/* ── Left: headline + body, with sketch below ── */}
          <div className="flex flex-col justify-center z-10 sm:pr-4 order-2 lg:order-1 lg:translate-x-8">
            <p className="font-sans text-[11px] tracking-[0.28em] text-[#2a2420] opacity-55 uppercase mb-2">
              Designing Spaces That
            </p>
            <h1 className="hero-headline font-sans font-normal leading-[0.88] tracking-[-0.02em] text-[#18140f] mb-3">
              INSPIRE.
              <span className="sr-only"> — Architects in Hyderabad, designing across Hyderabad and Visakhapatnam</span>
            </h1>
            <div className="w-8 h-[2px] bg-[#18140f] mb-4" />
            <p className="font-sans font-light text-[13px] leading-[1.75] text-[#2a2420] opacity-65 max-w-[230px] mb-5">
              We believe great architecture goes beyond structures&nbsp;— it shapes
              experiences and leaves a lasting impact.
            </p>
            <a
              href="#work"
              className="hero-cta inline-flex items-center gap-2 font-sans font-semibold text-[12px] tracking-[0.16em] uppercase text-[#18140f] w-fit hover:text-[#9b3a2c] transition-colors duration-200 mb-5"
            >
              Explore Our Work &nbsp;→
            </a>

            {/* ── Architectural sketch, below the headline ── */}
            <div className="relative flex items-end justify-start h-full min-h-[200px]">
              {/* Blueprint annotation — ELEVATION A */}
              <div className="absolute top-2 right-6 flex items-center gap-2 pointer-events-none select-none">
                <span className="font-sans text-[9px] tracking-[0.22em] text-[#2a2420] opacity-35 uppercase">ELEVATION A</span>
                <span className="block w-10 h-px bg-[#2a2420] opacity-25" />
              </div>
              {/* Blueprint annotation — SCALE */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none select-none">
                <span className="font-sans text-[9px] tracking-[0.22em] text-[#2a2420] opacity-35 uppercase">SCALE 1:100</span>
              </div>
              {/* Blueprint annotation — coordinates */}
              <div className="absolute bottom-8 left-2 pointer-events-none select-none">
                <span className="font-mono text-[9px] text-[#2a2420] opacity-30">23°02'N, 72°34'E</span>
              </div>

              <img
                src={housePlan}
                alt="Architectural sketch of a modern house"
                className="w-full max-w-[260px] sm:max-w-[380px] md:max-w-[520px] lg:max-w-[640px] object-contain select-none sm:translate-x-6 md:translate-x-14 lg:translate-x-24 md:-translate-y-4 lg:-translate-y-6"
                style={{ filter: 'drop-shadow(0 6px 28px rgba(0,0,0,0.05))' }}
              />
            </div>
          </div>

          {/* ── Right: ROAR brand + stats, nudged left ── */}
          <div className="flex flex-col justify-center sm:pl-6 lg:pl-8 order-1 lg:order-3 lg:translate-x-6">

            {/* Logo + name */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5">
              <img src={logo} alt="ROAR Architects logo" className="w-12 sm:w-16 lg:w-[92px] h-auto flex-none" />
              <p
                className="hero-roar-name leading-tight sm:leading-none tracking-[-0.01em] sm:whitespace-nowrap"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#A5342C' }}
              >
                ROAR ARCHITECTS
              </p>
            </div>

            {/* Thin divider */}
            <div className="w-10 h-px bg-[#2a2420] opacity-20 mb-5" />

            {/* Services */}
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {['RESIDENTIAL', 'COMMERCIAL', 'HOSPITALITY'].map(s => (
                  <span key={s} className="font-sans text-[10px] tracking-[0.18em] text-black">
                    {s}
                  </span>
                ))}
              </div>
              <p className="font-sans text-[10px] tracking-[0.22em] text-black uppercase whitespace-nowrap">
                Since 2016
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-stretch justify-between border-t border-[rgba(42,36,32,0.12)] mt-6">
              {STATS.map((stat, i) => (
                <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} bordered={i > 0} />
              ))}
            </div>
          </div>
        </div>

        {/* Right edge: SCROLL */}
        <div className="hidden xl:flex flex-col items-center justify-end w-11 flex-none border-l border-[rgba(42,36,32,0.1)] pb-6 select-none">
          <span className="hero-vert-scroll font-sans text-[9px] tracking-[0.32em] text-[#2a2420] opacity-35 uppercase mb-2">
            SCROLL
          </span>
          <span className="text-[#2a2420] opacity-30 text-sm leading-none">↓</span>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="hero-bottom-bar flex items-center bg-white h-[66px] px-4 border-t border-b border-[rgba(42,36,32,0.15)] flex-none">
        <button className="text-[#2a2420]/45 text-base px-3 hover:text-[#2a2420]/75 transition-colors flex-none">
          ←
        </button>
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max">
            <BottomBarTrack />
            <BottomBarTrack />
          </div>
        </div>
        <button className="text-[#2a2420]/45 text-base px-3 hover:text-[#2a2420]/75 transition-colors flex-none">
          →
        </button>
      </div>

      <style>{`
        @keyframes heroBottomBarScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Page layouts
───────────────────────────────────────────── */
function Home() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    }, 50);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-background">
      <Helmet>
        <title>ROAR Architects | Architecture Studio in Hyderabad</title>
        <meta name="description" content="ROAR Architects is a Hyderabad-based architecture and interior design studio, with an active studio in Visakhapatnam." />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ROAR Architects | Architecture Studio in Hyderabad" />
        <meta property="og:description" content="ROAR Architects is a Hyderabad-based architecture and interior design studio, with an active studio in Visakhapatnam." />
        <meta property="og:url" content={SITE_URL} />
      </Helmet>

      <PageTransition />
      <SiteHeader />

      <main>
        <HeroSection />

        <About />

        <Statement
          quote="We design buildings that belong to their site and their climate — creating timeless spaces that remain as relevant in fifty years as on the day of handover."
        />

        <WorkGrid />

        <Statement
          kicker="Our Philosophy"
          quote="Architecture is not about form, but about the life that happens within it."
        />

        <CTA />
      </main>

      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/team" component={TeamPage} />
      <Route path="/gallery/:slug" component={GalleryPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-background text-ink">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4">404</h1>
            <a href="/" className="text-[11px] tracking-[0.2em] border-b border-accent pb-1">
              RETURN HOME
            </a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
      <FloatingSocialIcons />
    </WouterRouter>
  );
}

export default App;

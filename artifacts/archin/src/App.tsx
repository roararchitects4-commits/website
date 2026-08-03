import React, { useEffect, useState } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { PageTransition } from './components/PageTransition';
import { About } from './components/About';
import { Statement } from './components/Statement';
import { WorkGrid } from './components/WorkGrid';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import housePlan from '@assets/house-plan.png';
import logo from '@/assets/logo.png';

/* ─────────────────────────────────────────────
   Navigation links
───────────────────────────────────────────── */
const NAV_LINKS = [
  { name: 'HOME',     href: '#top'     },
  { name: 'OUR WORK', href: '#work'    },
  { name: 'ABOUT US', href: '#studio'  },
  { name: 'CONTACT',  href: '#contact' },
];

/* ─────────────────────────────────────────────
   Bottom-bar SVG icons
───────────────────────────────────────────── */
const FloorPlanIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <rect x="3" y="3" width="26" height="26" />
    <line x1="3"  y1="17" x2="14" y2="17" />
    <line x1="14" y1="3"  x2="14" y2="17" />
    <line x1="20" y1="17" x2="29" y2="17" />
    <line x1="20" y1="17" x2="20" y2="29" />
  </svg>
);

const FoundationIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <rect x="12" y="3" width="8" height="13" />
    <polyline points="3,29 3,22 12,16 20,16 29,22 29,29" />
    <line x1="3" y1="29" x2="29" y2="29" />
  </svg>
);

const StructureIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <rect x="4" y="12" width="17" height="17" />
    <rect x="11" y="3"  width="17" height="17" />
    <line x1="4"  y1="12" x2="11" y2="3"  />
    <line x1="21" y1="12" x2="28" y2="3"  />
    <line x1="21" y1="29" x2="28" y2="20" />
  </svg>
);

const FenestrationIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <rect x="4" y="5" width="24" height="22" />
    <line x1="16" y1="5"  x2="16" y2="27" />
    <line x1="4"  y1="16" x2="28" y2="16" />
    <line x1="10" y1="5"  x2="10" y2="16" />
    <line x1="22" y1="5"  x2="22" y2="16" />
  </svg>
);

const FacadeIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <polygon points="4,13 16,4 28,13" />
    <rect x="4"  y="13" width="24" height="16" />
    <rect x="7"  y="16" width="5"  height="5"  />
    <rect x="20" y="16" width="5"  height="5"  />
    <rect x="13" y="19" width="6"  height="10" />
  </svg>
);

const DetailingIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <polygon points="16,3 29,13 3,13" />
    <rect x="5"  y="13" width="22" height="16" />
    <rect x="12" y="17" width="8"  height="12" />
    <line x1="3"  y1="13" x2="1"  y2="11" />
    <line x1="29" y1="13" x2="31" y2="11" />
    <line x1="5"  y1="29" x2="5"  y2="32" />
    <line x1="27" y1="29" x2="27" y2="32" />
  </svg>
);

const BOTTOM_ITEMS = [
  { label: 'FLOOR PLAN',   Icon: FloorPlanIcon   },
  { label: 'FOUNDATION',   Icon: FoundationIcon  },
  { label: 'STRUCTURE',    Icon: StructureIcon   },
  { label: 'FENESTRATION', Icon: FenestrationIcon},
  { label: 'FACADE',       Icon: FacadeIcon      },
  { label: 'DETAILING',    Icon: DetailingIcon   },
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
            <div className="w-6 h-6 text-white/55 group-hover:text-white/85 transition-colors flex-none">
              <item.Icon />
            </div>
            <span className="font-sans text-[11px] tracking-[0.1em] text-white/65 group-hover:text-white transition-colors whitespace-nowrap">
              {item.label}
            </span>
          </div>
          <span className="text-white/25 text-base select-none flex-none">/</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Live stat counters
───────────────────────────────────────────── */
const STATS = [
  { value: 120, suffix: '+', label: 'PROJECTS' },
  { value: 12,  suffix: '',  label: 'YEARS'    },
  { value: 4,   suffix: '',  label: 'CITIES'   },
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
      <span className="hero-stat-value font-sans font-black leading-none text-[#18140f]">
        {count}{suffix}
      </span>
      <span className="font-sans text-[9px] tracking-[0.22em] text-[#2a2420] opacity-45 mt-1.5 uppercase">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Header
───────────────────────────────────────────── */
function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="site-header sticky top-0 z-50 flex items-center justify-between px-8 py-[14px] border-b border-[rgba(42,36,32,0.15)]">
      <nav className="flex items-center gap-8">
        {NAV_LINKS.map(link => (
          <a
            key={link.name}
            href={link.href}
            className="font-sans font-bold text-[13px] tracking-[0.13em] text-[#2a2420] hover:text-[#9b3a2c] transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div className="relative h-6 flex items-center min-w-[220px] justify-end">
        <a
          href="#top"
          className={`flex items-center gap-3 absolute right-0 transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img src={logo} alt="" className="w-6 h-auto flex-none" aria-hidden="true" />
          <span className="font-sans font-extrabold text-lg tracking-tight text-[#18140f]">
            ROAR <span className="font-light">ARCHITECTS</span>
          </span>
        </a>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section id="top" className="hero-section flex flex-col" style={{ minHeight: 'calc(100vh - 53px)' }}>

      {/* ── Main content area ── */}
      <div className="flex flex-1">

        {/* Left edge: vertical label */}
        <div className="hidden xl:flex items-center justify-center w-11 flex-none border-r border-[rgba(42,36,32,0.1)] py-8 select-none">
          <span className="hero-vert-label font-sans text-[9px] tracking-[0.3em] text-[#2a2420] opacity-40 uppercase whitespace-nowrap">
            SHAPED BY PURPOSE &nbsp;/&nbsp; BUILT TO LAST.
          </span>
        </div>

        {/* Three-column grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(220px,330px)_1fr_minmax(260px,340px)] items-center px-8 lg:px-10 py-10 gap-x-0">

          {/* ── Left: headline + body ── */}
          <div className="flex flex-col justify-center z-10 pl-6 lg:pl-8 order-3">
            <p className="font-sans text-[11px] tracking-[0.28em] text-[#2a2420] opacity-55 uppercase mb-3">
              Designing Spaces That
            </p>
            <h1 className="hero-headline font-sans font-black leading-[0.88] tracking-[-0.02em] text-[#18140f] mb-4">
              INSPIRE.
            </h1>
            <div className="w-8 h-[2px] bg-[#18140f] mb-5" />
            <p className="font-sans font-light text-[13px] leading-[1.75] text-[#2a2420] opacity-65 max-w-[230px] mb-8">
              We believe great architecture goes beyond structures&nbsp;— it shapes
              experiences and leaves a lasting impact.
            </p>
            <a
              href="#work"
              className="hero-cta inline-flex items-center gap-2 font-sans font-semibold text-[12px] tracking-[0.16em] uppercase text-[#18140f] w-fit hover:text-[#9b3a2c] transition-colors duration-200"
            >
              Explore Our Work &nbsp;→
            </a>
          </div>

          {/* ── Center: architectural sketch ── */}
          <div className="relative flex items-end justify-center h-full min-h-[360px] py-4 order-2">
            {/* Blueprint annotation — ELEVATION A */}
            <div className="absolute top-8 right-6 flex items-center gap-2 pointer-events-none select-none">
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
              className="w-full max-w-[640px] lg:max-w-[780px] object-contain select-none translate-x-6 md:translate-x-12 -translate-y-6 md:-translate-y-10"
              style={{ filter: 'drop-shadow(0 6px 28px rgba(0,0,0,0.05))' }}
            />
          </div>

          {/* ── Right: ROAR brand + stats ── */}
          <div className="flex flex-col justify-center pr-4 order-1">

            {/* Logo + name */}
            <div className="flex items-center gap-4 mb-5">
              <img src={logo} alt="ROAR Architects logo" className="w-14 lg:w-[68px] h-auto flex-none" />
              <div className="leading-none">
                <p className="hero-roar-name font-sans font-black leading-none tracking-[-0.02em] text-[#18140f]">
                  ROAR
                </p>
                <p className="font-sans font-semibold text-[11px] tracking-[0.38em] text-[#9b3a2c] mt-[5px]">
                  ARCHITECTS
                </p>
              </div>
            </div>

            {/* Thin divider */}
            <div className="w-10 h-px bg-[#2a2420] opacity-20 mb-5" />

            {/* Services */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
              {['RESIDENTIAL', 'COMMERCIAL', 'HOSPITALITY'].map(s => (
                <span key={s} className="font-sans text-[10px] tracking-[0.18em] text-[#2a2420] opacity-55">
                  {s}
                </span>
              ))}
            </div>
            <p className="font-sans text-[10px] tracking-[0.22em] text-[#2a2420] opacity-40 mb-6 uppercase">
              Since 2018
            </p>

            {/* Stats */}
            <div className="flex items-stretch border-t border-[rgba(42,36,32,0.12)]">
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

      {/* ── Bottom dark bar ── */}
      <div className="hero-bottom-bar flex items-center bg-[#1b1714] h-[66px] px-4 border-t border-white/5 flex-none">
        <button className="text-white/45 text-base px-3 hover:text-white/75 transition-colors flex-none">
          ←
        </button>
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max">
            <BottomBarTrack />
            <BottomBarTrack />
          </div>
        </div>
        <button className="text-white/45 text-base px-3 hover:text-white/75 transition-colors flex-none">
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
  return (
    <div className="relative bg-background">
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
    </WouterRouter>
  );
}

export default App;

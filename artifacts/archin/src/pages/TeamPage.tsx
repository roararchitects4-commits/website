import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { TypewriterText } from '../components/TypewriterText';
import { SITE_URL } from '../lib/siteConfig';

import rohithaPhoto from '@assets/aboutusimage.jpeg';
import team1 from '@assets/team1.jpeg';
import team2 from '@assets/team2.jpeg';
import saiKiranPhoto from '@assets/MD.jpeg';


interface TeamMember {
  /* Empty name = slot still waiting on the real person's details. */
  name: string;
  designation: string;
  photo?: string;
}

/* Both leaders are confirmed and match the founder block on the home page. The
   two headshots in TEAM_MEMBERS are photographs of real people, so they carry no
   invented name or bio — fill in `name` and `designation` before this page goes
   live. Empty entries render the silhouette placeholder; swap in a `photo` and
   details as each one arrives. */
const LEADERSHIP: (TeamMember & { bio: string[] })[] = [
    {
    name: 'Sai Kiran',
    designation: 'Managing Director',
    photo: saiKiranPhoto,
    bio: [
      'Leads the overall business strategy, operations, and client relationships at ROAR — with a focus on growth and execution, so every project is delivered with excellence and integrity.',
    ],
  },
  {
    name: 'Rohitha Surya',
    designation: 'Founder & Principal Architect',
    photo: rohithaPhoto,
    bio: [
      'Leads ROAR from Hyderabad, with an active studio in Visakhapatnam — homes, villas, commercial and hospitality projects, concept through execution.',
    ],
  },

];

const TEAM_MEMBERS: TeamMember[] = [
  { name: '', designation: '', photo: team1 },
  { name: '', designation: '', photo: team2 },
  { name: '', designation: '' },
  { name: '', designation: '' },
  { name: '', designation: '' },
  { name: '', designation: '' },
];

/* Fine grain over the off-white, so the page reads as a textured surface rather
   than flat fill. Fills whatever it is dropped into — here, the team section —
   and never intercepts clicks or reaches assistive tech. */
function TeamBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-[0.045] mix-blend-multiply">
        <filter id="team-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#team-grain)" />
      </svg>
    </div>
  );
}

/* Stand-in for a headshot not supplied yet — head and shoulders in the ink of
   the site palette, on the same warm grey the photo frames use. */
function SilhouettePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 125"
      className="w-full h-full"
      role="img"
      aria-label="Photograph to be added"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100" height="125" className="fill-secondary-bg" />
      <g fill="hsl(var(--ink))" opacity="0.85">
        <ellipse cx="50" cy="48" rx="20" ry="24" />
        <path d="M50 74c-19 0-33 12-33 27v24h66V101c0-15-14-27-33-27z" />
      </g>
    </svg>
  );
}

export default function TeamPage() {
  /* Watched instead of the cards themselves: each card starts parked off the
     side of the viewport, so an observer on the card could never see it arrive
     and the entrance would never fire. The row wrapper stays put, so it is the
     one thing that can report "this row has been scrolled to". */
  const rowsRef = React.useRef<HTMLDivElement | null>(null);
  const rowsInView = useInView(rowsRef, { once: true, amount: 0.15 });

  return (
    /* Off-white throughout — the site's own --background (#FBF8F4), so the page
       stays warm rather than the flat white the sections used before. */
    <div className="relative bg-background min-h-screen flex flex-col">
      <Helmet>
        <title>Team | ROAR Architects</title>
        <meta
          name="description"
          content="Meet the architects and designers behind ROAR Architects, a Hyderabad-based design studio with an active studio in Visakhapatnam."
        />
        <link rel="canonical" href={`${SITE_URL}/team`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Team | ROAR Architects" />
        <meta property="og:url" content={`${SITE_URL}/team`} />
      </Helmet>

      <SiteHeader />

      {/* Backdrop is bounded by <main>, so it stops where the team section
          ends rather than carrying on behind the footer. Content after it is
          lifted above by its own relative positioning. */}
      <main className="relative flex-1 isolate">
        <TeamBackdrop />

        <section className="relative z-10 px-[max(22px,5vw)] pt-3 pb-2">
          <div className="max-w-[1680px] mx-auto">
            <p className="font-sans text-[10px] tracking-[0.28em] text-muted uppercase mb-0.5">
              The People Behind ROAR
            </p>
            <h1 className="font-serif font-light text-[clamp(24px,3.2vw,38px)] text-ink mb-0 leading-[1.05]">
              Team
            </h1>
            <p className="text-[12px] text-muted max-w-md mt-1">
              The architects and designers shaping every ROAR project, from first sketch to handover.
            </p>
          </div>
        </section>

        {/* Clipped so the off-screen start of the slide-in never opens a
            horizontal scrollbar. */}
        {/* Cards are sized off the viewport width and the page is meant to be
            scrolled — the rows below the fold animate in as they are reached. */}
        <section className="relative z-10 px-[max(22px,5vw)] pb-8 md:pb-10 overflow-x-hidden">
          <div className="max-w-[1240px] mx-auto">
            {/* Leadership row — founder and MD side by side, each reading photo
                → name → designation → bio from top to bottom. Each card slides
                in from its own side of the viewport and eases to a stop. */}
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 items-start">
              {LEADERSHIP.map((member, idx) => (
                /* Card widths track the viewport so the two rows keep their
                   proportions from a laptop up to a wide monitor. */
                <article
                  key={member.designation}
                  className="flex flex-col items-center text-center"
                >
                  {/* Portrait frame — these are headshots, so a landscape crop
                      would cut the face off. */}
                  <motion.div
                    initial={{ x: idx === 0 ? '-70vw' : '70vw', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-[4/5] w-[clamp(220px,24vw,360px)] overflow-hidden rounded-[1.5rem] bg-secondary-bg shadow-xl will-change-transform"
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <SilhouettePlaceholder />
                    )}
                  </motion.div>

                  <h2 className="font-serif font-light text-[clamp(20px,2.4vw,28px)] text-ink mt-5 leading-tight">
                    {member.name || <span className="text-muted/50">Name to be added</span>}
                  </h2>
                  <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-accent mt-2">
                    {member.designation}
                  </p>

                  {/* One continuous pass like the home page, rather than a
                      separate typewriter per line. The blank lines survive via
                      the component's pre-wrap. min-h reserves the finished
                      height so the grid below doesn't shift as it types. */}
                  {member.bio.length > 0 && (
                    <TypewriterText
                      tag="div"
                      className="mt-3 max-w-[42ch] font-sans text-[13px] leading-relaxed text-muted min-h-[64px]"
                      text={member.bio.join('\n\n')}
                      speed={9}
                      delay={900 + idx * 250}
                    />
                  )}
                </article>
              ))}
            </div>

            {/* The rest of the studio, three across — filled photos and
                silhouette placeholders share one rhythm. */}
            <div ref={rowsRef} className="mt-6 grid grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-10">
              {TEAM_MEMBERS.map((member, idx) => (
                <motion.article
                  key={idx}
                  /* Slides in from whichever edge of the screen it sits nearest
                     — left column from the left, right column from the right,
                     centre column straight up — once the grid is scrolled to. */
                  initial={{
                    x: idx % 3 === 0 ? '-60vw' : idx % 3 === 2 ? '60vw' : 0,
                    y: idx % 3 === 1 ? 44 : 0,
                    opacity: 0,
                  }}
                  animate={rowsInView ? { x: 0, y: 0, opacity: 1 } : undefined}
                  transition={{
                    duration: 1.1,
                    delay: Math.floor(idx / 3) * 0.18 + (idx % 3) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="aspect-[4/5] w-[clamp(150px,16vw,255px)] overflow-hidden rounded-[1.1rem] bg-secondary-bg shadow-lg">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name || 'ROAR Architects team member'}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <SilhouettePlaceholder />
                    )}
                  </div>

                  <h2 className="font-serif font-light text-[clamp(16px,1.9vw,21px)] text-ink mt-4 leading-tight">
                    {member.name || <span className="text-muted/50">Name to be added</span>}
                  </h2>
                  <p className="font-sans text-[10px] tracking-[0.22em] uppercase mt-1.5 text-accent">
                    {member.designation || <span className="text-muted/50">Role to be added</span>}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { TypewriterText } from '../components/TypewriterText';
import { SITE_URL } from '../lib/siteConfig';

import team1 from '@assets/team1.jpeg';
import team2 from '@assets/team2.jpeg';

/* PHOTOS ARE REAL — NAMES AND BIOS ARE NOT.
   The two headshots below are photographs of actual people, but `name` and
   `bio` are still the invented placeholders this page shipped with. Publishing
   as-is would attribute a fabricated identity and career to a real person.
   Replace both before this page goes live. */
const TEAM_MEMBERS = [
  {
    name: 'Arjun Mehta',
    designation: 'Senior Architect',
    photo: team1,
    bio: [
      'Arjun leads design direction across every ROAR project, translating client briefs into spaces that are both functional and expressive.',
      'With a background in sustainable design, he brings a climate-conscious lens to residential and commercial work alike.',
      'He oversees concept development, structural coordination, and on-site execution from first sketch to final handover.',
      'Arjun believes good architecture should feel inevitable — as if the building could not have existed any other way.',
      'Outside the studio, he mentors young architects and writes about design practice in South Indian cities.',
    ],
  },
  {
    name: 'Ananya Kapoor',
    designation: 'Senior Architect',
    photo: team2,
    bio: [
      'Ananya shapes the interior language of every ROAR project, balancing material honesty with warmth and comfort.',
      'She works closely with clients to understand how they actually live, then designs spaces around those everyday rituals.',
      'Her portfolio spans boutique hospitality interiors, residential villas, and adaptive reuse projects across Hyderabad and Visakhapatnam.',
      'Ananya has a particular interest in natural materials, filtered light, and furniture designed to age well.',
      "She leads the studio's design reviews, ensuring every detail is considered before a project reaches site.",
    ],
  },
];

export default function TeamPage() {
  return (
    /* Off-white throughout — the site's own --background (#FBF8F4), so the page
       stays warm rather than the flat white the sections used before. */
    <div className="relative bg-background min-h-screen flex flex-col">
      <Helmet>
        <title>Our Team | ROAR Architects</title>
        <meta
          name="description"
          content="Meet the architects and designers behind ROAR Architects, a Hyderabad-based design studio with an active studio in Visakhapatnam."
        />
        <link rel="canonical" href={`${SITE_URL}/team`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Our Team | ROAR Architects" />
        <meta property="og:url" content={`${SITE_URL}/team`} />
      </Helmet>

      <SiteHeader />

      <main className="flex-1">
        <section className="px-[max(22px,5vw)] pt-6 pb-6">
          <div className="max-w-[1680px] mx-auto">
            <p className="font-sans text-[11px] tracking-[0.28em] text-muted uppercase mb-0.5">
              The People Behind ROAR
            </p>
            <h1 className="font-serif font-light text-[clamp(36px,5vw,64px)] text-ink mb-0 leading-[1.05]">
              Our Team
            </h1>
            <p className="text-[13px] text-muted max-w-md mt-1">
              The architects and designers shaping every ROAR project, from first sketch to handover.
            </p>
          </div>
        </section>

        {/* Each member reads top to bottom — photo, then name, designation and
            bio — so the page runs person 1 in full before person 2 begins. */}
        {/* Clipped so the off-screen start of the slide-in never opens a
            horizontal scrollbar. */}
        <section className="px-[max(22px,5vw)] pb-20 md:pb-28 overflow-x-hidden">
          {/* Both members share one row; each column still reads photo → name →
              designation → bio from top to bottom. */}
          <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-14 lg:gap-x-20 gap-y-16 items-start">
            {TEAM_MEMBERS.map((member, idx) => (
              <article key={member.name}>
                {/* Portrait frame — these are headshots, so a landscape crop
                    would cut the face off. Each slides in from its own side of
                    the viewport on arrival and eases to a stop. */}
                <motion.div
                  initial={{ x: idx === 0 ? '-70vw' : '70vw', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="aspect-[4/5] max-w-[420px] overflow-hidden rounded-[2.5rem] bg-secondary-bg shadow-xl will-change-transform"
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>

                <h2 className="font-serif font-light text-[clamp(24px,3vw,34px)] text-ink mt-7 leading-tight">
                  {member.name}
                </h2>
                <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-accent mt-2">
                  {member.designation}
                </p>

                {/* One continuous pass like the home page, rather than five
                    separate typewriters racing each other. The blank lines
                    survive via the component's pre-wrap. */}
                <TypewriterText
                  tag="div"
                  className="mt-5 max-w-[62ch] font-sans text-[14px] leading-relaxed text-muted min-h-[220px]"
                  text={member.bio.join('\n\n')}
                  speed={9}
                  delay={900 + idx * 250}
                />
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

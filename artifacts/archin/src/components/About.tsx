import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';
import { useScaledDownView, SCALED_VIEW_ENTRANCE_DELAY } from '../hooks/useScaledDownView';
import rohithaImg from '@assets/team/rohitha-surya.jpeg';
import suryaKiranImg from '@assets/team/surya-kiran.jpeg';

/* Stand-in for a portrait not supplied yet, matching the one on the team page. */
function SilhouettePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 111"
      className="h-full w-full"
      role="img"
      aria-label="Photograph to be added"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100" height="111" fill="hsl(var(--secondary-bg))" />
      <g fill="hsl(var(--ink))" opacity="0.85">
        <ellipse cx="50" cy="42" rx="19" ry="23" />
        <path d="M50 67c-18 0-31 11-31 25v19h62V92c0-14-13-25-31-25z" />
      </g>
    </svg>
  );
}

const LEADERS = [
  {
    name: 'Surya Kiran',
    role: 'Managing Director',
    photo: suryaKiranImg as string | undefined,
    imageClass: 'scale-100 hover:scale-[0.97]',
    bio: 'Leads the business strategy, operations, and client relationships at Roar Architects. With a focus on growth and execution, he ensures every project is delivered with excellence and integrity.',
    /* Mirrored tilts: the left card leans up to the right, the right card down. */
    tilt: -4,
    side: 'left' as const,
  },
  {
    name: 'Rohitha Surya',
    role: 'Principal Architect',
    photo: rohithaImg,
    imageClass: 'scale-100 hover:scale-[0.97]',
    bio: 'Leads the design vision and architectural direction at Roar Architects. She believes in creating spaces that are contextual, timeless, and deeply connected to the people who use them.',
    tilt: 5,
    side: 'right' as const,
  },
];

export function About() {
  const [rotate, setRotate] = useState<Record<string, { x: number; y: number }>>({});
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  const rowInView = useInView(rowRef, { once: true, amount: 0.25 });
  const scaledView = useScaledDownView();
  const entranceDelay = scaledView ? SCALED_VIEW_ENTRANCE_DELAY : 0;
  const handleMouseMove = (name: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    /* Touch browsers synthesise a mousemove on tap but never the matching
       mouseleave, so on a phone a tap would tilt the portrait and leave it
       tilted for good. The effect is a cursor affordance — there is no cursor
       to follow on a touch screen, so skip it entirely there. */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const box = e.currentTarget.getBoundingClientRect();
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    setRotate((current) => ({
      ...current,
      [name]: {
        x: ((e.clientY - box.top - centerY) / centerY) * -6,
        y: ((e.clientX - box.left - centerX) / centerX) * 6,
      },
    }));
  };

  const handleMouseLeave = (name: string) => () => {
    setRotate((current) => ({ ...current, [name]: { x: 0, y: 0 } }));
  };

  return (
    /* The 132px top padding is clearance for the statement block, which on
       desktop is pulled up out of the row by -112px into exactly that space.
       Stacked on a phone the statement sits in normal flow and the padding is
       just an empty screen to scroll past. */
    <section id="studio" className="relative overflow-hidden bg-white px-[max(16px,4vw)] pb-[38px] pt-[48px] lg:pt-[132px]">
      <div className="relative z-10 mx-auto w-full max-w-[1780px]">
        {/* text | portrait | statement | portrait | text. The middle column is
            the clearing between the cards, holding the studio line.

            These tracks are over-subscribed on purpose: their widths total more
            than the row can hand out, so grid grows every track equally until
            each hits its cap. The copy and statement columns cap first, and the
            slack they release goes to the two portrait tracks — which is what
            makes the portraits the widest thing in the row. Raising a portrait
            number alone does little; the space has to come off its neighbours —
            here from the statement column and the gutters, so the bios keep
            their measure and the names don't shift further toward the edge. */}
        {/* Below lg the five columns collapse to two, not one: each leader reads
            as portrait on the left and their copy on the right, on a single row.
            The statement spans both columns above them. */}
        <div ref={rowRef} className="about-leaders-row grid grid-cols-2 items-center gap-x-[clamp(12px,3vw,28px)] gap-y-9 lg:gap-x-[clamp(16px,1.6vw,28px)] lg:gap-y-14 lg:grid-cols-[minmax(0,250px)_minmax(0,520px)_minmax(0,190px)_minmax(0,520px)_minmax(0,250px)]">
          {LEADERS.map((leader, idx) => {
            const tilt = rotate[leader.name] ?? { x: 0, y: 0 };
            const onLeft = leader.side === 'left';

            const copy = (
              <FadeIn delay={0.15 + idx * 0.1}>
                {/* Left-aligned at every width now: beside a portrait on a
                    phone, centred copy would read as drifting away from it. */}
                <div className="flex flex-col items-start text-left">
                  {/* Sharing the row with the portrait leaves the copy half a
                      phone wide, so the name and role step down to fit it. */}
                  <h2 className="font-serif text-[clamp(17px,4.6vw,26px)] font-light leading-tight text-ink lg:text-[clamp(32px,3.2vw,47px)] lg:leading-none lg:whitespace-nowrap">
                    {leader.name}
                  </h2>
                  <p className="mt-1.5 font-sans text-[8.5px] font-medium uppercase tracking-[0.14em] text-accent lg:mt-3 lg:text-[12px] lg:tracking-[0.22em]">
                    {leader.role}
                  </p>
                  {/* min-height reserves the finished paragraph's box so the
                      typewriter doesn't shove the layout as it fills — it has to
                      track the type size. */}
                  <TypewriterText
                    tag="p"
                    className="mt-2.5 min-h-0 max-w-full font-sans text-[11px] leading-[1.6] text-black lg:mt-5 lg:min-h-[146px] lg:max-w-[290px] lg:text-[15px] lg:leading-relaxed"
                    text={leader.bio}
                    speed={11}
                    delay={300 + idx * 200}
                  />
                </div>
              </FadeIn>
            );

            const statement = (
              <FadeIn delay={0.3}>
                {/* The statement is the narrowest column — it's the one giving
                    up width to the portraits — so both lines are pinned. Left to
                    wrap they'd break mid-phrase ("THE PEOPLE BEHIND / ROAR"); as
                    single lines they overhang a little into the gutters, which
                    is empty space at this height, above the cards. */}
                <div className="flex flex-col items-center text-center">
                  <p className="whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-ink">
                    The People Behind ROAR
                  </p>
                  <h2 className="mt-6 whitespace-nowrap font-serif text-[clamp(28px,2.85vw,41px)] font-light leading-[0.98] text-accent">
                    Two minds.
                    <br />
                    One vision.
                  </h2>
                </div>
              </FadeIn>
            );

            const portrait = (
              <div className="perspective-1000 flex justify-center lg:-mt-6">
                <motion.div
                  className="w-full max-w-[340px] sm:max-w-[560px]"
                  initial={{
                    opacity: 0,
                    x: onLeft ? '85vw' : '-85vw',
                    rotate: leader.tilt + (onLeft ? 360 : -360),
                  }}
                  animate={rowInView ? { opacity: 1, x: 0, rotate: leader.tilt } : undefined}
                  transition={{
                    duration: 2.2,
                    delay: entranceDelay + 0.15 + idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Entrance lives on the element above and the cursor tilt on
                      this one — a single element can't carry both, because the
                      inline `transform` needed for the tilt overwrites the
                      `rotate` framer-motion is animating. */}
                  <div
                    onMouseMove={handleMouseMove(leader.name)}
                    onMouseLeave={handleMouseLeave(leader.name)}
                    className="relative aspect-[9/10] w-full overflow-hidden rounded-[1.5rem] bg-secondary-bg shadow-2xl transition-transform duration-200 ease-out will-change-transform"
                    style={{
                      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    }}
                    data-cursor="view"
                  >
                    {leader.photo ? (
                      <img
                        src={leader.photo}
                        alt={`${leader.name}, ${leader.role} at ROAR Architects`}
                        className={`h-full w-full object-cover object-top transition-transform duration-1000 ${leader.imageClass}`}
                      />
                    ) : (
                      <SilhouettePlaceholder />
                    )}
                  </div>
                </motion.div>
              </div>
            );

            /* Stacked on mobile each person reads portrait then name; on
               desktop the order utilities lay the five columns out. */
            return onLeft ? (
              <React.Fragment key={leader.name}>
                <div className="order-2 lg:order-1">{copy}</div>
                <div className="order-1 lg:order-2">{portrait}</div>
                <div className="order-first col-span-2 lg:order-3 lg:col-span-1 lg:self-start lg:-mt-[112px]">{statement}</div>
              </React.Fragment>
            ) : (
              <React.Fragment key={leader.name}>
                <div className="order-3 lg:order-4">{portrait}</div>
                <div className="order-4 lg:order-5">{copy}</div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Statement of intent, centred on its own. */}
        <div className="mt-16 lg:mt-20">
          <FadeIn>
            <div className="flex flex-col items-center">
              {/* Oversized quote marks in a washed-back accent. Set inline
                  rather than in their own columns, so they sit against the
                  first and last words instead of out at the edges of the text
                  block — a centred line leaves slack on both sides, and marks
                  pinned to the box would float away from the words. zero
                  line-height keeps them from opening up the line they sit on,
                  and aria-hidden stops a screen reader announcing stray
                  punctuation around the quotation. */}
              <blockquote className="max-w-[1150px] text-center font-serif text-[clamp(19px,2vw,29px)] font-light leading-[1.45] text-ink">
                <span
                  aria-hidden="true"
                  className="mr-1.5 select-none align-[-0.12em] text-[2em] leading-[0] text-accent/35"
                >
                  &ldquo;
                </span>
                We design buildings that belong to their site and their climate — creating timeless
                spaces that remain as relevant in fifty years as on the day of handover.
                <span
                  aria-hidden="true"
                  className="ml-1.5 select-none align-[-0.3em] text-[2em] leading-[0] text-accent/35"
                >
                  &rdquo;
                </span>
              </blockquote>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

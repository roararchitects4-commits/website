import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedLines } from './AnimatedLines';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';
import aboutImg from '@assets/aboutusimage.jpeg';

export function About() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [experience, setExperience] = useState(0);
  const [startedCounting, setStartedCounting] = useState(false);
  const experienceRef = React.useRef<HTMLDivElement | null>(null);
  // Watched instead of the portrait itself: the portrait starts parked off the
  // right of the viewport, so an observer on it could never see it arrive and
  // the entrance would never fire.
  const photoSlotRef = React.useRef<HTMLDivElement | null>(null);
  const photoInView = useInView(photoSlotRef, { once: true, amount: 0.6 });

  React.useEffect(() => {
    const element = experienceRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedCounting) {
            setStartedCounting(true);
          }
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -20% 0px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [startedCounting]);

  React.useEffect(() => {
    if (!startedCounting) return;

    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setExperience(current);

      if (current >= 7) {
        window.clearInterval(interval);
      }
    }, 80);

    return () => window.clearInterval(interval);
  }, [startedCounting]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section
      id="studio"
      className="relative bg-white py-[90px] px-[max(20px,4vw)] overflow-hidden"
    >
      {/* Two sweeps crossing in an X. They run through the clear bands above
          and below the copy and only ever intersect behind the portrait, so
          neither passes over the stat or the bio. The generous section padding
          is what keeps those bands wide enough to absorb the cursor drift
          AnimatedLines applies to the control points. */}
      <AnimatedLines
        className="z-0 hidden lg:block"
        revealDelay={1.2}
        /* Barely-there cursor drift. The curves pass close enough to the bio
           that the 0.15 default swings them straight through it. */
        drift={0.02}
        localScrollOffset
        /* The pair runs close together past the stat, crosses behind the
           portrait, then splays wide before the bio — narrow on the left where
           only the short stat needs clearing, wide on the right where the bio
           occupies most of the height. */
        lines={[
          { start: [-0.06, 0.14], cp1: [0.34, 0.14], cp2: [0.48, 0.99], end: [1.06, 1.00] },
          { start: [-0.06, 0.86], cp1: [0.34, 0.86], cp2: [0.48, 0.01], end: [1.06, 0.00] },
        ]}
      />

      {/* Reading order is stat, then portrait, then bio. */}
      {/* Wide gutters push the bio out toward the right edge and the stat out
          to the left, leaving the portrait centred between them. */}
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[150px_322px_minmax(0,380px)] gap-y-10 lg:gap-x-[clamp(70px,16vw,290px)] items-center justify-center relative z-10 lg:translate-x-[55px]">

        {/* Left: Years of Experience */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <FadeIn>
            <div ref={experienceRef} className="text-[clamp(58px,5.4vw,84px)] font-sans font-light leading-none text-accent">
              {experience}+
            </div>
            <h3 className="text-[12px] tracking-[0.2em] uppercase text-ink font-medium mt-3">
              Years of<br />Experience
            </h3>
          </FadeIn>
        </div>

        {/* Centre: portrait. The entrance lives on the outer element and the
            cursor tilt on the inner one — a single element can't carry both,
            because the inline `transform` needed for the tilt overwrites the
            `rotate` framer-motion is animating, silently killing the spin. */}
        <div ref={photoSlotRef} className="flex justify-center perspective-1000 order-1 lg:order-2">
          <motion.div
            className="w-[322px]"
            /* Starts fully off the right edge of the viewport and rolls
               anticlockwise through a full turn into place, once the slot it
               will land in is 60% on screen. */
            initial={{ opacity: 0, x: '65vw', rotate: 345 }}
            animate={photoInView ? { opacity: 1, x: 0, rotate: -15 } : undefined}
            transition={{ duration: 2.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-[6/7] rounded-[1.75rem] overflow-hidden shadow-2xl transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              }}
              data-cursor="view"
            >
              <img
                src={aboutImg}
                alt="Rohitha Surya, ROAR Architects — Hyderabad and Visakhapatnam design studio"
                className="w-full h-full object-cover scale-110 transition-transform duration-1000 hover:scale-100"
              />
            </div>
          </motion.div>
        </div>

        {/* Right: name + bio */}
        <div className="relative flex flex-col items-center lg:items-start text-center lg:text-left order-3">
          <FadeIn delay={0.2}>
            <h2 className="font-serif font-light text-[clamp(34px,3.8vw,48px)] text-ink mb-4">
              Rohitha Surya
            </h2>
            <TypewriterText
              tag="p"
              className="font-sans text-[15px] leading-relaxed text-muted max-w-[330px]"
              text="At Roar Architects, we're based in Hyderabad with an active studio in Visakhapatnam, creating thoughtful architectural and interior spaces that are functional, timeless, and tailored to your lifestyle. From concept design and planning to detailed drawings, 3D visualization, project management, and execution support, we offer end-to-end design solutions for homes, villas, apartments, commercial spaces, resorts, and hospitality projects."
              speed={12}
              delay={200}
            />
          </FadeIn>
        </div>

      </div>
    </section>
  );
}

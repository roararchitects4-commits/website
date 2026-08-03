import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedLines } from './AnimatedLines';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';
import aboutImg from '@assets/generated_images/about.jpg';

export function About() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [experience, setExperience] = useState(0);
  const [startedCounting, setStartedCounting] = useState(false);
  const experienceRef = React.useRef<HTMLDivElement | null>(null);

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

      if (current >= 15) {
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
    <section id="studio" className="relative bg-white py-[70px] px-[max(20px,4vw)] overflow-hidden flex items-center">
      <AnimatedLines
        className="z-0"
        revealDelay={1.6}
        lines={[
          { start: [-0.2, 1.2], cp1: [0.4, 1.0], cp2: [0.6, -0.2], end: [1.2, -0.3] },
          { start: [1.2, 1.05], cp1: [0.5, 1.1], cp2: [0.2, 0.1], end: [-0.2, 0.4] },
        ]}
      />

      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">

        {/* Left: Years of Experience */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <FadeIn>
            <div ref={experienceRef} className="text-[clamp(64px,8vw,110px)] font-sans font-light leading-none text-accent mt-12">
              {experience}
            </div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-ink font-medium mt-3 lg:ml-[clamp(14px,2vw,28px)]">
              Years of<br />Experience
            </h3>
          </FadeIn>
        </div>

        {/* Center: Image Card */}
        <div className="flex justify-center order-1 lg:order-2 perspective-1000">
          <motion.div
            initial={{ opacity: 0, x: 340, rotate: 260 }}
            whileInView={{ opacity: 1, x: 0, rotate: 15 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-[75%] max-w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotate(15deg) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
            }}
            data-cursor="view"
          >
            <img 
              src={aboutImg} 
              alt="Archin Studio Design" 
              className="w-full h-full object-cover scale-110 transition-transform duration-1000 hover:scale-100"
            />
          </motion.div>
        </div>

        {/* Right: Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-3 lg:order-3">
          <FadeIn delay={0.2}>
            <h2 className="font-serif font-light text-[clamp(30px,3.6vw,44px)] text-ink mb-4">
              Est. 1986
            </h2>
            <TypewriterText
              tag="p"
              className="font-sans text-[14px] leading-relaxed text-muted mb-6 max-w-sm"
              text="Roar Architects is an architectural practice based in Boston. We cut our teeth on designing and creating buildings that are both beautiful and sustainable."
              speed={25}
              delay={200}
            />
            <a 
              href="#work" 
              className="inline-flex items-center justify-center px-8 py-4 border border-line rounded-[30px] text-[13px] text-ink hover:bg-ink hover:text-white transition-colors duration-300"
            >
              Our Studio ↗
            </a>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}

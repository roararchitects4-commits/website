import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedLines } from './AnimatedLines';
import { FadeIn } from './FadeIn';
import aboutImg from '@assets/generated_images/about.jpg';

export function About() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

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
    <section id="studio" className="relative bg-background py-[120px] px-[max(20px,4vw)] overflow-hidden min-h-screen flex items-center">
      <AnimatedLines className="z-0" />
      
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
        
        {/* Left: Years of Experience */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <FadeIn>
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-ink font-medium mb-4">
              Years of<br />Experience
            </h3>
            <div className="text-[clamp(100px,12vw,180px)] font-sans font-light leading-none text-accent">
              15
            </div>
          </FadeIn>
        </div>

        {/* Center: Image Card */}
        <div className="flex justify-center order-1 lg:order-2 perspective-1000">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-[80%] max-w-[400px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
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
            <h2 className="font-serif font-light text-[clamp(40px,5vw,60px)] text-ink mb-6">
              Est. 1986
            </h2>
            <p className="font-sans text-[15px] leading-relaxed text-muted mb-10 max-w-sm">
              Roar Architects is an architectural practice based in Boston. We cut our teeth on designing and creating buildings that are both beautiful and sustainable.
            </p>
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

import React from 'react';
import { AnimatedLines } from './AnimatedLines';
import heroImage from '@assets/generated_images/hero.jpg';

export function Hero() {
  return (
    <section id="top" className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern building exterior" 
          className="w-full h-full object-cover opacity-60 scale-105 animate-[slowPan_20s_linear_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90 mix-blend-multiply" />
      </div>

      <AnimatedLines className="z-10" />

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-[max(24px,4vw)] pb-[12vh]">
        <div className="max-w-4xl text-white">
          <p className="text-[10px] tracking-[0.4em] text-white/70 mb-6 uppercase">
            Roar Architects
          </p>
          <h1 className="font-serif font-light text-[clamp(40px,7vw,90px)] leading-[1.05] mb-6">
            Architecture for a <em className="italic font-light">changing</em> world.
          </h1>
          <p className="font-sans font-light text-[clamp(14px,1.5vw,18px)] tracking-widest text-white/80">
            Est. 2008 · Boston
          </p>
        </div>
      </div>

      <div className="absolute bottom-[40px] right-[max(24px,4vw)] z-20 flex flex-col items-center">
        <span className="text-[9px] tracking-[0.4em] text-white/60 [writing-mode:vertical-rl] rotate-180 mb-4">
          SCROLL
        </span>
        <div className="w-[1px] h-[40px] bg-gradient-to-b from-accent to-transparent origin-top animate-[bounceY_2s_ease-in-out_infinite]" />
      </div>

      <div className="absolute top-[40px] right-[max(24px,4vw)] z-20 mt-[100px] hidden md:block">
        <div className="text-[10px] tracking-[0.4em] text-white/60 [writing-mode:vertical-rl] rotate-180 uppercase space-y-4">
          <a href="mailto:hello@roararchitects.co" className="hover:text-accent transition-colors block">
            hello@roararchitects.co
          </a>
          <span className="block opacity-50">·</span>
          <span className="block">(054) 3256 78 87</span>
        </div>
      </div>
      
      <style>{`
        @keyframes slowPan {
          0% { transform: scale(1.05) translate(0, 0); }
          100% { transform: scale(1.05) translate(-1%, 1%); }
        }
        @keyframes bounceY {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

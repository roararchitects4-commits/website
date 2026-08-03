import React from 'react';
import { Ticker } from './Ticker';
import heroImage from '@assets/homeimage.jpeg';


export function Hero() {
  return (
    <section id="top" className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-ink flex items-center justify-center">
        <img
          src={heroImage}
          alt="Modern building exterior"
          className="absolute inset-0 w-full h-full object-cover opacity-90 animate-[slowPan_20s_linear_infinite_alternate]"
          style={{ filter: 'brightness(1.35)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/25 to-ink/80 mix-blend-multiply" />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-[max(24px,4vw)] pb-[12vh]">
        <div className="max-w-4xl text-white">
          <h1 className="font-serif font-light text-[clamp(40px,7vw,90px)] leading-[1.05] mb-6">
            Architecture for a <em className="italic font-light">changing</em> world.
          </h1>
        </div>

        <div className="relative left-1/2 -translate-x-1/2 w-screen mt-2">
          <Ticker />
        </div>
      </div>

      <div className="absolute bottom-[40px] right-[max(24px,4vw)] z-20 flex flex-col items-center">
        <span className="text-[9px] tracking-[0.4em] text-white/60 [writing-mode:vertical-rl] rotate-180 mb-4">
          SCROLL
        </span>
        <div className="w-[1px] h-[40px] bg-gradient-to-b from-accent to-transparent origin-top animate-[bounceY_2s_ease-in-out_infinite]" />
      </div>

      
      <style>{`
        @keyframes slowPan {
          0% { transform: scale(1.02) translate(0, 0); }
          100% { transform: scale(1.02) translate(-1%, 1%); }
        }
        @keyframes bounceY {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

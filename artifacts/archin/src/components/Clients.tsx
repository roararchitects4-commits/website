import React from 'react';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';

export function Clients() {
  const clients = [
    "Meridian Group", "Voss Capital", "The Elara Hotel", 
    "Cosworth Trust", "Nordic Living", "Atrium Ventures"
  ];

  return (
    <section id="clients" className="py-[70px] px-[max(22px,8vw)] text-center bg-background border-t border-line">
      <FadeIn>
        <div className="flex flex-col items-center mb-11">
          <span className="w-[26px] h-[1px] bg-accent mb-4 block" />
          <TypewriterText
            tag="span"
            className="text-[10px] tracking-[0.4em] text-muted uppercase"
            text="Clients & Collaborators"
            speed={28}
            delay={150}
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-y-6 gap-x-[54px] max-w-5xl mx-auto font-serif text-[clamp(17px,2vw,24px)] font-light text-muted tracking-wide">
          {clients.map((client, idx) => (
            <span key={idx} className="hover:text-ink transition-colors duration-300">
              {client}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

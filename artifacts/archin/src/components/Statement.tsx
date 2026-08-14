import React from 'react';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';

interface StatementProps {
  quote: string;
  kicker?: string;
}

export function Statement({ quote, kicker }: StatementProps) {
  /* The min-height wraps centred content, so whatever it reserves beyond the
     text splits above and below — it sets the gap to the section before this
     one as much as the padding does. */
  return (
    <section className="min-h-[9vh] flex flex-col items-center justify-center text-center px-[max(22px,8vw)] py-6 bg-white relative z-10">
      <FadeIn className="max-w-[1000px] w-full flex flex-col items-center">
        {kicker && (
          <div className="flex flex-col items-center mb-5">
            <span className="w-[26px] h-[1px] bg-accent mb-4 block" />
            <span className="text-[10px] tracking-[0.4em] text-muted uppercase">
              {kicker}
            </span>
          </div>
        )}
        <TypewriterText
          tag="h2"
          className="font-serif font-light text-[clamp(18px,2.4vw,36px)] leading-[1.2] text-ink"
          text={quote}
          speed={22}
          delay={150}
        />
      </FadeIn>
    </section>
  );
}

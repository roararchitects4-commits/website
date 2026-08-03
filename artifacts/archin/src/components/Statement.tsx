import React from 'react';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';

interface StatementProps {
  quote: string;
  kicker?: string;
}

export function Statement({ quote, kicker }: StatementProps) {
  return (
    <section className="min-h-[46vh] flex flex-col items-center justify-center text-center px-[max(22px,8vw)] py-20 bg-background relative z-10">
      <FadeIn className="max-w-[1000px] w-full flex flex-col items-center">
        {kicker && (
          <div className="flex flex-col items-center mb-8">
            <span className="w-[26px] h-[1px] bg-accent mb-4 block" />
            <span className="text-[10px] tracking-[0.4em] text-muted uppercase">
              {kicker}
            </span>
          </div>
        )}
        <TypewriterText
          tag="h2"
          className="font-serif font-light text-[clamp(22px,3vw,44px)] leading-[1.2] text-muted"
          text={quote}
          speed={22}
          delay={150}
        />
      </FadeIn>
    </section>
  );
}

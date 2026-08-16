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
    /* A fixed floor rather than 9vh. The two resolve alike on a desktop — 9vh
       of a ~950px window is about this — but on a phone the viewport is pinned
       to a desktop width and scaled down, which leaves it thousands of CSS
       pixels tall. 9vh of that reserved a few hundred pixels of empty space
       between the philosophy line and Get In Touch. */
    <section className="min-h-[85px] flex flex-col items-center justify-center text-center px-[max(16px,3vw)] py-6 bg-white relative z-10">
      {/* 1000px was the cap that broke the philosophy line in two — at the
          full 36px the quote wants about 1150px. The gutters come in to 3vw
          for the same reason: the line needs the width more than the section
          needs the margin. */}
      <FadeIn className="max-w-[1500px] w-full flex flex-col items-center">
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
          /* nowrap only from sm up. The quote is ~74 characters, so at 2.2vw
             it occupies roughly two thirds of the 94vw the section now leaves
             it — it holds one line at every desktop and tablet width, with
             room to spare if the webfont fails and a wider serif stands in.
             Below sm one line would mean ten-pixel type, so a phone keeps
             wrapping at its own larger size. */
          className="font-serif font-light text-[clamp(16px,4.5vw,36px)] sm:whitespace-nowrap sm:text-[clamp(18px,2.2vw,36px)] leading-[1.2] text-ink"
          text={quote}
          speed={22}
          delay={150}
        />
      </FadeIn>
    </section>
  );
}

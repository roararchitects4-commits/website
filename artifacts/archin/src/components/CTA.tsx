import React, { useState } from 'react';
import { FadeIn } from './FadeIn';

export function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section id="contact" className="min-h-[44vh] flex flex-col items-center justify-center text-center py-20 px-[22px] bg-secondary-bg">
      <FadeIn className="flex flex-col items-center w-full max-w-[820px]">
        <h2 className="font-serif font-light text-[clamp(32px,5vw,66px)] leading-[1.15] text-ink mb-12">
          Have an ambitious project in mind?
        </h2>
        
        {submitted ? (
          <div className="text-[11px] tracking-[0.34em] text-accent uppercase py-5 px-12 border border-accent rounded-full">
            Thanks for reaching out.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-b border-line py-3 px-2 text-ink text-[13px] tracking-wide placeholder:text-muted focus:outline-none focus:border-ink transition-colors rounded-none"
            />
            <button 
              type="submit"
              className="inline-block mt-6 sm:mt-0 text-[11px] tracking-[0.34em] font-normal uppercase border border-accent py-5 px-[52px] text-ink hover:bg-ink hover:text-white hover:border-ink transition-all duration-350 rounded-full cursor-none"
            >
              Submit
            </button>
          </form>
        )}
      </FadeIn>
    </section>
  );
}

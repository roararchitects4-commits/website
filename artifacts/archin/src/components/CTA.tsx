import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';

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
    <section id="contact" className="min-h-[44vh] flex flex-col items-center justify-center text-center py-20 px-[22px] bg-white">
      <FadeIn className="flex flex-col items-center w-full max-w-[820px]">
        <TypewriterText
          tag="h2"
          className="font-serif font-light text-[clamp(32px,5vw,66px)] leading-[1.15] text-ink mb-12"
          text="Have an ambitious project in mind?"
          speed={22}
          delay={150}
        />
        
        {submitted ? (
          <div className="text-[11px] tracking-[0.34em] text-accent uppercase py-5 px-12 border border-accent rounded-full">
            Thanks for reaching out.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-b border-line py-3 px-2 text-ink text-[13px] tracking-wide placeholder:text-muted placeholder:text-[10px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
            />
            <button
              type="submit"
              className="inline-block mt-6 sm:mt-0 text-[13px] tracking-[0.34em] font-normal uppercase border border-accent py-5 px-[52px] text-ink hover:bg-ink hover:text-white hover:border-ink transition-all duration-350 rounded-full"
            >
              Submit
            </button>
          </form>
        )}

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-[720px] text-left">
          <div>
            <span className="flex items-center gap-2 text-[11px] tracking-[0.32em] text-accent uppercase mb-3">
              Visakhapatnam
              <a
                href="https://maps.app.goo.gl/1n7Fc8trwd347mS56"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Visakhapatnam office in Google Maps"
                className="text-ink hover:text-accent transition-colors"
              >
                <MapPin size={15} strokeWidth={1.75} />
              </a>
            </span>
            <address className="not-italic text-[14px] leading-relaxed text-muted">
              Flat no S2, Padmini Villa, Maharanipeta,
              <br />
              Behind Novotel, Visakhapatnam, 530002
            </address>
          </div>
          <div>
            <span className="flex items-center gap-2 text-[11px] tracking-[0.32em] text-accent uppercase mb-3">
              Hyderabad
              <a
                href="https://maps.app.goo.gl/KmmwxB1u1QdZ9Qjz5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Hyderabad office in Google Maps"
                className="text-ink hover:text-accent transition-colors"
              >
                <MapPin size={15} strokeWidth={1.75} />
              </a>
            </span>
            <address className="not-italic text-[14px] leading-relaxed text-muted">
              2nd floor, Poorna's Pride, Durga Bhawani Nagar,
              <br />
              Giani Zail Singh Nagar, Film Nagar,
              <br />
              Hyderabad, Telangana 500096
            </address>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';
import officesMap from '@assets/contact/offices-map.png';
import contactBg from '@assets/contact/contact-bg.png';
import { SITE_URL, SITE_NAME } from '../lib/siteConfig';

const MARQUEE_WORDS = ['Dedicated', 'Creative', 'Innovative', 'Sustainable', 'Passionate', 'Timeless'];

function ContactMarqueeTrack() {
  return (
    <div className="flex items-center flex-none animate-[contactMarqueeScroll_36s_linear_infinite]">
      {MARQUEE_WORDS.map((word, idx) => (
        <span
          key={idx}
          className="text-[4.2vw] md:text-[2.2vw] font-extrabold uppercase leading-none px-4 flex-none text-ink"
          style={
            idx % 2 === 0
              ? { WebkitTextStroke: '1.5px var(--color-ink)', color: 'transparent' }
              : undefined
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}

/* `left`/`top` place each pin as a percentage of the map box, so they only line
   up with their city for one box shape — currently 3/2.

   To re-derive after an aspect change: the image is always fitted to the width
   and anchored to the top, so a city stays at a fixed pixel depth and only the
   box height under it changes. Scale every `top` by (old height / new height),
   which for these ratios is just the inverse of the aspect change — going 9/7 to
   9/6 meant multiplying by 7/6. `left` never changes, since the image spans the
   full width at any of these ratios. */
const OFFICES = [
  {
    city: 'Visakhapatnam',
    mapsHref: 'https://maps.app.goo.gl/1n7Fc8trwd347mS56',
    lines: ['Flat no S2, Padmini Villa, Maharanipeta,', 'Behind Novotel, Visakhapatnam, 530002'],
    left: '75%',
    top: '55.5%',
    streetAddress: 'Flat no S2, Padmini Villa, Maharanipeta, Behind Novotel',
    region: 'Andhra Pradesh',
    postalCode: '530002',
  },
  {
    city: 'Hyderabad',
    mapsHref: 'https://maps.app.goo.gl/KmmwxB1u1QdZ9Qjz5',
    lines: ["2nd floor, Poorna's Pride, Durga Bhawani Nagar,", 'Giani Zail Singh Nagar, Film Nagar,', 'Hyderabad, Telangana 500096'],
    left: '25.8%',
    top: '60.2%',
    streetAddress: "2nd floor, Poorna's Pride, Durga Bhawani Nagar, Giani Zail Singh Nagar, Film Nagar",
    region: 'Telangana',
    postalCode: '500096',
  },
];

/* No phone/email exists in the codebase yet — omitted from the schema
   rather than invented. Add `telephone`/`email` here once confirmed. */
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@graph': OFFICES.map((office) => ({
    '@type': 'ProfessionalService',
    name: `${SITE_NAME} — ${office.city}`,
    url: SITE_URL,
    hasMap: office.mapsHref,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.streetAddress,
      addressLocality: office.city,
      addressRegion: office.region,
      postalCode: office.postalCode,
      addressCountry: 'IN',
    },
  })),
};

const EMPTY_FORM = { name: '', phone: '', email: '', message: '' };

export function CTA() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Honeypot. Hidden from people, filled in by naive bots — the API drops any
     submission that carries a value here. */
  const [company, setCompany] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  const updateField = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  /* `type="tel"` only tells a phone which keyboard to raise — it accepts any
     character typed into it, so the field has to be filtered here to actually
     stay numeric. Doing it on change rather than on keypress means pastes and
     browser autofill are cleaned up too, not just typing. A leading `+`
     survives so an international number can still be given as +91…; 15 digits
     is the most any real number carries (E.164). */
  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const plus = raw.trimStart().startsWith('+') ? '+' : '';
    setForm((f) => ({ ...f, phone: plus + raw.replace(/\D/g, '').slice(0, 15) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    /* Every field is required, so nothing may be blank. The honeypot is the
       one exception — it must stay empty. */
    if (!form.name || !form.email || !form.phone || !form.message) return;

    setSending(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, company }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Something went wrong. Please try again.');
      }

      /* Only cleared once the mail is actually away — wiping the fields on a
         failed send would make the visitor retype everything. */
      setForm(EMPTY_FORM);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setBgOffset({ x: nx * 12, y: ny * 12 });
  };

  const handleMouseLeave = () => setBgOffset({ x: 0, y: 0 });

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden flex flex-col items-center pt-6 sm:pt-8 pb-0 px-4 sm:px-[22px] bg-white"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={contactBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right blur-[3px] opacity-45 transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0) scale(1.15)` }}
        />
      </div>

      <FadeIn className="relative z-10 w-full max-w-[1180px]">
        {/* The map column is widened by both the ratio and the container, rather
            than the ratio alone — taking it all out of the ratio would have
            squeezed the form column below the width its inputs want. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8 lg:gap-12 items-start text-left">
          {/* Static map with hover pins */}
          {/* 3/2 is set to land the bottom edge level with the submit button
              across the grid. It is shallower than the artwork's own 900x700, so
              object-cover fits the image to the width and crops the foot of it —
              which is the only way to lose height at a fixed width. Anything
              taller than 9/7 would instead crop the sides and pull the coastline
              out of frame. */}
          <div className="relative rounded-[2rem] border border-line shadow-xl aspect-[3/2] bg-secondary-bg mt-0 lg:mt-1 lg:-ml-20">
            <img
              src={officesMap}
              alt="Map of Andhra Pradesh and Telangana showing Roar Architects offices in Visakhapatnam and Hyderabad"
              className="absolute inset-0 w-full h-full object-cover object-top rounded-[2rem]"
            />

            {OFFICES.map((office) => (
              <a
                key={office.city}
                href={office.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${office.city} office in Google Maps`}
                className="group absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-full"
                style={{ left: office.left, top: office.top }}
              >
                {/* The card sits above its pin at every width now. Two of them
                    centred on 25.8% and 75% clear each other once the map is
                    wider than about twice the card, so the phone card comes
                    down to 124px: at the narrowest phone the section allows —
                    320px less its 16px gutters — that still leaves ~33px
                    between the two, and neither runs off the map's edge. */}
                <div className="w-[124px] sm:w-[150px] bg-white rounded-lg shadow-lg p-2 sm:p-2.5 text-left transition-transform duration-200 group-hover:-translate-y-0.5">
                  <span className="flex items-center gap-2 text-[7px] sm:text-[8.5px] tracking-[0.16em] sm:tracking-[0.18em] text-accent uppercase mb-1">
                    {office.city}
                  </span>
                  <address className="not-italic text-[8px] sm:text-[9.5px] leading-snug text-black">
                    {office.lines.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < office.lines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </address>
                </div>

                <span className="block w-px h-2 sm:h-3 bg-accent/70" />

                <MapPin
                  size={26}
                  strokeWidth={1.75}
                  className="text-accent fill-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] -mt-[2px] transition-transform duration-200 group-hover:scale-110"
                />
              </a>
            ))}
          </div>

          {/* The phone-only address list that used to sit here stood in for the
              on-map cards while those were hidden below sm. The cards show at
              every width now, so the list would only print both addresses a
              second time, directly under the ones on the map. */}

          {/* Let's Connect + form */}
          <div className="flex flex-col justify-center">
            {/* leading-none is what makes the map's top edge line up with this
                heading. At the inherited 1.5 line height the text sat ~10px
                below the top of its own box, so the two columns starting on the
                same grid line still looked misaligned. */}
            {/* Inter, matching "The People Behind ROAR" and the statement it
                heads in the About section, rather than the serif this used to
                carry. The tracking comes with the face: Inter is drawn for text
                sizes and opens up at 38px, so it takes the same -0.02em the
                hero headline and the About statement already use at display
                size. font-light is written out rather than left to inherit from
                body — it was always 300, but only by inheritance. */}
            <span className="text-[clamp(28px,8vw,38px)] font-sans font-light leading-none tracking-[-0.02em] text-accent mb-4 sm:mb-5">
              Get In Touch
            </span>
            {/* Solid black, not the site's --muted: over the blurred sketch
                behind this section a 60% ink grey had too little left to read
                against. The same goes for the field labels and the addresses on
                the map cards — every run of copy in here is set in black. */}
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-black mb-6 sm:mb-8 max-w-lg">
              We are excited to hear about your project. Please leave your details and a brief message. We aim to respond within 24 hours.
            </p>

            {submitted ? (
              <div className="text-[11px] tracking-[0.34em] text-accent uppercase py-5 px-12 border border-accent rounded-full self-start">
                Thanks for reaching out.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={updateField('name')}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-black text-[15px] tracking-wide placeholder:text-black placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Phone Number"
                  required
                  value={form.phone}
                  onChange={updatePhone}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-black text-[15px] tracking-wide placeholder:text-black placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-black text-[15px] tracking-wide placeholder:text-black placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <textarea
                  placeholder="Message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={updateField('message')}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-black text-[15px] tracking-wide placeholder:text-black placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none resize-none"
                />

                {/* Honeypot — off-screen rather than display:none, since some
                    bots skip fields they can tell are hidden. Never announced
                    to assistive tech and never focusable by keyboard. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="absolute left-[-9999px] w-px h-px opacity-0"
                />

                {error && (
                  <p role="alert" className="text-[13px] text-accent leading-relaxed mt-1">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-block text-[12px] tracking-[0.34em] font-normal uppercase border border-accent py-3.5 px-10 text-black hover:bg-ink hover:text-white hover:border-ink transition-all duration-350 rounded-full sm:self-start w-full sm:w-auto mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black disabled:hover:border-accent"
                >
                  {sending ? 'Sending…' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </FadeIn>

      <div className="relative z-10 w-full mt-8 border-t border-line py-4 overflow-hidden">
        <div className="flex w-max">
          <ContactMarqueeTrack />
          <ContactMarqueeTrack />
        </div>
      </div>

      <style>{`
        @keyframes contactMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}

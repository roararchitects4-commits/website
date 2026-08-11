import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { TypewriterText } from './TypewriterText';
import officesMap from '@assets/generated_images/offices-map.png';
import contactBg from '@assets/generated_images/realconatctimage.png';
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

const OFFICES = [
  {
    city: 'Visakhapatnam',
    mapsHref: 'https://maps.app.goo.gl/1n7Fc8trwd347mS56',
    lines: ['Flat no S2, Padmini Villa, Maharanipeta,', 'Behind Novotel, Visakhapatnam, 530002'],
    left: '75.5%',
    top: '54.5%',
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
  const sectionRef = useRef<HTMLElement>(null);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  const updateField = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setForm(EMPTY_FORM);
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
      className="relative overflow-hidden flex flex-col items-center pt-14 pb-0 px-[22px] bg-white"
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

      <FadeIn className="relative z-10 flex flex-col items-center w-full max-w-[1080px]">
        <TypewriterText
          tag="h2"
          className="font-serif font-medium tracking-tight text-[clamp(30px,4.4vw,56px)] leading-[1.15] text-ink text-center mb-10"
          text="Have an ambitious project in mind?"
          speed={22}
          delay={150}
        />
      </FadeIn>

      <FadeIn delay={1.90} className="relative z-10 w-full max-w-[1080px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.42fr_1fr] gap-8 lg:gap-12 items-start text-left">
          {/* Static map with hover pins */}
          <div className="relative rounded-[2rem] border border-line shadow-xl aspect-[9/6] bg-secondary-bg mt-6 lg:mt-10 lg:-ml-20">
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
                <div className="w-[150px] bg-white rounded-lg shadow-lg p-2.5 text-left transition-transform duration-200 group-hover:-translate-y-0.5">
                  <span className="flex items-center gap-2 text-[8.5px] tracking-[0.18em] text-accent uppercase mb-1">
                    {office.city}
                  </span>
                  <address className="not-italic text-[9.5px] leading-snug text-muted">
                    {office.lines.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < office.lines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </address>
                </div>

                <span className="w-px h-3 bg-accent/70" />

                <MapPin
                  size={26}
                  strokeWidth={1.75}
                  className="text-accent fill-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] -mt-[2px] transition-transform duration-200 group-hover:scale-110"
                />
              </a>
            ))}
          </div>

          {/* Let's Connect + form */}
          <div className="flex flex-col justify-center">
            <span className="text-[38px] font-serif text-accent mb-4">
              Let's Connect
            </span>
            <p className="text-[16px] leading-relaxed text-muted mb-8 max-w-lg">
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
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-ink text-[15px] tracking-wide placeholder:text-muted placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={updateField('phone')}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-ink text-[15px] tracking-wide placeholder:text-muted placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-ink text-[15px] tracking-wide placeholder:text-muted placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <textarea
                  placeholder="Message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={updateField('message')}
                  className="w-full bg-transparent border-b border-line py-3.5 px-2 text-ink text-[15px] tracking-wide placeholder:text-muted placeholder:text-[11px] placeholder:tracking-[0.4em] placeholder:uppercase placeholder:font-bold focus:outline-none focus:border-ink transition-colors rounded-none resize-none"
                />
                <button
                  type="submit"
                  className="inline-block text-[12px] tracking-[0.34em] font-normal uppercase border border-accent py-3.5 px-10 text-ink hover:bg-ink hover:text-white hover:border-ink transition-all duration-350 rounded-full self-start mt-2"
                >
                  Submit
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

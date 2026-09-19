/* Where a sent enquiry lands.
 *
 * A page with its own URL rather than a panel swapped into the form, so the
 * submission is a navigation — which is what an ads or analytics conversion
 * can be triggered on. It also survives a reload and can be linked to, neither
 * of which is true of a state flag inside the form.
 *
 * It carries noindex: it is only reachable by sending the form, and a thank-you
 * page in the results is a page that answers nothing for whoever finds it.
 */
import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Check, ArrowRight } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { WHATSAPP_URL } from '../lib/siteConfig';

const WHATSAPP_MESSAGE =
  "Hi, I'd like to book a free interior design consultation with ROAR Architects.";

export default function ThankYouPage() {
  /* Arrived here from the foot of a form, so the offset comes with us. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      <Helmet>
        <title>Thank you — ROAR Architects</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="w-full max-w-[560px] bg-white border border-accent rounded-2xl p-8 sm:p-12 text-center shadow-[0_18px_50px_-24px_rgba(42,36,32,0.35)]">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check size={26} className="text-accent" strokeWidth={2} />
          </div>

          <h1 className="font-sans text-[clamp(22px,5vw,28px)] font-light leading-snug text-ink mb-3">
            Thank you, we have your details.
          </h1>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-black/65 mb-7">
            One of our designers will call you shortly. If you would rather not wait, message us
            directly.
          </p>

          <a
            href={WHATSAPP_URL(WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            /* WhatsApp's own green rather than the site accent: it should look
               like the thing it opens. */
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-white rounded-full py-3.5 px-9 transition-colors"
            style={{ backgroundColor: '#25D366' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1DA851')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
          >
            Chat on WhatsApp
          </a>

          {/* A way onward, so the page is not a dead end for someone who would
              rather look at the work while they wait for the call. */}
          <Link
            href="/work"
            className="mt-7 inline-flex items-center justify-center gap-2 w-full text-[11px] tracking-[0.2em] uppercase text-ink hover:text-accent transition-colors"
          >
            See our work <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

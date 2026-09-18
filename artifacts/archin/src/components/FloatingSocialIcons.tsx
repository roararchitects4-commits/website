import React from 'react';
import { motion } from 'framer-motion';
import instagramIcon from '@assets/social/instagram.jpeg';
import whatsappIcon from '@assets/social/whatsapp.jpeg';
import { WHATSAPP_URL as whatsappUrl } from '../lib/siteConfig';

const INSTAGRAM_URL = 'https://www.instagram.com/roar.architects?igsh=ZzR6NmI0OHo1dTQ0';
const WHATSAPP_MESSAGE = "Hi, I'd like to know more about ROAR Architects' design services.";
/* The number itself now lives in lib/siteConfig alongside the tel: form, since
   the campaign landing page dials and messages the same line. */
const WHATSAPP_HREF = whatsappUrl(WHATSAPP_MESSAGE);

interface FloatingSocialIconsProps {
  /** Which edge the buttons hug. Right everywhere on the site; the campaign
   *  landing page asks for left, so they do not cover its content. */
  side?: 'left' | 'right';
  /** Extra space under the buttons, in Tailwind's rem scale, for a page that
   *  parks something else along the bottom of a phone screen — the landing
   *  page's call bar, which these would otherwise sit on top of. Applied below
   *  `lg` only, since that bar is phone-only too. */
  liftOnMobile?: boolean;
  /** Smaller buttons on a phone. The campaign landing page runs its form up
   *  the right-hand side of a narrow screen, where the full-size pair sits on
   *  top of the fields. Desktop is unaffected either way. */
  compact?: boolean;
}

export function FloatingSocialIcons({ side = 'right', liftOnMobile = false, compact = false }: FloatingSocialIconsProps = {}) {
  const edge = side === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6';
  /* 1.5rem clears the home indicator; 5.75rem also clears a 72px bottom bar. */
  const size = compact
    ? 'w-9 h-9 sm:w-[52px] sm:h-[52px]'
    : 'w-12 h-12 sm:w-[52px] sm:h-[52px]';
  const bottom = liftOnMobile
    ? 'bottom-[calc(5.75rem+env(safe-area-inset-bottom))] lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]'
    : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom))]';

  return (
    <motion.div
      /* The home indicator on a modern phone occupies the bottom ~34px, and a
         button parked at a flat 24px sits underneath it — the swipe-up gesture
         wins over the tap. The inset is 0 anywhere without one, so this is a
         no-op on desktop and on older devices. */
      className={`fixed ${edge} ${bottom} z-[60] flex flex-col gap-3`}
      initial={{ y: 140, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with ROAR Architects on WhatsApp"
        className={`floating-social-icon ${size} rounded-full overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.25)] border-2 border-white hover:scale-105 transition-transform duration-200`}
        style={{ animationDelay: '0s' }}
      >
        <img src={whatsappIcon} alt="" className="w-full h-full object-cover scale-[1.14]" />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ROAR Architects on Instagram"
        className={`floating-social-icon ${size} rounded-full overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.25)] border-2 border-white hover:scale-105 transition-transform duration-200`}
        style={{ animationDelay: '0.35s' }}
      >
        <img src={instagramIcon} alt="" className="w-full h-full object-cover scale-[1.10]" />
      </a>

      <style>{`
        .floating-social-icon {
          animation: floatSocialIcon 2.8s ease-in-out infinite;
        }
        @keyframes floatSocialIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import instagramIcon from '@assets/instagram.jpeg';
import whatsappIcon from '@assets/whatsapp.jpeg';

const INSTAGRAM_URL = 'https://www.instagram.com/roar.architects?igsh=ZzR6NmI0OHo1dTQ0';
const WHATSAPP_NUMBER = '917659024247';
const WHATSAPP_MESSAGE = "Hi, I'd like to know more about ROAR Architects' design services.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function FloatingSocialIcons() {
  return (
    <motion.div
      /* The home indicator on a modern phone occupies the bottom ~34px, and a
         button parked at a flat 24px sits underneath it — the swipe-up gesture
         wins over the tap. The inset is 0 anywhere without one, so this is a
         no-op on desktop and on older devices. */
      className="fixed right-4 sm:right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[60] flex flex-col gap-3"
      initial={{ y: 140, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with ROAR Architects on WhatsApp"
        className="floating-social-icon w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.25)] border-2 border-white hover:scale-105 transition-transform duration-200"
        style={{ animationDelay: '0s' }}
      >
        <img src={whatsappIcon} alt="" className="w-full h-full object-cover scale-[1.14]" />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ROAR Architects on Instagram"
        className="floating-social-icon w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.25)] border-2 border-white hover:scale-105 transition-transform duration-200"
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

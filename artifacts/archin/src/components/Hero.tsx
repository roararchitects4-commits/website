import React from 'react';
import housePlan from '@assets/house-plan.png';
import logo from '@/assets/logo.png';

const TICKER_TERMS = [
  'AESTHETIC', 'ACOUSTICS', 'ARCH', 'ASYMMETRY', 'ATRIUM', 'BALCONY', 'BARREL VAULT', 'BASEMENT',
  'BAY', 'BEAM', 'BRICKWORK', 'BUILDING CODE', 'BUTTRESS', 'CANTILEVER', 'CAPITAL', 'CARVING',
  'CAST IRON', 'CEILING', 'CHANDELIER', 'CHIMNEY', 'CLASSICAL', 'CLADDING', 'CLERESTORY', 'CLOISTER',
  'COLONNADE', 'CONCRETE', 'CONSTRUCTION', 'CORNICE', 'COURTYARD', 'CUPOLA', 'CURTAIN WALL',
  'DOME', 'DOOR', 'DORIC', 'EAVES', 'ECO FRIENDLY', 'EMBELLISHMENT', 'ENERGY EFFICIENCY', 'ENTRANCE',
  'ENVIRONMENTAL CONTROL', 'EROSION', 'EXTERIOR', 'FACADE', 'FANLIGHT', 'FENESTRATION',
  'FIBER CEMENT', 'FIRE SAFETY', 'FLOOR PLAN', 'FOOTING', 'FOUNDATION', 'FOYER', 'FRAME',
  'FRENCH DOORS', 'FRONTISPIECE', 'GABLE', 'GAMBREL ROOF', 'GARDEN', 'GEODESIC DOME', 'GLASS',
  'GOTHIC', 'GREEN ROOF', 'GRILLE', 'GROTTO', 'GUTTERS', 'HALF-TIMBERED', 'HARDWARE', 'HATCH',
  'HEATING', 'HIP ROOF', 'HOUSEWRAP', 'I-BEAM', 'ICONIC', 'IONIC', 'IRONWORK', 'JOIST', 'KEYSTONE',
  'LANTERN', 'LATTICE', 'LAYLIGHT', 'LEADED GLASS', 'LIGHT WELL', 'LINTEL', 'LOGGIA', 'LOUVER',
  'MANSARD ROOF', 'MATERIALS', 'MOLDING', 'MOSAIC', 'MULLION', 'NEOCLASSICAL', 'NEW CLASSICAL',
  'OCTAGON', 'ORDER', 'ORIENTATION', 'PALLADIAN', 'PEDIMENT', 'PILOTIS',
];

function ArkTickerTrack() {
  return (
    <div className="flex items-center flex-none animate-[arkTickerScroll_140s_linear_infinite]">
      {TICKER_TERMS.map((term, idx) => (
        <span key={idx} className="flex items-center flex-none">
          <span className="text-[16px] md:text-[20px] font-bold uppercase tracking-[0.02em] whitespace-nowrap">
            {term}
          </span>
          <span className="text-[16px] md:text-[20px] font-bold text-ink/40 px-4 flex-none">/</span>
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative w-full min-h-screen flex flex-col justify-center bg-[#f4f3f0] text-ink">
      <div className="pt-20 pb-16">
        {/* Illustration + ticker card - full viewport width */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#f4f3f0] overflow-hidden">
          <div className="relative z-10 flex items-start justify-between pl-[max(22px,5vw)] pr-[max(22px,5vw)] pt-2 -mb-20 md:-mb-28 pointer-events-none">
            <img
              src={housePlan}
              alt="Architectural building illustration"
              className="w-[38%] max-w-[900px] mt-6 md:mt-10 select-none"
            />
            <div className="hidden md:flex items-start gap-5 text-left mr-[8vw] lg:mr-[14vw]">
              <img src={logo} alt="" className="w-20 lg:w-28 h-auto flex-none" aria-hidden="true" />
              <span className="font-sans font-extrabold uppercase leading-none tracking-tight">
                <span className="block text-[clamp(36px,6vw,96px)]">ROAR</span>
                <span className="block font-light text-[clamp(16px,2.2vw,34px)] tracking-[0.2em] mt-2">
                  ARCHITECTS
                </span>
              </span>
            </div>
          </div>
          <div className="relative border-t-2 border-b-2 border-ink py-8 md:py-10 overflow-hidden">
            <div className="flex w-max">
              <ArkTickerTrack />
              <ArkTickerTrack />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes arkTickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}

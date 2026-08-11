import arch1 from '@assets/roar_assets/arch-1.png';
import arch2 from '@assets/roar_assets/arch-2.png';
import arch3 from '@assets/roar_assets/arch-3.jpeg';

import int3 from '@assets/roar_assets/int-3.png';
import int4 from '@assets/generated_images/file_00000000326c821182e3d11c6d99804a.png';
import int5 from '@assets/generated_images/file_00000000d6d48211859762de0555a6c7.png';

import terrace1 from '@assets/generated_images/WhatsApp Image 2026-08-11 at 12.01.35.jpeg';
import terrace2 from '@assets/generated_images/WhatsApp Image 2026-08-11 at 12.01.35 (1).jpeg';
import terrace3 from '@assets/generated_images/WhatsApp Image 2026-08-11 at 12.01.35 (2).jpeg';

export interface WorkItem {
  id: string;
  img: string;
  title: string;
  desc: string;
}

export interface WorkCategory {
  slug: string;
  label: string;
  items: WorkItem[];
}

export const WORK_CATEGORIES: WorkCategory[] = [
  {
    slug: 'architecture',
    label: 'Architecture',
    items: [
      { id: 'a1', img: arch1, title: 'Onyx Facade', desc: 'Dark stone-clad residence layered with wood-slat canopies and vertical greenery.' },
      { id: 'a2', img: arch2, title: 'Dusk Residence', desc: 'Multi-level home glowing at twilight with cascading balconies and a private water wall.' },
      { id: 'a3', img: arch3, title: 'Sculpted Corner', desc: 'Angular contemporary villa wrapped in stone, timber and glass.' },
    ],
  },
  {
    slug: 'interiors',
    label: 'Interiors',
    items: [
      { id: 'i5', img: int5, title: 'Open Living & Dining', desc: 'Sunlit open-plan living and dining space finished in warm timber, marble and brass.' },
      { id: 'i4', img: int4, title: 'Ivory Utility Kitchen', desc: 'Crisp white cabinetry and backlit display shelving framed by a coffered ceiling.' },
      { id: 'i3', img: int3, title: 'Terracotta Lounge', desc: 'Amber-lit dining space framed by warm terracotta walls.' },
    ],
  },
  {
    slug: 'terrace-scaping',
    label: 'Terrace Scaping',
    items: [
      { id: 't1', img: terrace1, title: 'Skyline Terrace', desc: 'Open-air terrace designed for lounging with sweeping city views.' },
      { id: 't2', img: terrace2, title: 'Garden Deck', desc: 'Planted terrace deck blending greenery with relaxed seating areas.' },
      { id: 't3', img: terrace3, title: 'Rooftop Retreat', desc: 'Elevated rooftop escape framed by soft ambient lighting.' },
    ],
  },
];

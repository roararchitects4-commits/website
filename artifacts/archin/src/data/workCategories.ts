/* All project imagery is drawn from attached_assets/site, curated out of the
 * client's ALL IMAGES drop. */
import arch1 from '@assets/site/arch-01.jpg';
import arch2 from '@assets/site/arch-02.jpg';
import arch3 from '@assets/site/arch-03.jpg';
import arch4 from '@assets/site/arch-04.jpg';
import arch5 from '@assets/site/arch-05.jpg';
import arch6 from '@assets/site/arch-06.jpg';

import int1 from '@assets/site/int-01.jpg';
import int2 from '@assets/site/int-02.jpg';
import int3 from '@assets/site/int-03.jpg';
import int4 from '@assets/site/int-04.jpg';
import int5 from '@assets/site/int-05.jpg';
import int6 from '@assets/site/int-06.jpg';

import terrace1 from '@assets/site/terr-01.jpg';
import terrace2 from '@assets/site/terr-02.jpg';
import terrace3 from '@assets/site/terr-03.jpg';
import terrace4 from '@assets/site/terr-04.jpg';
import terrace5 from '@assets/site/terr-05.jpg';
import terrace6 from '@assets/site/terr-06.jpg';

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
  /** When set, the row's third cell becomes a four-up panel showing
   * `items[showcaseFrom .. showcaseFrom + 4]` instead of a single photo. */
  showcaseFrom?: number;
}

export const WORK_CATEGORIES: WorkCategory[] = [
  {
    slug: 'architecture',
    label: 'Architecture',
    // Items 2-5 fill the four-up showcase panel in the third cell.
    showcaseFrom: 2,
    items: [
      { id: 'a1', img: arch1, title: 'Layered Facade', desc: 'Stacked white volumes cut by timber soffits and planted terraces.' },
      { id: 'a2', img: arch2, title: 'Onyx Facade', desc: 'Dark stone-clad residence layered with wood-slat canopies and vertical greenery.' },
      { id: 'a3', img: arch3, title: 'Midnight Elevation', desc: 'Cantilevered upper floors lit against a deep night sky.' },
      { id: 'a4', img: arch4, title: 'Sculpted Corner', desc: 'Angular contemporary villa wrapped in stone, timber and glass.' },
      { id: 'a5', img: arch5, title: 'Cascade House', desc: 'Multi-level home stepping down its site with planted balconies at every turn.' },
      { id: 'a6', img: arch6, title: 'Slatted Screen', desc: 'Vertical timber fins filtering light across a shaded entrance court.' },
    ],
  },
  {
    slug: 'interiors',
    label: 'Interiors',
    showcaseFrom: 2,
    items: [
      { id: 'i1', img: int1, title: 'Timber Living Wall', desc: 'Warm panelled media wall anchoring a calm, low-slung living room.' },
      { id: 'i2', img: int2, title: 'Island Kitchen', desc: 'Stone-topped island opening straight onto the dining table.' },
      { id: 'i3', img: int3, title: 'Open Living & Dining', desc: 'Sunlit open-plan living and dining space finished in warm timber and marble.' },
      { id: 'i4', img: int4, title: 'Stairwell Lounge', desc: 'Double-height lounge wrapped around a sculptural timber stair.' },
      { id: 'i5', img: int5, title: 'Monochrome Kitchen', desc: 'Crisp cabinetry and backlit display shelving in a graphite palette.' },
      { id: 'i6', img: int6, title: 'Marble Suite', desc: 'Principal bedroom framed by fluted panelling and warm brass light.' },
    ],
  },
  {
    slug: 'terrace-scaping',
    label: 'Terrace Scaping',
    showcaseFrom: 2,
    items: [
      { id: 't1', img: terrace1, title: 'Skyline Terrace', desc: 'Open-air terrace designed for lounging with sweeping city views.' },
      { id: 't2', img: terrace2, title: 'Poolside Pergola', desc: 'Shaded seating set beside a still reflecting pool.' },
      { id: 't3', img: terrace3, title: 'Garden Dining Deck', desc: 'Long dining table sheltered by a planted pergola canopy.' },
      { id: 't4', img: terrace4, title: 'Planted Deck', desc: 'Timber deck edged with deep planters and a spiral stair to the roof.' },
      { id: 't5', img: terrace5, title: 'Evening Terrace', desc: 'Soft dusk light across a lounge terrace framed by climbing greenery.' },
      { id: 't6', img: terrace6, title: 'Shaded Retreat', desc: 'Slatted canopy opening onto an uninterrupted green horizon.' },
    ],
  },
];

/* A named project album — one folder under attached_assets/gallery holding
 * every photograph of a single project. The work grid shows one card per album
 * with a "view album" button on it; the button lands on /gallery/<slug>, which
 * is the same mosaic page the categories use.
 *
 * Adding a project: drop the folder in, add a glob here. The glob path has to
 * be a literal — Vite resolves `import.meta.glob` at build time and cannot see
 * a variable — so each album spells its own out.
 *
 * The extension list is deliberately long, upper case included: the album is
 * meant to be the folder, so a photograph dropped in as .PNG or .JPG must not
 * go missing from it just because the matcher is case-sensitive. Every album
 * glob is shallow, so it takes the folder itself and nothing nested inside. */
import { loadPhotos, type GalleryPhoto } from './galleryImages';

export interface Album {
  /** URL segment: /gallery/<slug>. Shares the namespace with the category
   * slugs in `workCategories.ts`, so these have to stay distinct from those. */
  slug: string;
  label: string;
  /** Parent category slug — the ← arrow on the album page goes there. */
  category: string;
  /** One line for the album page's meta description. */
  blurb: string;
  photos: GalleryPhoto[];
}

/** The photo a card leads with. The client marks it by naming the file `main`;
 * failing that — interiors1 arrived without one — the album's first photo
 * stands in, so a folder is never coverless. Dropping a `main.jpeg` in later
 * takes over on its own. */
export function albumCover(album: Album): string {
  const main = album.photos.find((photo) => photo.id.toLowerCase() === 'main');
  return (main ?? album.photos[0])?.src ?? '';
}

/** Cover first, then the rest in filename order — the album opens on the shot
 * that was on the card rather than on whatever sorts to the top. */
function ordered(photos: GalleryPhoto[]): GalleryPhoto[] {
  const mainIndex = photos.findIndex((photo) => photo.id.toLowerCase() === 'main');
  if (mainIndex < 1) return photos;
  return [photos[mainIndex], ...photos.slice(0, mainIndex), ...photos.slice(mainIndex + 1)];
}

export const ALBUMS: Album[] = [
  {
    slug: 'layered-facade-villa',
    label: 'Layered Facade Villa',
    category: 'architecture',
    blurb: 'Stacked white volumes cut by timber soffits and planted terraces.',
    photos: ordered(
      loadPhotos(
        import.meta.glob('../../../../attached_assets/gallery/arch/villa1/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }),
        'Layered Facade Villa',
      ),
    ),
  },
  {
    slug: 'onyx-facade-villa',
    label: 'Onyx Facade Villa',
    category: 'architecture',
    blurb: 'Dark stone-clad residence layered with wood-slat canopies and vertical greenery.',
    photos: ordered(
      loadPhotos(
        import.meta.glob('../../../../attached_assets/gallery/arch/villa2/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }),
        'Onyx Facade Villa',
      ),
    ),
  },
  {
    slug: 'synstek',
    label: 'Synstek - Corporate Office',
    category: 'interiors',
    blurb: 'Workplace interiors — open workstation floors, glazed cabins and a stone reception counter.',
    photos: ordered(
      loadPhotos(
        /* Only the resized copies at the folder's top level. The untouched
           iCloud originals sit in the subfolder beside them and are not served —
           see the note in `galleryImages.ts`. */
        import.meta.glob('../../../../attached_assets/gallery/int/interiors1/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }),
        'Synstek - Corporate Office',
      ),
    ),
  },
  {
    slug: 'amogham',
    label: 'Amogham - Restaurant',
    category: 'interiors',
    blurb: 'Restaurant interiors in warm timber and cane, opening onto a full-height street window.',
    photos: ordered(
      loadPhotos(
        import.meta.glob('../../../../attached_assets/gallery/int/interiors2/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }),
        'Amogham - Restaurant',
      ),
    ),
  },
];

export function albumBySlug(slug: string): Album | undefined {
  return ALBUMS.find((album) => album.slug === slug);
}

/** Keyed lookup for the work grid, which names the album it is a card for. */
export const ALBUM_COVERS: Record<string, string> = Object.fromEntries(
  ALBUMS.map((album) => [album.slug, albumCover(album)]),
);

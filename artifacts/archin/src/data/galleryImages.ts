/* Every gallery photograph, read straight off disk from attached_assets/gallery.
 * Adding a project is a matter of dropping a file into the right folder — no
 * edit here is needed. Sources are the client's ALL IMAGES drop, resized to
 * 1280px and re-encoded (166MB -> 26MB) so a 200-image page stays loadable. */
import { GALLERY_CAPTIONS } from './galleryCaptions';

export interface GalleryPhoto {
  src: string;
  /** Filename stem, e.g. `arch-001` — the key `GALLERY_CAPTIONS` is written
   * against. The built `src` carries a content hash, so it cannot be the key. */
  id: string;
  caption: string;
}

/** `label` names the category for the fallback caption, so a photo dropped in
 * without a caption entry still reads as "Architecture 60" rather than blank.
 *
 * Shared with `albums.ts`, which loads one project folder at a time — the two
 * differ only in which glob they hand over. */
export function loadPhotos(globbed: Record<string, unknown>, label: string): GalleryPhoto[] {
  return Object.entries(globbed)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src], index) => {
      const id = path.split('/').pop()!.replace(/\.(jpe?g|png|webp)$/i, '');
      return {
        src: src as string,
        id,
        caption: GALLERY_CAPTIONS[id] ?? `${label} ${index + 1}`,
      };
    });
}

/* A category's photographs now sit one level down, in a folder per project
 * (arch/villa1, int/interiors2, …), so these recurse. The named albums in
 * `albums.ts` glob those same folders individually; a category page is the
 * whole category, album by album, which is what `**` gives. Same extension
 * list as the albums, so a category page can never show fewer photographs than
 * the albums inside it.
 *
 * That list now matches .JPG as well, which makes the negative pattern load
 * bearing rather than a belt-and-braces: interiors1 holds its untouched iCloud
 * originals — 300MB of 5MB photographs — in a subfolder beside the 1280px
 * copies the site serves, and they are exactly the same 82 pictures. Without
 * the exclusion this glob would now bundle all of them. */
const GALLERY_FOLDERS: Record<string, GalleryPhoto[]> = {
  architecture: loadPhotos(
    import.meta.glob(['../../../../attached_assets/gallery/arch/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'], {
      eager: true,
      import: 'default',
    }),
    'Architecture',
  ),
  interiors: loadPhotos(
    import.meta.glob(
      ['../../../../attached_assets/gallery/int/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', '!**/iCloud*/**'],
      {
        eager: true,
        import: 'default',
      },
    ),
    'Interiors',
  ),
  'terrace-scaping': loadPhotos(
    import.meta.glob(['../../../../attached_assets/gallery/terr/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'], {
      eager: true,
      import: 'default',
    }),
    'Terrace Scaping',
  ),
};

/* The six curated stills per category that the work grid leads its cards with.
 * They live in attached_assets/site rather than attached_assets/gallery, so the
 * folder globs above never reached them — yet they are renders of the same
 * projects, and none of them appeared on a gallery page at all. Four of the
 * eighteen (arch-01, arch-02, int-01, int-02) were being rendered nowhere on
 * the site.
 *
 * Globbed rather than imported one by one so `site/arch-07.jpg` joins the
 * architecture page the moment it is dropped in, which is how the gallery
 * folders already behave. The prefix is what assigns a still to its category,
 * so the naming convention is load bearing: a file has to be `arch-`, `int-` or
 * `terr-` to be picked up, and `house-plan.png` is left alone because it
 * matches none of them.
 *
 * Vite resolves these to the same modules `workCategories.ts` imports by name,
 * so a still used as a card and as a gallery tile is still one asset in the
 * build rather than two. */
const SITE_STILLS: Record<string, GalleryPhoto[]> = {
  architecture: loadPhotos(
    import.meta.glob('../../../../attached_assets/site/arch-*.jpg', { eager: true, import: 'default' }),
    'Architecture',
  ),
  interiors: loadPhotos(
    import.meta.glob('../../../../attached_assets/site/int-*.jpg', { eager: true, import: 'default' }),
    'Interiors',
  ),
  'terrace-scaping': loadPhotos(
    import.meta.glob('../../../../attached_assets/site/terr-*.jpg', { eager: true, import: 'default' }),
    'Terrace Scaping',
  ),
};

/* Folder photographs first, stills after — so a category page still opens on
 * its album covers rather than on a work-grid card the visitor has just
 * clicked past. */
export const GALLERY_IMAGES: Record<string, GalleryPhoto[]> = Object.fromEntries(
  Object.entries(GALLERY_FOLDERS).map(([slug, photos]) => [
    slug,
    [...photos, ...(SITE_STILLS[slug] ?? [])],
  ]),
);

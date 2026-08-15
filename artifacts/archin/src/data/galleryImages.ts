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
 * without a caption entry still reads as "Architecture 60" rather than blank. */
function load(globbed: Record<string, unknown>, label: string): GalleryPhoto[] {
  return Object.entries(globbed)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src], index) => {
      const id = path.split('/').pop()!.replace(/\.jpg$/i, '');
      return {
        src: src as string,
        id,
        caption: GALLERY_CAPTIONS[id] ?? `${label} ${index + 1}`,
      };
    });
}

export const GALLERY_IMAGES: Record<string, GalleryPhoto[]> = {
  architecture: load(
    import.meta.glob('../../../../attached_assets/gallery/arch/*.jpg', {
      eager: true,
      import: 'default',
    }),
    'Architecture',
  ),
  interiors: load(
    import.meta.glob('../../../../attached_assets/gallery/int/*.jpg', {
      eager: true,
      import: 'default',
    }),
    'Interiors',
  ),
  'terrace-scaping': load(
    import.meta.glob('../../../../attached_assets/gallery/terr/*.jpg', {
      eager: true,
      import: 'default',
    }),
    'Terrace Scaping',
  ),
};

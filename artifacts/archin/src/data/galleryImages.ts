/* Every gallery photograph, read straight off disk from attached_assets/gallery.
 * Adding a project is a matter of dropping a file into the right folder — no
 * edit here is needed. Sources are the client's ALL IMAGES drop, resized to
 * 1280px and re-encoded (166MB -> 26MB) so a 200-image page stays loadable. */
function load(globbed: Record<string, unknown>): string[] {
  return Object.entries(globbed)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src as string);
}

export const GALLERY_IMAGES: Record<string, string[]> = {
  architecture: load(
    import.meta.glob('../../../../attached_assets/gallery/arch/*.jpg', {
      eager: true,
      import: 'default',
    }),
  ),
  interiors: load(
    import.meta.glob('../../../../attached_assets/gallery/int/*.jpg', {
      eager: true,
      import: 'default',
    }),
  ),
  'terrace-scaping': load(
    import.meta.glob('../../../../attached_assets/gallery/terr/*.jpg', {
      eager: true,
      import: 'default',
    }),
  ),
};

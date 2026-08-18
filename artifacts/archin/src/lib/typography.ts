/* The initial cap that opens each leader bio. Both the About block on the home
   page and the Team page set bios for the same two people, so the treatment
   lives here rather than in either of them — the audit's recurring finding is
   that a style written out twice drifts, and this one is written out twice.

   1.35em with its own line-height: the enlarged glyph has to stay inside the
   paragraph's existing line box, or the first line of every bio would sit lower
   than the rest of it. 1.35 clears the ascender at all three body sizes in play
   (11px and 15px on About, 13px on Team) without reaching the top of the box.

   font-normal rather than something heavier because Cormorant Garamond is only
   loaded at 300 and 400 — a bolder class here would render at 400 anyway.

   Set in ink rather than the brand red: the size and the serif are what mark
   the letter, so it opens the paragraph without reading as a second accent
   under the job title, which is already red on both pages. */
export const BIO_INITIAL = 'font-serif font-normal text-[1.35em] leading-[1] uppercase text-black';

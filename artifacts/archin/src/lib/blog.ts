import imgArchitectsHyderabad from '../assets/blog/img1.jpeg';
import imgVillaHyderabad from '../assets/blog/img2.jpeg';
import imgCommercial from '../assets/blog/img3.jpeg';
import imgInteriorVizag from '../assets/blog/img4.jpeg';
import imgInteriorHyderabad from '../assets/blog/img5.jpeg';
import imgArchitectsVizag from '../assets/blog/img7.jpeg';

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetKeywords: string;
  imageAlt: string;
  image: string;
  body: string;
  faqs: BlogFaq[];
}

/* Each post is a plain .md file in src/content/blog — drop a new file in there
   (with the same frontmatter-style header block) and it appears automatically,
   no code changes needed. */
const rawModules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseFrontmatter(raw: string): { fields: Record<string, string>; body: string } {
  const separator = raw.match(/^---\s*$/m);
  if (!separator || separator.index === undefined) {
    return { fields: {}, body: raw.trim() };
  }

  const frontmatterText = raw.slice(0, separator.index);
  const body = raw.slice(separator.index + separator[0].length).replace(/^\s+/, '');

  const fields: Record<string, string> = {};
  const lineRe = /^\*\*(.+?):\*\*\s*(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = lineRe.exec(frontmatterText))) {
    const label = match[1].replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
    fields[label] = match[2].trim();
  }

  return { fields, body };
}

function parseTitle(body: string): string {
  const h1 = body.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : '';
}

function parseImageAlt(suggestedImageField: string): string {
  const match = suggestedImageField.match(/alt="([^"]+)"/);
  return match ? match[1] : '';
}

function parseFaqs(body: string): BlogFaq[] {
  const heading = body.match(/^#{2,3}\s*FAQs?\s*$/im);
  if (!heading || heading.index === undefined) return [];

  const faqSection = body.slice(heading.index + heading[0].length);
  const faqs: BlogFaq[] = [];
  const faqRe = /\*\*(.+?)\*\*\s*\n(.+?)(?=\n\s*\n\s*\*\*|\s*$)/gs;
  let match: RegExpExecArray | null;
  while ((match = faqRe.exec(faqSection))) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim().replace(/\s+/g, ' '),
    });
  }
  return faqs;
}

/* Hero image per post — each artwork carries the post's own title, so the
   pairing is fixed by slug rather than by file order. */
const POST_IMAGES: Record<string, string> = {
  'best-architects-in-hyderabad': imgArchitectsHyderabad,
  'best-interior-designers-in-hyderabad': imgInteriorHyderabad,
  'best-architects-in-visakhapatnam': imgArchitectsVizag,
  'best-interior-designers-in-visakhapatnam': imgInteriorVizag,
  'villa-independent-house-design-hyderabad': imgVillaHyderabad,
  'commercial-interior-design-hyderabad-visakhapatnam': imgCommercial,
};

function slugFromField(urlSlugField: string | undefined, fallback: string): string {
  if (!urlSlugField) return fallback;
  return urlSlugField.replace(/^\/?blog\//, '').replace(/\/$/, '');
}

function buildPost(path: string, raw: string): BlogPost {
  const { fields, body } = parseFrontmatter(raw);
  const fallbackSlug = path
    .split('/')
    .pop()!
    .replace(/^blog-\d+-/, '')
    .replace(/\.md$/, '');

  const title = parseTitle(body);
  const slug = slugFromField(fields['url slug'], fallbackSlug);

  return {
    slug,
    title,
    metaTitle: fields['meta title'] || title,
    metaDescription: fields['meta description'] || '',
    targetKeywords: fields['target keywords'] || '',
    imageAlt: parseImageAlt(fields['suggested image + alt text'] || ''),
    image: POST_IMAGES[slug] || imgArchitectsHyderabad,
    body,
    faqs: parseFaqs(body),
  };
}

export const BLOG_POSTS: BlogPost[] = Object.keys(rawModules)
  .sort()
  .map((path) => buildPost(path, rawModules[path]));

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

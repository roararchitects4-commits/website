import React, { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PenLine } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { getBlogPost } from '../lib/blog';
import { SITE_URL, SITE_NAME } from '../lib/siteConfig';

/* Internal /blog/:slug links use wouter's client-side router; everything else
   (mailto:, http(s):) opens as a normal link in a new tab. */
function MarkdownLink({ href, children, ...rest }: React.ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return (
      <Link href={href} className="text-accent no-underline hover:underline underline-offset-2">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent no-underline hover:underline underline-offset-2" {...rest}>
      {children}
    </a>
  );
}

const markdownComponents: Components = {
  a: MarkdownLink,
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="relative bg-background min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4 text-ink">Post not found</h1>
            <Link href="/blog" className="text-[11px] tracking-[0.2em] border-b border-accent pb-1 text-ink">
              RETURN TO BLOG
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const faqJsonLd = post.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        {post.targetKeywords && <meta name="keywords" content={post.targetKeywords} />}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.metaDescription} />
        {faqJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
      </Helmet>

      <SiteHeader />

      <main className="flex-1 pt-[70px] pb-[100px] px-[max(22px,5vw)] bg-white">
        <div className="max-w-[760px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors mb-8"
          >
            ← Back to Blog
          </Link>

          <div
            role="img"
            aria-label={post.imageAlt}
            className="w-full aspect-[16/7] rounded-[2rem] relative overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-ink via-[#3a2f28] to-accent flex items-center justify-center mb-10"
          >
            <PenLine size={34} strokeWidth={1.1} className="text-white/70" />
          </div>

          <article
            className="prose prose-neutral max-w-none
              prose-headings:font-serif prose-headings:font-normal prose-headings:text-ink
              prose-h1:text-[clamp(28px,4.4vw,46px)] prose-h1:leading-[1.15] prose-h1:mb-5
              prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-[18px] prose-h3:mt-8 prose-h3:mb-2 prose-h3:italic
              prose-p:text-muted prose-p:leading-relaxed prose-p:text-[15px]
              prose-li:text-muted prose-li:text-[15px]
              prose-strong:text-ink prose-strong:font-semibold
              prose-a:text-accent
              prose-hr:border-line prose-hr:my-10"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {post.body}
            </ReactMarkdown>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

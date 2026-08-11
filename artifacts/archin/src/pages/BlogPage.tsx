import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { PenLine } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { BLOG_POSTS } from '../lib/blog';
import { SITE_URL, SITE_NAME } from '../lib/siteConfig';

export default function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTitle = `Blog | ${SITE_NAME}`;
  const pageDescription = 'Guides and insights on architecture and interior design in Hyderabad and Visakhapatnam, from the ROAR Architects studio.';

  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
      </Helmet>

      <SiteHeader />

      <main className="flex-1 pt-[70px] pb-[100px] px-[max(22px,5vw)] bg-white">
        <div className="max-w-[1680px] mx-auto">
          <Link
            href="/#top"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors mb-8"
          >
            ← Back to Home
          </Link>

          <h1 className="font-serif font-light text-[clamp(36px,5vw,64px)] text-ink mb-3">
            Blog
          </h1>
          <p className="text-[13px] text-muted max-w-md mb-14">
            Guides and insights on architecture and interior design in Hyderabad and Visakhapatnam.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(18px,2.6vw,34px)]">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block w-full max-w-[360px] mx-auto"
              >
                <div
                  role="img"
                  aria-label={post.imageAlt}
                  className="aspect-[4/5] rounded-[2.5rem] relative overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-ink via-[#3a2f28] to-accent flex items-center justify-center"
                >
                  <PenLine size={30} strokeWidth={1.25} className="text-white/70 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="mt-4">
                  <h2 className="font-serif italic text-[15px] text-ink mb-1.5 font-normal tracking-normal leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[11px] tracking-[0.03em] text-muted leading-relaxed mb-2">
                    {post.metaDescription}
                  </p>
                  <span className="text-[10px] tracking-[0.18em] uppercase text-accent group-hover:underline underline-offset-4">
                    Read More ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

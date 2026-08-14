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

      <main className="flex-1 pt-1 pb-[70px] px-[max(22px,5vw)] bg-white">
        <div className="max-w-[1680px] mx-auto">
          <h1 className="flex items-center gap-3 font-serif font-light text-[clamp(28px,4vw,48px)] text-ink mb-1 leading-[1.05]">
            <Link
              href="/#top"
              aria-label="Back to Home"
              className="text-muted hover:text-accent transition-colors text-[0.6em]"
            >
              ←
            </Link>
            Blog
          </h1>
          <p className="text-[13px] text-muted max-w-md mt-1 mb-8">
            Guides and insights on architecture and interior design in Hyderabad and Visakhapatnam.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(14px,1.8vw,22px)]">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden border border-line bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  role="img"
                  aria-label={post.imageAlt}
                  className="aspect-[16/7] relative overflow-hidden bg-secondary-bg flex items-center justify-center"
                >
                  <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h2 className="font-serif italic text-[17px] text-ink mb-1.5 font-medium tracking-normal leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[12px] tracking-[0.03em] text-muted leading-relaxed mb-2.5">
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

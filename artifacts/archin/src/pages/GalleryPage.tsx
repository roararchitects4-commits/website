import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { ImagePlus } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { WORK_CATEGORIES, type WorkItem } from '../data/workCategories';

const PLACEHOLDER_COUNT = 3;

export default function GalleryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = WORK_CATEGORIES.find((c) => c.slug === slug);
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!category) {
    return (
      <div className="relative bg-background min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4 text-ink">Gallery not found</h1>
            <Link href="/#work" className="text-[11px] tracking-[0.2em] border-b border-accent pb-1 text-ink">
              RETURN TO OUR WORK
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 pt-[70px] pb-[100px] px-[max(22px,5vw)] bg-white">
        <div className="max-w-[1680px] mx-auto">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors mb-8"
          >
            ← Back to Our Work
          </Link>

          <h1 className="font-serif font-light text-[clamp(36px,5vw,64px)] text-ink mb-3">
            {category.label}
          </h1>
          <p className="text-[13px] text-muted max-w-md mb-14">
            The complete {category.label.toLowerCase()} gallery. More projects are added here regularly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(18px,2.6vw,34px)]">
            {category.items.map((item) => (
              <figure
                key={item.id}
                className="group cursor-pointer"
                onClick={() => setActiveItem(item)}
              >
                <div className="overflow-hidden aspect-[4/5] bg-secondary-bg relative rounded-[2.5rem] shadow-2xl border border-white/10">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <figcaption className="mt-4 text-[11px] tracking-[0.03em] text-muted leading-relaxed">
                  <b className="block font-serif italic text-[15px] text-ink mb-1 font-normal tracking-normal">
                    {item.title}
                  </b>
                  {item.desc}
                </figcaption>
              </figure>
            ))}

            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, idx) => (
              <figure key={`placeholder-${idx}`} className="opacity-60">
                <div className="aspect-[4/5] rounded-[2.5rem] border-2 border-dashed border-line flex flex-col items-center justify-center gap-3 text-muted">
                  <ImagePlus size={28} strokeWidth={1.25} />
                  <span className="text-[10px] tracking-[0.18em] uppercase">More coming soon</span>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {activeItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="max-w-[90vw] max-h-[90vh] overflow-hidden rounded-[2rem] bg-black shadow-[0_0_80px_rgba(0,0,0,0.85)] flex items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeItem.img}
              alt={activeItem.title}
              className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

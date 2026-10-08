import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const { artworks, loading } = useArtworks('all');

  const featuredWorks = useMemo(() => {
    const featured = artworks.filter((w) => w.featured);
    return featured.length > 0 ? featured.slice(0, 3) : artworks.slice(0, 3);
  }, [artworks]);

  return (
    <div className="bg-stone-950 text-stone-100">
      {/* Hero Section */}
      <section className="relative isolate min-h-[90vh] overflow-hidden flex items-center">
        <motion.img
          initial={{ scale: 1.08, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src="/hero-bg.jpg"
          alt="THEROSEPALLETTE artwork background"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/50 to-black/30" aria-hidden="true" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-20 sm:px-10 lg:px-16">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 border border-amber-300/40 bg-stone-900/60 backdrop-blur-sm px-3 sm:px-4 py-1 text-xs tracking-widest text-amber-200 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contemporary Fine Art · Nairobi, Kenya</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05]">
              THEROSE<br />
              <span className="italic font-light text-stone-300">PALLETTE</span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Explorations of texture, natural pigments, and African heritage landscapes. Original oil, acrylic, and charcoal compositions for private and institutional collectors worldwide.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/gallery"
                className="bg-amber-300 hover:bg-amber-200 text-stone-950 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition"
              >
                Explore Collection
              </Link>
              <Link
                to="/about"
                className="border border-stone-600 hover:border-amber-200 text-stone-200 px-8 py-3.5 text-xs uppercase tracking-widest transition"
              >
                The Artist
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Artwork Teaser */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Curated Selection</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white mt-1">Featured Compositions</h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-300 hover:text-amber-200 transition"
          >
            <span>View All Works ({artworks.length > 0 ? artworks.length : '6+'})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-stone-900 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWorks.map((work, index) => {
              const mainImg = work.image_url || '/placeholder-artwork.jpg';
              return (
                <motion.article
                  key={work.id}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
                  className="group flex flex-col justify-between border border-stone-900 bg-stone-950 p-3 hover:border-stone-800 transition"
                >
                  <Link to={`/artwork/${work.slug}`} className="block overflow-hidden relative bg-stone-900">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      src={mainImg}
                      alt={work.title}
                      loading="lazy"
                      className="h-80 w-full object-cover"
                    />
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-widest border backdrop-blur-md ${
                        work.status === 'sold'
                          ? 'bg-black/90 text-red-300 border-red-500/40 font-semibold'
                          : work.status === 'not_for_sale'
                          ? 'bg-stone-950/80 text-stone-400 border-stone-700'
                          : 'bg-stone-950/80 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {work.status === 'sold'
                        ? 'Sold'
                        : work.status === 'not_for_sale'
                        ? 'Private Collection'
                        : 'Available'}
                    </div>
                  </Link>

                  <div className="space-y-1.5 pt-4 px-1 pb-2">
                    <div className="flex items-baseline justify-between">
                      <Link to={`/artwork/${work.slug}`}>
                        <h3 className="text-lg font-medium text-white group-hover:text-amber-200 transition">
                          {work.title}
                        </h3>
                      </Link>
                      {work.year && <span className="text-xs text-stone-400 font-mono">{work.year}</span>}
                    </div>
                    {work.medium && <p className="text-xs text-stone-400">{work.medium}</p>}

                    <div className="flex items-center justify-between pt-2 border-t border-stone-900 text-xs">
                      <span className="text-stone-300 font-medium">
                        {work.status === 'sold'
                          ? 'Acquired'
                          : work.price
                          ? `KES ${Number(work.price).toLocaleString()}`
                          : 'Price on Inquiry'}
                      </span>
                      <Link
                        to={`/artwork/${work.slug}`}
                        className="text-amber-300/80 hover:text-amber-200 font-medium uppercase tracking-widest text-[10px]"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* Philosophy Statement Banner */}
      <section className="bg-stone-900/60 border-y border-stone-800 py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-mono">Studio Philosophy</span>
          <p className="font-serif text-2xl sm:text-4xl text-white font-light italic leading-relaxed">
            "Every brushstroke honors the raw texture of East African soil, the stillness of dusk, and the living soul of organic materials."
          </p>
          <div className="pt-4">
            <Link
              to="/about"
              className="text-xs uppercase tracking-widest text-stone-300 hover:text-amber-200 border-b border-amber-300 pb-1"
            >
              Read Full Biography & Exhibitions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

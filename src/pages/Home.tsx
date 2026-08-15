import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchArtworks } from '../lib/sanity';
import { Artwork } from '../types/artwork';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks().then((data) => {
      setWorks(data.filter((w) => w.featured));
      setLoading(false);
    });
  }, []);

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
              <span>Studio Collection & Print Shop</span>
            </div>

            {/* TODO: Customize Artist Name */}
            <p className="font-serif text-5xl leading-none tracking-[0.08em] text-white sm:text-7xl lg:text-8xl">
              THEROSEPALLETTE
            </p>

            {/* TODO: Customize Artist Headline */}
            <h1 className="max-w-2xl text-xl font-light leading-relaxed text-stone-200 sm:text-3xl font-sans">
              Nairobi-Kenya based visual artist.Exploring identity, memory, and the boundary between observer and observed through the "Crows" lens
            </h1>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/gallery"
                className="border border-white bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-transparent hover:text-white"
              >
                Explore Works & Shop
              </Link>
              <Link
                to="/contact"
                className="text-xs uppercase tracking-widest text-stone-200 border border-stone-700 px-6 py-3.5 transition hover:border-amber-200 hover:text-amber-200"
              >
                Commission Inquiry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Curated Selection</span>
            <h2 className="font-serif text-4xl text-white sm:text-5xl">Featured Artworks</h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-300 hover:text-amber-200 transition"
          >
            <span>View All Works ({works.length > 0 ? works.length : '6+'})</span>
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
            {works.map((work, index) => {
              const mainImg = work.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5';
              return (
                <motion.article
                  key={work._id}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
                  className="group flex flex-col justify-between border border-stone-900 bg-stone-950 p-3 hover:border-stone-800 transition"
                >
                  <Link to={`/artwork/${work.slug.current}`} className="block overflow-hidden relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      src={mainImg}
                      alt={work.title}
                      className="h-80 w-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-widest text-stone-300 border border-stone-800">
                      {work.status === 'sold' ? 'Sold' : work.status === 'inquire' ? 'Inquire' : 'Available'}
                    </div>
                  </Link>

                  <div className="space-y-1.5 pt-4 px-1 pb-2">
                    <div className="flex items-baseline justify-between">
                      <Link to={`/artwork/${work.slug.current}`}>
                        <h3 className="text-lg font-medium text-white group-hover:text-amber-200 transition">
                          {work.title}
                        </h3>
                      </Link>
                      <span className="text-xs text-stone-400 font-mono">{work.year}</span>
                    </div>
                    <p className="text-xs text-stone-400">{work.medium}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-900 text-xs">
                      <span className="text-stone-300 font-medium">
                        {work.price?.kes ? `KES ${work.price.kes.toLocaleString()}` : 'Price on Inquiry'}
                      </span>
                      <Link
                        to={`/artwork/${work.slug.current}`}
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

      {/* Artist Statement Teaser */}
      <section className="border-y border-stone-900 bg-stone-950/60 py-20 px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Artist Statement</span>
            {/* TODO: Customize Artist Philosophy */}
            <h2 className="font-serif text-4xl text-white sm:text-5xl leading-tight">
              "I paint the discomfort of being seen — fusing human and crow to ask who's really watching whom."
            </h2>
            {/* TODO: Customize Bio Teaser Text */}
            <p className="text-stone-300 text-base leading-relaxed">
             My work sits inside that discomfort. I fuse human forms with crow skulls and features not to make a costume, but to ask a genuine question: when you are the one being watched, what does that do to your sense of self? And more importantly, who is actually watching you through the parts of your life no one else sees? Usually, the answer is uncomfortable in its simplicity: you are.
            </p>
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-stone-700 px-6 py-3 text-xs uppercase tracking-widest text-stone-200 hover:border-amber-200 hover:text-amber-200 transition"
              >
                <span>Read Full Biography & CV</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* TODO: Replace photo with actual portrait of artist in studio */}
            <img
              src="/artist-portrait.jpg"
              alt="THEROSEPALLETTE in studio"
              className="h-[32rem] w-full object-cover rounded border border-stone-800"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

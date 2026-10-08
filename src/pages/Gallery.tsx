import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import { ArtworkStatus } from '../types/artwork';
import { Filter, ShoppingBag } from 'lucide-react';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = (searchParams.get('status') || 'all') as ArtworkStatus | 'all';
  const selectedMedium = searchParams.get('medium') || 'all';

  const { artworks, loading, error } = useArtworks(selectedStatus === 'all' ? undefined : selectedStatus);

  // Extract unique mediums for the filter bar
  const availableMediums = [
    'all',
    ...Array.from(new Set(artworks.map((a) => a.medium).filter(Boolean) as string[])),
  ];

  const filteredArtworks = artworks.filter((item) => {
    if (selectedMedium !== 'all') {
      if (!item.medium?.toLowerCase().includes(selectedMedium.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const updateStatusFilter = (st: string) => {
    const params = new URLSearchParams(searchParams);
    if (st === 'all') {
      params.delete('status');
    } else {
      params.set('status', st);
    }
    setSearchParams(params);
  };

  const updateMediumFilter = (med: string) => {
    const params = new URLSearchParams(searchParams);
    if (med === 'all') {
      params.delete('medium');
    } else {
      params.set('medium', med);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-12 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Studio Archive & Store</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white">Full Gallery Collection</h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Browse original creations, curated series, and archived works by THEROSEPALLETTE. Worldwide insured collector shipping from Nairobi.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-y border-stone-800 py-6">
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-stone-400 mr-2 flex items-center gap-1.5 font-medium">
              <ShoppingBag className="w-3.5 h-3.5" /> Status:
            </span>
            {[
              { label: 'All Works', val: 'all' },
              { label: 'Available', val: 'available' },
              { label: 'Sold Archive', val: 'sold' },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => updateStatusFilter(f.val)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
                  selectedStatus === f.val
                    ? 'bg-amber-200 text-stone-950 font-semibold'
                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Medium Filters */}
          {availableMediums.length > 2 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-stone-400 mr-2 flex items-center gap-1.5 font-medium">
                <Filter className="w-3.5 h-3.5" /> Medium:
              </span>
              {availableMediums.slice(0, 5).map((med) => (
                <button
                  key={med}
                  onClick={() => updateMediumFilter(med)}
                  className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
                    selectedMedium.toLowerCase() === med.toLowerCase()
                      ? 'bg-stone-100 text-stone-950 font-semibold'
                      : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  {med}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-stone-900 bg-stone-950 p-4 space-y-4">
                <div className="h-80 bg-stone-900 animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-5 bg-stone-900 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-stone-900/60 animate-pulse rounded w-1/2" />
                </div>
                <div className="pt-4 border-t border-stone-900 flex justify-between items-center">
                  <div className="h-4 bg-stone-900 animate-pulse rounded w-1/3" />
                  <div className="h-7 bg-stone-900 animate-pulse rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-stone-800 rounded">
            <p className="text-stone-400 text-lg">No artworks found matching your current filter criteria.</p>
            <button
              onClick={() => setSearchParams({})}
              className="text-xs uppercase tracking-widest text-amber-300 underline underline-offset-4 hover:text-amber-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredArtworks.map((work) => {
                const imgUrl = work.image_url || '/placeholder-artwork.jpg';
                const dimensions = work.width_cm && work.height_cm ? `${work.width_cm} × ${work.height_cm} cm` : null;

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    key={work.id}
                    className="group border border-stone-900 bg-stone-950 p-4 hover:border-stone-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <Link to={`/artwork/${work.slug}`} className="block relative overflow-hidden mb-4 bg-stone-900">
                        <motion.img
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.4 }}
                          src={imgUrl}
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

                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between">
                          <Link to={`/artwork/${work.slug}`}>
                            <h2 className="text-xl font-medium text-white group-hover:text-amber-200 transition">
                              {work.title}
                            </h2>
                          </Link>
                          {work.year && <span className="text-xs text-stone-400 font-mono">{work.year}</span>}
                        </div>
                        {work.medium && <p className="text-xs text-stone-400">{work.medium}</p>}
                        {dimensions && <p className="text-xs text-stone-500">{dimensions}</p>}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-900 flex items-center justify-between">
                      <div className="text-sm">
                        {work.status === 'sold' ? (
                          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">
                            Acquired
                          </span>
                        ) : work.price ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-stone-200">
                              KES {Number(work.price).toLocaleString()}
                            </span>
                            {work.price_usd && (
                              <span className="text-[11px] text-stone-400">
                                ~ USD ${Number(work.price_usd).toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 italic">Inquire for Details</span>
                        )}
                      </div>

                      <Link
                        to={`/artwork/${work.slug}`}
                        className="border border-stone-700 hover:border-amber-200 hover:bg-amber-200 hover:text-stone-950 px-3.5 py-1.5 text-[11px] uppercase tracking-wider transition text-stone-200"
                      >
                        {work.status === 'sold' ? 'View Details' : 'View & Inquire'}
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

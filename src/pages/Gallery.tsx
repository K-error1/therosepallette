import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchArtworks } from '../lib/sanity';
import { Artwork } from '../types/artwork';
import { Filter, ShoppingBag } from 'lucide-react';

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const selectedStatus = searchParams.get('filter') || 'all';

  useEffect(() => {
    fetchArtworks().then((data) => {
      setArtworks(data);
      setLoading(false);
    });
  }, []);

  const categories = ['all', 'Paintings', 'Drawings'];

  const filteredArtworks = artworks.filter((item) => {
    // Category match
    let categoryMatch = false;
    if (
      selectedCategory === 'all' ||
      selectedCategory.toLowerCase() === 'paintings' ||
      selectedCategory.toLowerCase() === 'drawings'
    ) {
      categoryMatch = true;
    } else {
      categoryMatch = item.category?.some(
        (c) => c.toLowerCase() === selectedCategory.toLowerCase()
      ) || false;
    }

    // Status match
    let statusMatch = true;
    if (selectedStatus === 'available') {
      statusMatch = item.status === 'available';
    } else if (selectedStatus === 'prints') {
      statusMatch = item.type === 'print' || item.type === 'both';
    } else if (selectedStatus === 'sold') {
      statusMatch = item.status === 'sold';
    }

    return categoryMatch && statusMatch;
  });

  const updateCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const updateStatusFilter = (st: string) => {
    const params = new URLSearchParams(searchParams);
    if (st === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', st);
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
            Browse original works, available prints, and archived pieces. Worldwide insured shipping available from Nairobi.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-y border-stone-800 py-6">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-stone-400 mr-2 flex items-center gap-1.5 font-medium">
              <Filter className="w-3.5 h-3.5" /> Medium:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateCategory(cat)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-amber-200 text-stone-950 font-semibold'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Availability Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-stone-400 mr-2 flex items-center gap-1.5 font-medium">
              <ShoppingBag className="w-3.5 h-3.5" /> Status:
            </span>
            {[
              { label: 'All Works', val: 'all' },
              { label: 'Available Original', val: 'available' },
              { label: 'Prints Available', val: 'prints' },
              { label: 'Sold Archive', val: 'sold' },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => updateStatusFilter(f.val)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
                  selectedStatus === f.val
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-stone-900 animate-pulse rounded" />
            ))}
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-stone-800 rounded">
            <p className="text-stone-400 text-lg">No artworks found matching your current filter criteria.</p>
            <button
              onClick={() => setSearchParams({})}
              className="text-xs uppercase tracking-widest text-amber-300 underline underline-offset-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredArtworks.map((work) => {
                const imgUrl =
                  work.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80';

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    key={work._id}
                    className="group border border-stone-900 bg-stone-950 p-4 hover:border-stone-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <Link to={`/artwork/${work.slug.current}`} className="block relative overflow-hidden mb-4">
                        <motion.img
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.4 }}
                          src={imgUrl}
                          alt={work.title}
                          className="h-80 w-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-widest text-stone-200 border border-stone-800">
                          {work.status === 'sold'
                            ? 'Sold'
                            : work.type === 'print'
                            ? 'Print Only'
                            : work.type === 'both'
                            ? 'Original'
                            : 'Original Work'}
                        </div>
                      </Link>

                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between">
                          <Link to={`/artwork/${work.slug.current}`}>
                            <h2 className="text-xl font-medium text-white group-hover:text-amber-200 transition">
                              {work.title}
                            </h2>
                          </Link>
                          <span className="text-xs text-stone-400 font-mono">{work.year}</span>
                        </div>
                        <p className="text-xs text-stone-400">{work.medium}</p>
                        <p className="text-xs text-stone-500">{work.dimensions}</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-900 flex items-center justify-between">
                      <div className="text-sm">
                        {work.price?.kes ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-stone-200">
                              KES {work.price.kes.toLocaleString()}
                            </span>
                            {work.price.usd && (
                              <span className="text-[11px] text-stone-400">
                                ~ USD ${work.price.usd.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 italic">Inquire for Pricing</span>
                        )}
                      </div>

                      <Link
                        to={`/artwork/${work.slug.current}`}
                        className="border border-stone-700 hover:border-amber-200 hover:bg-amber-200 hover:text-stone-950 px-3.5 py-1.5 text-[11px] uppercase tracking-wider transition text-stone-200"
                      >
                        View & Buy
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

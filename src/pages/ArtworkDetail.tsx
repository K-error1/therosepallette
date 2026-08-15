import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { fetchArtworkBySlug } from '../lib/sanity';
import { Artwork } from '../types/artwork';
import ImageZoomModal from '../components/ImageZoomModal';
import { ArrowLeft, ZoomIn, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null); // 'original' | 'print'
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchArtworkBySlug(slug).then((data) => {
        setArtwork(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-400 text-xs uppercase tracking-widest">Loading Artwork Details...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="font-serif text-3xl text-white">Artwork Not Found</h1>
          <p className="text-stone-400 text-sm">The artwork you are looking for may have been renamed or archived.</p>
          <Link
            to="/gallery"
            className="inline-block border border-amber-200 px-6 py-3 text-xs uppercase tracking-widest text-amber-200 hover:bg-amber-200 hover:text-stone-950 transition"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const activeImage =
    artwork.images?.[activeImageIndex]?.url ||
    artwork.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80';

  const handleCheckout = (purchaseType: 'original' | 'print') => {
    setPurchasing(purchaseType);
    setPurchaseError(null);
    window.location.href = `/contact?artwork=${encodeURIComponent(artwork.title)}&type=${purchaseType}`;
  };

  const canonicalUrl = `${window.location.origin}/artwork/${artwork.slug.current}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-6 sm:px-10 lg:px-16">
      {/* Open Graph Meta Tags for Instagram link-in-bio & social sharing */}
      <Helmet>
        <title>{`${artwork.title} | THEROSEPALLETTE`}</title>
        <meta name="description" content={`${artwork.title} - ${artwork.medium}, ${artwork.year}. ${artwork.description}`} />
        <meta property="og:title" content={`${artwork.title} by THEROSEPALLETTE`} />
        <meta property="og:description" content={`${artwork.medium}, ${artwork.dimensions}. ${artwork.description}`} />
        <meta property="og:image" content={activeImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${artwork.title} | THEROSEPALLETTE`} />
        <meta name="twitter:image" content={activeImage} />
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Back Link */}
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 hover:text-amber-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>

        {/* Main Artwork Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Viewer & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative group overflow-hidden bg-stone-900 border border-stone-800 rounded">
              <img
                src={activeImage}
                alt={artwork.title}
                className="w-full max-h-[70vh] object-contain mx-auto cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
              />
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 flex items-center gap-2 bg-stone-950/85 backdrop-blur-md px-3 py-2 text-xs uppercase tracking-widest text-stone-200 border border-stone-700 hover:border-amber-200 transition"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Zoom Image</span>
              </button>
            </div>

            {/* Thumbnails */}
            {artwork.images && artwork.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {artwork.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 overflow-hidden border transition ${
                      activeImageIndex === idx ? 'border-amber-300 opacity-100' : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt || artwork.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Artwork Metadata & Purchase Box */}
          <div className="lg:col-span-5 space-y-8 bg-stone-900/40 p-8 border border-stone-800 rounded">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-amber-300 border border-amber-300/40 px-2.5 py-0.5 font-medium">
                  {artwork.status === 'sold' ? 'Sold Archive' : artwork.status === 'inquire' ? 'Inquire Only' : 'Available'}
                </span>
                <span className="text-xs text-stone-500 font-mono">{artwork.year}</span>
              </div>
              <h1 className="font-serif text-4xl text-white sm:text-5xl">{artwork.title}</h1>
              <p className="text-sm text-stone-300 font-medium">{artwork.medium}</p>
              <p className="text-xs text-stone-400 font-mono">{artwork.dimensions}</p>
            </div>

            {/* Pricing Section */}
            <div className="border-y border-stone-800 py-6 space-y-4">
              {/* Original Price */}
              {(artwork.type === 'original' || artwork.type === 'both') && (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-stone-400">Original Artwork</p>
                  {artwork.price?.kes ? (
                    <div>
                      <div className="text-2xl font-serif text-amber-200">
                        KES {artwork.price.kes.toLocaleString()}
                      </div>
                      {artwork.price.usd && (
                        <p className="text-xs text-stone-400 font-mono">
                          Approx. USD ${artwork.price.usd.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-300 italic">Price available upon private inquiry</p>
                  )}
                </div>
              )}

              {/* Print Price */}
              {(artwork.type === 'print' || artwork.type === 'both') && (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-stone-400">Archival Limited Print</p>
                  <div className="text-xl font-serif text-stone-200">
                    KES {(artwork.printPrice?.kes || 2000).toLocaleString()}
                  </div>
                  <p className="text-xs text-stone-400 font-mono">
                    Approx. USD ${(artwork.printPrice?.usd || 15).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 text-stone-300 text-sm leading-relaxed">
              <p className="text-xs uppercase tracking-widest text-stone-400">Curator Statement</p>
              <p>{artwork.description}</p>
            </div>

            {/* Category Tags */}
            {artwork.category && artwork.category.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {artwork.category.map((cat) => (
                  <span key={cat} className="text-[10px] uppercase tracking-widest text-stone-400 bg-stone-900 px-2.5 py-1 rounded">
                    #{cat}
                  </span>
                ))}
              </div>
            )}

            {/* Action & Checkout Buttons */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              {purchaseError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2 rounded">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{purchaseError}</span>
                </div>
              )}

              {artwork.status === 'available' || artwork.status === 'inquire' ? (
                <div className="space-y-3">
                  {(artwork.type === 'original' || artwork.type === 'both') && artwork.status === 'available' && (
                    <button
                      onClick={() => handleCheckout('original')}
                      disabled={purchasing === 'original'}
                      className="w-full flex items-center justify-center gap-2 border border-amber-300 bg-amber-300 px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-950 hover:bg-amber-200 transition disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>
                        {purchasing === 'original'
                          ? 'Redirecting to Inquiry Form...'
                          : `Buy Original (${artwork.price?.kes ? `KES ${artwork.price.kes.toLocaleString()}` : 'Order'})`}
                      </span>
                    </button>
                  )}

                  {(artwork.type === 'print' || artwork.type === 'both') && (
                    <button
                      onClick={() => handleCheckout('print')}
                      disabled={purchasing === 'print'}
                      className="w-full flex items-center justify-center gap-2 border border-stone-700 bg-stone-900 px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-100 hover:border-amber-200 hover:text-amber-200 transition disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>
                        {purchasing === 'print' 
                          ? 'Redirecting to Inquiry Form...' 
                          : `Buy Archival Print (KES ${(artwork.printPrice?.kes || 2000).toLocaleString()})`}
                      </span>
                    </button>
                  )}

                  <Link
                    to={`/contact?artwork=${encodeURIComponent(artwork.title)}`}
                    className="w-full flex items-center justify-center gap-2 border border-stone-800 px-6 py-3.5 text-xs uppercase tracking-widest text-stone-400 hover:text-stone-200 hover:border-stone-600 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Inquire / Private Collector Reserve</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-stone-900 border border-stone-800 text-stone-300 text-xs flex items-center gap-2 rounded">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>This original piece is currently held in a private collection.</span>
                  </div>

                  {(artwork.type === 'print' || artwork.type === 'both') && (
                    <button
                      onClick={() => handleCheckout('print')}
                      disabled={purchasing === 'print'}
                      className="w-full flex items-center justify-center gap-2 border border-amber-300 px-6 py-4 text-xs font-bold uppercase tracking-widest text-amber-200 hover:bg-amber-300 hover:text-stone-950 transition"
                    >
                      <Mail className="w-4 h-4" />
                      <span>
                        {purchasing === 'print' 
                          ? 'Redirecting to Inquiry Form...' 
                          : `Order Limited Edition Print (KES ${(artwork.printPrice?.kes || 2000).toLocaleString()})`}
                      </span>
                    </button>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageUrl={activeImage}
        altText={artwork.title}
      />
    </div>
  );
}

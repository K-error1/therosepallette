import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getArtworkBySlug } from '../hooks/useArtworks';
import { Artwork } from '../types/artwork';
import ImageZoomModal from '../components/ImageZoomModal';
import { ArrowLeft, ZoomIn, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getArtworkBySlug(slug).then((data) => {
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
          <p className="text-stone-400 text-sm">The artwork you are looking for may have been archived or renamed.</p>
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

  const activeImage = artwork.image_url || '/placeholder-artwork.jpg';
  const dimensions = artwork.width_cm && artwork.height_cm ? `${artwork.width_cm} × ${artwork.height_cm} cm` : null;
  const canonicalUrl = `${window.location.origin}/artwork/${artwork.slug}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-6 sm:px-10 lg:px-16">
      {/* Open Graph Meta Tags for Instagram link-in-bio & social sharing */}
      <Helmet>
        <title>{`${artwork.title} | THEROSEPALLETTE`}</title>
        <meta name="description" content={`${artwork.title} - ${artwork.medium || ''}, ${artwork.year || ''}. ${artwork.description || ''}`} />
        <meta property="og:title" content={`${artwork.title} by THEROSEPALLETTE`} />
        <meta property="og:description" content={`${artwork.medium || ''}, ${dimensions || ''}. ${artwork.description || ''}`} />
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
          {/* Left Column: Image Viewer */}
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
          </div>

          {/* Right Column: Artwork Metadata & Inquire Box */}
          <div className="lg:col-span-5 space-y-8 bg-stone-900/40 p-8 border border-stone-800 rounded">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs uppercase tracking-widest border px-2.5 py-0.5 font-medium ${
                    artwork.status === 'sold'
                      ? 'text-red-300 border-red-500/40 bg-red-950/30'
                      : artwork.status === 'not_for_sale'
                      ? 'text-stone-400 border-stone-700 bg-stone-900'
                      : 'text-amber-300 border-amber-300/40 bg-amber-950/30'
                  }`}
                >
                  {artwork.status === 'sold'
                    ? 'Sold Archive'
                    : artwork.status === 'not_for_sale'
                    ? 'Private Collection'
                    : 'Available'}
                </span>
                {artwork.year && <span className="text-xs text-stone-500 font-mono">{artwork.year}</span>}
              </div>
              <h1 className="font-serif text-4xl text-white sm:text-5xl">{artwork.title}</h1>
              {artwork.medium && <p className="text-sm text-stone-300 font-medium">{artwork.medium}</p>}
              {dimensions && <p className="text-xs text-stone-400 font-mono">{dimensions}</p>}
            </div>

            {/* Pricing Section */}
            <div className="border-y border-stone-800 py-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-stone-400">Original Artwork</p>
                {artwork.status === 'sold' ? (
                  <p className="text-sm text-stone-400 italic">Held in private collection</p>
                ) : artwork.price ? (
                  <div>
                    <div className="text-2xl font-serif text-amber-200">
                      KES {Number(artwork.price).toLocaleString()}
                    </div>
                    {artwork.price_usd && (
                      <p className="text-xs text-stone-400 font-mono">
                        Approx. USD ${Number(artwork.price_usd).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-stone-300 italic">Price available upon private inquiry</p>
                )}
              </div>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="space-y-2 text-stone-300 text-sm leading-relaxed">
                <p className="text-xs uppercase tracking-widest text-stone-400">Curator Statement</p>
                <p className="whitespace-pre-line">{artwork.description}</p>
              </div>
            )}

            {/* Action & Inquire Buttons */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              {artwork.status === 'available' ? (
                <div className="space-y-3">
                  <Link
                    to={`/contact?artwork=${encodeURIComponent(artwork.title)}`}
                    className="w-full flex items-center justify-center gap-2 border border-amber-300 bg-amber-300 px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-950 hover:bg-amber-200 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Inquire / Collector Reservation</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-stone-900 border border-stone-800 text-stone-300 text-xs flex items-center gap-2 rounded">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>This original piece is currently held in a private collection.</span>
                  </div>
                  <Link
                    to={`/contact?artwork=${encodeURIComponent(`Commission similar to ${artwork.title}`)}`}
                    className="w-full flex items-center justify-center gap-2 border border-stone-800 px-6 py-3.5 text-xs uppercase tracking-widest text-stone-300 hover:text-white hover:border-stone-600 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Request Commission in This Style</span>
                  </Link>
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

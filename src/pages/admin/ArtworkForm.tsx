import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase, uploadArtworkImage, deleteArtworkImage, slugify, getArtworkImageUrl } from '../../lib/supabase';
import { getArtworkById } from '../../hooks/useArtworks';
import { ArtworkStatus } from '../../types/artwork';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';

export default function ArtworkForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState('');
  const [widthCm, setWidthCm] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [priceKes, setPriceKes] = useState<string>('');
  const [priceUsd, setPriceUsd] = useState<string>('');
  const [status, setStatus] = useState<ArtworkStatus>('available');
  const [featured, setFeatured] = useState(false);

  // Image states
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Loading & notification states
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-slug generation for new artwork unless manually touched
  const [manualSlug, setManualSlug] = useState(false);

  useEffect(() => {
    if (!manualSlug && !isEditMode && title) {
      setSlug(slugify(title));
    }
  }, [title, manualSlug, isEditMode]);

  // Load existing artwork if in edit mode
  useEffect(() => {
    async function loadArtwork() {
      if (!id) return;
      setInitialLoading(true);
      try {
        const item = await getArtworkById(id);
        if (!item) {
          setErrorMessage('Artwork not found.');
          return;
        }

        setTitle(item.title || '');
        setSlug(item.slug || '');
        setDescription(item.description || '');
        setMedium(item.medium || '');
        setWidthCm(item.width_cm ? item.width_cm.toString() : '');
        setHeightCm(item.height_cm ? item.height_cm.toString() : '');
        setYear(item.year ? item.year.toString() : '');
        setPriceKes(item.price ? item.price.toString() : '');
        setPriceUsd(item.price_usd ? item.price_usd.toString() : '');
        setStatus(item.status || 'available');
        setFeatured(Boolean(item.featured));
        setCurrentImagePath(item.image_path || null);
        if (item.image_path) {
          setImagePreview(getArtworkImageUrl(item.image_path));
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load artwork.');
      } finally {
        setInitialLoading(false);
      }
    }

    if (isEditMode) {
      loadArtwork();
    }
  }, [id, isEditMode]);

  // Handle image file selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setErrorMessage(null);
    setNewImageFile(file);

    // Live local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSaving(true);
    setStatusMessage('Validating artwork details...');

    if (!title.trim()) {
      setErrorMessage('Please enter an artwork title.');
      setSaving(false);
      return;
    }

    const finalSlug = (slug.trim() || slugify(title)).trim();
    if (!finalSlug) {
      setErrorMessage('A unique URL slug is required.');
      setSaving(false);
      return;
    }

    // Require an image for new artwork
    if (!isEditMode && !newImageFile) {
      setErrorMessage('Please select an artwork photo to upload.');
      setSaving(false);
      return;
    }

    try {
      let finalImagePath = currentImagePath;

      // 1. Upload new image if chosen
      if (newImageFile) {
        setStatusMessage('Optimizing & compressing image for fast loading...');
        const uploadRes = await uploadArtworkImage(newImageFile, finalSlug);
        finalImagePath = uploadRes.path;

        // If replacing an image in edit mode, delete old storage file
        if (isEditMode && currentImagePath && currentImagePath !== finalImagePath) {
          await deleteArtworkImage(currentImagePath);
        }
      }

      setStatusMessage('Saving artwork to database...');

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        description: description.trim() || null,
        medium: medium.trim() || null,
        width_cm: widthCm ? parseFloat(widthCm) : null,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        year: year ? parseInt(year, 10) : null,
        price: priceKes ? parseFloat(priceKes) : null,
        price_usd: priceUsd ? parseFloat(priceUsd) : null,
        status,
        featured,
        image_path: finalImagePath,
      };

      if (isEditMode && id) {
        const { error } = await supabase.from('artworks').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('artworks').insert([payload]);
        if (error) throw error;
      }

      navigate('/admin', { replace: true });
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrorMessage(err.message || 'Failed to save artwork. Please check your connection.');
    } finally {
      setSaving(false);
      setStatusMessage(null);
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-400 text-xs uppercase tracking-widest">Loading artwork details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 hover:text-amber-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
            {isEditMode ? 'Editing Artwork' : 'New Creation'}
          </span>
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white">
            {isEditMode ? `Edit "${title || 'Artwork'}"` : 'Add New Artwork'}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Fill in the details below. Photos are automatically compressed client-side before uploading.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-950/50 border border-red-500/40 rounded-lg p-4 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {statusMessage && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 flex items-center gap-2.5 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-stone-900/40 border border-stone-800/80 p-6 sm:p-8 rounded-xl">
          {/* 1. Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium">
              Artwork Photography <span className="text-amber-400">*</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
                imagePreview
                  ? 'border-stone-700 bg-stone-950/40 hover:border-amber-400/60'
                  : 'border-stone-800 hover:border-amber-400/50 bg-stone-950/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group w-full flex flex-col items-center">
                  <div className="max-h-72 max-w-full rounded-lg overflow-hidden border border-stone-800 shadow-xl mb-3">
                    <img src={imagePreview} alt="Preview" className="max-h-72 object-contain mx-auto" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-medium bg-stone-900/90 border border-stone-700 px-3 py-1.5 rounded-full shadow">
                    <Upload className="w-3.5 h-3.5" /> Tap or click to replace image
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-200 font-medium">
                      Tap or click to select photo
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      JPG, PNG, or WebP. Automatically optimized for fast mobile viewing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Core Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Artwork Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Golden Ochre Horizon"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                URL Slug <span className="text-stone-500 text-[10px]">(for web link)</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setManualSlug(true);
                }}
                placeholder="golden-ochre-horizon"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 font-mono transition"
              />
            </div>
          </div>

          {/* 3. Medium & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Medium / Technique
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Oil on Belgian linen"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Width (cm)
              </label>
              <input
                type="number"
                step="any"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
                placeholder="e.g. 120"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Height (cm)
              </label>
              <input
                type="number"
                step="any"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 90"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
              />
            </div>
          </div>

          {/* 4. Year & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Creation Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Price (KES) <span className="text-stone-500 text-[10px]">(optional)</span>
              </label>
              <input
                type="number"
                value={priceKes}
                onChange={(e) => setPriceKes(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Price (USD) <span className="text-stone-500 text-[10px]">(optional)</span>
              </label>
              <input
                type="number"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="e.g. 1150"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition font-mono"
              />
            </div>
          </div>

          {/* 5. Status & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
                Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArtworkStatus)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-300 transition capitalize"
              >
                <option value="available">Available (For Sale)</option>
                <option value="sold">Sold (Marked as Sold)</option>
                <option value="not_for_sale">Not For Sale / Private Collection</option>
              </select>
            </div>

            <div className="pt-2 sm:pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-700 text-amber-400 focus:ring-amber-400 bg-stone-950"
                />
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-200 font-medium">
                    Feature on Homepage
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Highlights this piece in the curated hero showcase.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 6. Description / Artist Note */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-medium">
              Artwork Description / Artist Note
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Inspiration, narrative, or material details about this piece..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-800/80">
            <Link
              to="/admin"
              className="w-full sm:w-auto px-5 py-2.5 border border-stone-700 hover:border-stone-500 rounded-lg text-xs uppercase tracking-wider text-stone-300 text-center transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest transition disabled:opacity-50 shadow-lg shadow-amber-950/20"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Piece...' : isEditMode ? 'Update Artwork' : 'Publish Artwork'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

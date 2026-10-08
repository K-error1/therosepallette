import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useArtworks,
  deleteArtwork,
  updateArtworkSortOrder,
  seedOriginalArtworksToSupabase
} from '../../hooks/useArtworks';
import { supabase } from '../../lib/supabase';
import { Artwork, ArtworkStatus } from '../../types/artwork';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Database
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { artworks, loading, error, isUsingFallback, refetch } = useArtworks('all');
  const [filter, setFilter] = useState<ArtworkStatus | 'all'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Artwork | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  async function handleSeedImport() {
    setSeedingLoading(true);
    try {
      const res = await seedOriginalArtworksToSupabase();
      showToast(`Successfully imported ${res.count} original artworks to your Supabase database!`);
      refetch();
    } catch (err: any) {
      console.error('Seed import failed:', err);
      showToast(err.message || 'Failed to import artworks to database.', 'error');
    } finally {
      setSeedingLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteModal) return;
    setActionLoading(true);

    try {
      await deleteArtwork(deleteModal.id, deleteModal.image_path);
      showToast(`"${deleteModal.title}" was permanently removed.`);
      setDeleteModal(null);
      refetch();
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast(err.message || 'Failed to delete artwork.', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMove(artwork: Artwork, direction: 'up' | 'down') {
    const currentIndex = artworks.findIndex((a) => a.id === artwork.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= artworks.length) return;

    const targetArtwork = artworks[targetIndex];

    try {
      const currentOrder = artwork.sort_order || currentIndex;
      const targetOrder = targetArtwork.sort_order || targetIndex;

      await updateArtworkSortOrder(artwork.id, targetOrder);
      await updateArtworkSortOrder(targetArtwork.id, currentOrder);

      showToast('Artwork order updated.');
      refetch();
    } catch (err: any) {
      console.error('Reorder error:', err);
      showToast(err.message || 'Could not update order.', 'error');
    }
  }

  const displayedArtworks = artworks.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl border text-xs tracking-wide transition-all animate-in fade-in slide-in-from-bottom-2 bg-stone-900 border-stone-700 text-stone-100">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-md w-full p-6 space-y-5">
            <h3 className="font-serif text-xl text-white">Delete Artwork?</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-white">"{deleteModal.title}"</strong>?
              {deleteModal.id.startsWith('artist-work-')
                ? ' Note: This piece is currently loaded from project files. Please click "Import All 13 Artworks to Supabase" first to manage it in the live database.'
                : ' This will permanently delete the artwork record from your Supabase database.'}
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-stone-700 hover:border-stone-500 rounded text-xs uppercase tracking-wider text-stone-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs uppercase tracking-wider transition disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="border-b border-stone-800/80 bg-stone-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="font-serif text-lg tracking-wider text-white hover:text-amber-300 transition">
              THEROSEPALLETTE
            </Link>
            <span className="text-[10px] bg-amber-400/10 border border-amber-400/30 text-amber-300 px-2 py-0.5 rounded uppercase tracking-widest font-mono">
              Studio Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/gallery"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition px-3 py-1.5 rounded hover:bg-stone-800"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Gallery</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition px-3 py-1.5 rounded hover:bg-stone-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Fallback Notice Banner */}
        {isUsingFallback && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm text-white">Import Original Collection to Supabase</h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Your 13 artworks (A crow's skull, The observer, Hangxiety, etc.) are currently loaded from project files. Import them into your Supabase database so you can edit, delete, and manage them directly.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={seedingLoading}
              onClick={handleSeedImport}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-4 py-2 rounded-lg text-xs uppercase tracking-widest transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{seedingLoading ? 'Importing...' : 'Save 13 Artworks to Supabase'}</span>
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white">Artwork Catalog</h1>
            <p className="text-stone-400 text-xs tracking-wider uppercase mt-1">
              Manage your public gallery collection ({artworks.length} total pieces)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isUsingFallback && (
              <button
                type="button"
                disabled={seedingLoading}
                onClick={handleSeedImport}
                className="inline-flex items-center justify-center gap-2 border border-amber-400/60 text-amber-300 hover:bg-amber-400/10 font-semibold px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest transition disabled:opacity-50"
              >
                <Database className="w-4 h-4" /> Import to DB
              </button>
            )}

            <Link
              to="/admin/new"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-amber-950/20"
            >
              <Plus className="w-4 h-4" /> Add Artwork
            </Link>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-500 uppercase tracking-wider text-[11px] mr-1">Filter:</span>
          {(['all', 'available', 'sold', 'not_for_sale'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-md uppercase tracking-wider text-[11px] transition ${
                filter === st
                  ? 'bg-stone-200 text-stone-950 font-medium'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {st === 'all' ? 'All Pieces' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Artworks List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-400 text-xs uppercase tracking-widest">Loading studio catalog...</p>
          </div>
        ) : displayedArtworks.length === 0 ? (
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-stone-800 text-stone-400 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-white">No artworks found</h3>
            <p className="text-stone-400 text-xs max-w-sm mx-auto">
              {filter === 'all'
                ? "You haven't uploaded any artworks yet. Tap the button below to add your first piece."
                : `No artworks match the "${filter.replace(/_/g, ' ')}" status.`}
            </p>
            {filter === 'all' && (
              <Link
                to="/admin/new"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-4 py-2 rounded text-xs uppercase tracking-widest transition"
              >
                <Plus className="w-4 h-4" /> Upload Artwork
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl overflow-hidden divide-y divide-stone-800/80">
            {displayedArtworks.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-900/60 transition"
              >
                {/* Artwork Media & Meta */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-stone-950 rounded-lg overflow-hidden border border-stone-800 shrink-0">
                    <img
                      src={item.image_url || '/placeholder-artwork.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.featured && (
                      <span className="absolute top-1 left-1 bg-amber-400 text-stone-950 p-0.5 rounded shadow" title="Featured on Home">
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base sm:text-lg text-white truncate">{item.title}</h4>
                      {item.year && <span className="text-stone-500 text-xs">({item.year})</span>}
                    </div>

                    <p className="text-stone-400 text-xs truncate">
                      {item.medium || 'Medium unspecified'}
                      {item.width_cm && item.height_cm ? ` · ${item.width_cm} × ${item.height_cm} cm` : ''}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                          item.status === 'available'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'sold'
                            ? 'bg-stone-800 text-stone-400 border border-stone-700'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </span>

                      {item.price && (
                        <span className="text-xs text-stone-300 font-mono">
                          KES {Number(item.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 bg-stone-950/60 border border-stone-800 rounded p-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(item, 'up')}
                      title="Move up in catalog order"
                      className="p-1 hover:text-amber-300 disabled:text-stone-700 transition"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === displayedArtworks.length - 1}
                      onClick={() => handleMove(item, 'down')}
                      title="Move down in catalog order"
                      className="p-1 hover:text-amber-300 disabled:text-stone-700 transition"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit */}
                  <Link
                    to={item.id.startsWith('artist-work-') ? '#' : `/admin/edit/${item.id}`}
                    onClick={(e) => {
                      if (item.id.startsWith('artist-work-')) {
                        e.preventDefault();
                        showToast('Please click "Save 13 Artworks to Supabase" first to edit this piece.', 'error');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-950/50 text-stone-400 hover:text-red-400 rounded text-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
);

// Fallback dummy client for build time / unconfigured local dev
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export const STORAGE_BUCKET = 'artworks';

/**
 * Resolves a storage image path to a full public URL
 */
export function getArtworkImageUrl(imagePath?: string | null): string {
  if (!imagePath) return '/placeholder-artwork.jpg';
  // If it's already an absolute URL (e.g. fallback external image or full URL), return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath);
  return data.publicUrl;
}

/**
 * Compresses an image client-side to keep uploads within free tier storage limits
 * Resizes to max 2000px on long edge, WebP/JPEG quality ~0.85
 */
export async function compressArtworkImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Max ~1MB, typically compresses down to 200-400KB
    maxWidthOrHeight: 2000,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
    return new File([compressedBlob], newFileName, { type: 'image/webp' });
  } catch (error) {
    console.warn('Image compression fallback to original file:', error);
    return file;
  }
}

/**
 * Uploads an artwork image to the Supabase 'artworks' storage bucket
 */
export async function uploadArtworkImage(file: File, titleSlug: string): Promise<{ path: string; publicUrl: string }> {
  // Compress before upload
  const compressed = await compressArtworkImage(file);
  const fileExt = compressed.name.split('.').pop() || 'webp';
  const cleanSlug = titleSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40);
  const filePath = `${cleanSlug}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, compressed, {
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const publicUrl = getArtworkImageUrl(data.path);
  return { path: data.path, publicUrl };
}

/**
 * Deletes an artwork image from storage bucket
 */
export async function deleteArtworkImage(path: string): Promise<void> {
  if (!path || path.startsWith('http') || path.startsWith('/')) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) {
    console.error('Error deleting image from storage:', error.message);
  }
}

/**
 * Helper to generate URL-safe slug from title
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

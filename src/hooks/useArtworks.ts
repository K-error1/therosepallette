import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, getArtworkImageUrl, deleteArtworkImage } from '../lib/supabase';
import { Artwork, ArtworkStatus } from '../types/artwork';

// The artist's 13 original artworks from public/artworks
export const ORIGINAL_ARTIST_WORKS: Omit<Artwork, 'id'>[] = [
  {
    title: "A crow's skull",
    slug: 'a-crows-skull',
    description: 'A mind that remembers faces, solves puzzles and holds grudges across years.',
    medium: 'Color pencils on paper',
    width_cm: 36,
    height_cm: 28,
    year: 2026,
    price: 30000,
    price_usd: 225,
    status: 'available',
    image_path: '/artworks/crows-skull.jpg',
    image_url: '/artworks/crows-skull.jpg',
    featured: true,
    sort_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    title: 'The observer',
    slug: 'the-observer',
    description: 'When the observer and observed become one body, who is caring for whom?',
    medium: 'Oil pastels on paper',
    width_cm: 22,
    height_cm: 14,
    year: 2026,
    price: 20000,
    price_usd: 150,
    status: 'available',
    image_path: '/artworks/the-observer.jpg',
    image_url: '/artworks/the-observer.jpg',
    featured: true,
    sort_order: 2,
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    title: 'Bird person II',
    slug: 'bird-person-ii',
    description: 'Where does the boundary between observer and observed truly lie?',
    medium: 'Color pencils on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: 20000,
    price_usd: 150,
    status: 'available',
    image_path: '/artworks/bird-person-ii.jpg',
    image_url: '/artworks/bird-person-ii.jpg',
    featured: true,
    sort_order: 3,
    created_at: '2026-01-03T00:00:00Z',
  },
  {
    title: 'Bird person I',
    slug: 'bird-person-i',
    description: 'I still remember',
    medium: 'Color pencils on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: 20000,
    price_usd: 160,
    status: 'available',
    image_path: '/artworks/bird-person-i.jpg',
    image_url: '/artworks/bird-person-i.jpg',
    featured: true,
    sort_order: 4,
    created_at: '2026-01-04T00:00:00Z',
  },
  {
    title: 'Hangxiety I',
    slug: 'hangxiety-i',
    description: 'Way into my head "hangxiety meant I couldn\'t be bothered with the smudges"',
    medium: 'Paint, ink on paper',
    width_cm: 36,
    height_cm: 28,
    year: 2026,
    price: 20000,
    price_usd: 150,
    status: 'available',
    image_path: '/artworks/hangxiety-i.jpg',
    image_url: '/artworks/hangxiety-i.jpg',
    featured: true,
    sort_order: 5,
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    title: 'Hangxiety II',
    slug: 'hangxiety-ii',
    description: '"The beginning of the recovery" remembering things we would rather forget',
    medium: 'Color pencils on paper',
    width_cm: 32,
    height_cm: 24,
    year: 2026,
    price: 20000,
    price_usd: 150,
    status: 'available',
    image_path: '/artworks/hangxiety-ii.jpg',
    image_url: '/artworks/hangxiety-ii.jpg',
    featured: true,
    sort_order: 6,
    created_at: '2026-01-06T00:00:00Z',
  },
  {
    title: 'ScareCROW',
    slug: 'scarecrow',
    description: 'We are scared of being seen as we are scared of seeing',
    medium: 'Oil pastels on paper',
    width_cm: 22,
    height_cm: 14,
    year: 2026,
    price: 20000,
    price_usd: 150,
    status: 'available',
    image_path: '/artworks/scarecrow.jpg',
    image_url: '/artworks/scarecrow.jpg',
    featured: true,
    sort_order: 7,
    created_at: '2026-01-07T00:00:00Z',
  },
  {
    title: 'Frustration',
    slug: 'frustration',
    description: 'Watching it all crumble down',
    medium: 'Oil pastels on paper',
    width_cm: 22,
    height_cm: 14,
    year: 2026,
    price: 20000,
    price_usd: 150,
    status: 'available',
    image_path: '/artworks/frustration.jpg',
    image_url: '/artworks/frustration.jpg',
    featured: true,
    sort_order: 8,
    created_at: '2026-01-08T00:00:00Z',
  },
  {
    title: 'Topic Ngumu "Hard Conversation"',
    slug: 'topic-ngumu-hard-conversation',
    description: 'A study in stark monochrome linework and unresolved tension.',
    medium: 'Ink on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: null,
    price_usd: null,
    status: 'available',
    image_path: '/artworks/topic-ngumu.jpg',
    image_url: '/artworks/topic-ngumu.jpg',
    featured: true,
    sort_order: 9,
    created_at: '2026-01-09T00:00:00Z',
  },
  {
    title: 'Jishikilie',
    slug: 'jishikilie',
    description: 'Holding on through fragility and turbulence.',
    medium: 'Ink on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: null,
    price_usd: null,
    status: 'available',
    image_path: '/artworks/jishikilie.jpg',
    image_url: '/artworks/jishikilie.jpg',
    featured: true,
    sort_order: 10,
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    title: 'Lost files I',
    slug: 'lost-files-i',
    description: 'Fragments of forgotten memories recorded in raw pigment.',
    medium: 'Ink on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: null,
    price_usd: null,
    status: 'available',
    image_path: '/artworks/lost-files-i.jpg',
    image_url: '/artworks/lost-files-i.jpg',
    featured: true,
    sort_order: 11,
    created_at: '2026-01-11T00:00:00Z',
  },
  {
    title: 'Lost files II',
    slug: 'lost-files-ii',
    description: 'The second installment in the archived ink series.',
    medium: 'Ink on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: null,
    price_usd: null,
    status: 'available',
    image_path: '/artworks/lost-files-ii.jpg',
    image_url: '/artworks/lost-files-ii.jpg',
    featured: true,
    sort_order: 12,
    created_at: '2026-01-12T00:00:00Z',
  },
  {
    title: 'Kukaskizia',
    slug: 'kukaskizia',
    description: 'Listening inward to the silent cadence.',
    medium: 'Ink on paper',
    width_cm: 30,
    height_cm: 20,
    year: 2026,
    price: null,
    price_usd: null,
    status: 'available',
    image_path: '/artworks/kukaskizia.jpg',
    image_url: '/artworks/kukaskizia.jpg',
    featured: true,
    sort_order: 13,
    created_at: '2026-01-13T00:00:00Z',
  },
];

const FALLBACK_ARTWORKS: Artwork[] = ORIGINAL_ARTIST_WORKS.map((work, idx) => ({
  ...work,
  id: `artist-work-${idx + 1}`,
}));

export function useArtworks(statusFilter?: ArtworkStatus | 'all', allowFallback = true) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      let filtered = [...FALLBACK_ARTWORKS];
      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }
      setArtworks(filtered);
      setIsUsingFallback(true);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('artworks')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      if (data && data.length > 0) {
        const enriched = data.map((item) => ({
          ...item,
          image_url: getArtworkImageUrl(item.image_path),
        }));
        setArtworks(enriched);
        setIsUsingFallback(false);
      } else {
        // Table is empty in Supabase
        if (allowFallback) {
          let filtered = [...FALLBACK_ARTWORKS];
          if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter((item) => item.status === statusFilter);
          }
          setArtworks(filtered);
          setIsUsingFallback(true);
        } else {
          setArtworks([]);
          setIsUsingFallback(false);
        }
      }
    } catch (err: any) {
      console.error('Error fetching artworks from Supabase:', err);
      setError(err.message || 'Failed to load artworks');
      if (allowFallback) {
        setArtworks(FALLBACK_ARTWORKS);
        setIsUsingFallback(true);
      } else {
        setArtworks([]);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, allowFallback]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { artworks, loading, error, isUsingFallback, refetch: fetchList };
}

/**
 * Seeds the 13 original artist artworks directly into Supabase table
 */
export async function seedOriginalArtworksToSupabase(): Promise<{ count: number }> {
  const records = ORIGINAL_ARTIST_WORKS.map((work) => ({
    title: work.title,
    slug: work.slug,
    description: work.description,
    medium: work.medium,
    width_cm: work.width_cm,
    height_cm: work.height_cm,
    year: work.year,
    price: work.price,
    price_usd: work.price_usd,
    status: work.status,
    image_path: work.image_path,
    featured: work.featured,
    sort_order: work.sort_order,
  }));

  const { data, error } = await supabase.from('artworks').insert(records).select();
  if (error) {
    throw new Error(`Failed to seed artworks: ${error.message}`);
  }

  return { count: data?.length || records.length };
}

/**
 * Fetch a single artwork by slug from Supabase
 */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          image_url: getArtworkImageUrl(data.image_path),
        };
      }
    } catch (err) {
      console.error('Error fetching artwork by slug:', err);
    }
  }

  const found = FALLBACK_ARTWORKS.find((a) => a.slug === slug);
  return found || null;
}

/**
 * Fetch a single artwork by UUID id from Supabase
 */
export async function getArtworkById(id: string): Promise<Artwork | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          image_url: getArtworkImageUrl(data.image_path),
        };
      }
    } catch (err) {
      console.error('Error fetching artwork by id:', err);
    }
  }

  const found = FALLBACK_ARTWORKS.find((a) => a.id === id);
  return found || null;
}

/**
 * Delete an artwork and its corresponding storage image
 */
export async function deleteArtwork(id: string, imagePath: string): Promise<void> {
  // If it's a fallback ID (not yet in Supabase)
  if (id.startsWith('artist-work-')) {
    throw new Error('This artwork is currently displayed from local files. Click "Import Works to Database" in your dashboard to save it to Supabase first, then you can delete it.');
  }

  // 1. Delete from Supabase database
  const { error: dbError } = await supabase.from('artworks').delete().eq('id', id);
  if (dbError) {
    throw new Error(`Failed to delete artwork record: ${dbError.message}`);
  }

  // 2. Delete file from storage bucket if it's a Supabase storage path
  if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
    await deleteArtworkImage(imagePath);
  }
}

/**
 * Update sort order for reordering
 */
export async function updateArtworkSortOrder(id: string, newSortOrder: number): Promise<void> {
  if (id.startsWith('artist-work-')) {
    throw new Error('Please click "Import Works to Database" first so the artworks are in Supabase.');
  }

  const { error } = await supabase
    .from('artworks')
    .update({ sort_order: newSortOrder })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update sort order: ${error.message}`);
  }
}

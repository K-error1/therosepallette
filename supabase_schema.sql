-- ============================================================
-- Supabase Schema & Storage Setup for THEROSEPALLETTE
-- ============================================================
-- Authorized Admins: chridpin001@gmail.com, rosmainarose@gmail.com
-- ============================================================

-- 1. Create the artworks table
CREATE TABLE IF NOT EXISTS public.artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    medium TEXT,
    width_cm NUMERIC,
    height_cm NUMERIC,
    year INTEGER,
    price NUMERIC,          -- Primary price (KES)
    price_usd NUMERIC,      -- Optional secondary USD price
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'not_for_sale')),
    image_path TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for public gallery query ordering
CREATE INDEX IF NOT EXISTS idx_artworks_sort ON public.artworks (sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artworks_slug ON public.artworks (slug);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON public.artworks (status);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_artworks_updated_at ON public.artworks;
CREATE TRIGGER trigger_artworks_updated_at
    BEFORE UPDATE ON public.artworks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. Enable Row Level Security (RLS) on artworks table
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admin can insert artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admin can update artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admin can delete artworks" ON public.artworks;

-- Policy: Anyone (anon & authenticated) can view artworks
CREATE POLICY "Public can view artworks"
ON public.artworks
FOR SELECT
TO public
USING (true);

-- Policy: Authorized admins can insert artworks
CREATE POLICY "Admin can insert artworks"
ON public.artworks
FOR INSERT
TO authenticated
WITH CHECK (
    lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
);

-- Policy: Authorized admins can update artworks
CREATE POLICY "Admin can update artworks"
ON public.artworks
FOR UPDATE
TO authenticated
USING (
    lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
)
WITH CHECK (
    lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
);

-- Policy: Authorized admins can delete artworks
CREATE POLICY "Admin can delete artworks"
ON public.artworks
FOR DELETE
TO authenticated
USING (
    lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
);

-- 3. Storage Setup: Public 'artworks' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies for artworks bucket
DROP POLICY IF EXISTS "Public can view artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete artwork images" ON storage.objects;

-- Policy: Anyone can view/download images from artworks bucket
CREATE POLICY "Public can view artwork images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'artworks');

-- Policy: Authorized admins can upload images
CREATE POLICY "Admin can upload artwork images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'artworks'
    AND lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
);

-- Policy: Authorized admins can update images
CREATE POLICY "Admin can update artwork images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'artworks'
    AND lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
)
WITH CHECK (
    bucket_id = 'artworks'
    AND lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
);

-- Policy: Authorized admins can delete images
CREATE POLICY "Admin can delete artwork images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'artworks'
    AND lower((auth.jwt() ->> 'email')::text) IN (
        lower('chridpin001@gmail.com'),
        lower('rosmainarose@gmail.com')
    )
);

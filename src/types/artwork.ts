export type ArtworkStatus = 'available' | 'sold' | 'not_for_sale' | 'inquire';

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  medium: string | null;
  width_cm: number | null;
  height_cm: number | null;
  year: number | null;
  price: number | null;        // KES / primary currency
  price_usd: number | null;    // USD optional
  status: ArtworkStatus;
  image_path: string;
  image_url?: string;          // Resolved public URL from Supabase storage
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ArtworkFormData {
  title: string;
  slug: string;
  description: string;
  medium: string;
  width_cm: number | '';
  height_cm: number | '';
  year: number | '';
  price: number | '';
  price_usd: number | '';
  status: ArtworkStatus;
  featured: boolean;
  imageFile?: File | null;
  image_path?: string;
}

export interface InquiryForm {
  name: string;
  email: string;
  subject: string;
  artworkSlug?: string;
  message: string;
}

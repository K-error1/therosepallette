export type ArtworkType = 'original' | 'print' | 'both';
export type ArtworkStatus = 'available' | 'sold' | 'inquire';

export interface PriceInfo {
  kes: number;
  usd: number;
}

export interface Artwork {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  images: Array<{
    url: string;
    alt?: string;
  }>;
  medium: string;
  dimensions: string;
  year: string;
  price: PriceInfo;
  printPrice?: PriceInfo;
  type: ArtworkType;
  status: ArtworkStatus;
  description: string;
  category: string[];
  featured: boolean;
}

export interface InquiryForm {
  name: string;
  email: string;
  subject: string;
  artworkSlug?: string;
  message: string;
}

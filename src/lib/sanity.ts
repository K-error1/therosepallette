import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { Artwork } from '../types/artwork';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-01';

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: any) {
  if (!builder || !source) return '';
  return builder.image(source).url();
}

// Fallback artworks so app functions beautifully before Sanity keys are configured
export const fallbackArtworks: Artwork[] = [
  {
    _id: 'art-1',
    title: "A crow's skull",
    slug: { current: 'a-crows-skull' },
    images: [
      {
        url: '/artworks/crows-skull.jpg',
        alt: "A crow's skull drawing",
      },
    ],
    medium: 'Color pencils on paper',
    dimensions: '36 by 28 cm',
    year: '2026',
    price: { kes: 30000, usd: 225 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      'A mind that remembers faces,solves puzzles and holds grudges across years',
    category: ['Drawings', 'Color Pencil', 'Figurative'],
    featured: true,
  },
  {
    _id: 'art-2',
    title: 'The observer',
    slug: { current: 'the-observer' },
    images: [
      {
        url: '/artworks/the-observer.jpg',
        alt: 'The observer drawing',
      },
    ],
    medium: 'Oil pastels on paper',
    dimensions: '22 by 14 cm',
    year: '2026',
    price: { kes: 20000, usd: 150 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      'When the observer and observed become one body,who is caring for whom?',
    category: ['Drawings', 'Oil Pastel', 'Figurative'],
    featured: true,
  },
  {
    _id: 'art-3',
    title: 'Bird person II',
    slug: { current: 'bird-person-ii' },
    images: [
      {
        url: '/artworks/bird-person-ii.jpg',
        alt: 'Bird person II drawing',
      },
    ],
    medium: 'Color pencils on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 20000, usd: 150 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      'Where does the boundary between observer and observed truly lie?',
    category: ['Drawings', 'Color Pencil', 'Figurative'],
    featured: true,
  },
  {
    _id: 'art-4',
    title: 'Bird person I',
    slug: { current: 'bird-person-i' },
    images: [
      {
        url: '/artworks/bird-person-i.jpg',
        alt: 'Bird person I drawing',
      },
    ],
    medium: 'Color pencils on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 20000, usd: 160 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      'I still remember ',
    category: ['Drawings', 'Color Pencil', 'Figurative'],
    featured: true,
  },
  {
    _id: 'art-5',
    title: 'Hangxiety I',
    slug: { current: 'hangxiety-i' },
    images: [
      {
        url: '/artworks/hangxiety-i.jpg',
        alt: 'Hangxiety I artwork',
      },
    ],
    medium: 'Paint, ink on paper',
    dimensions: '36 by 28 cm',
    year: '2026',
    price: { kes: 20000, usd: 150 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      'Way into my head "hangxiety meant i couldn\'t be bothered with the smudges"',
    category: ['Drawings', 'Paint', 'Ink'],
    featured: true,
  },
  {
    _id: 'art-6',
    title: 'Hangxiety II',
    slug: { current: 'hangxiety-ii' },
    images: [
      {
        url: '/artworks/hangxiety-ii.jpg',
        alt: 'Hangxiety II artwork',
      },
    ],
    medium: 'Color pencils on paper',
    dimensions: '32 by 24 cm',
    year: '2026',
    price: { kes: 20000, usd: 150 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      '"The beginning of the recovery" remembering things we would rather forget',
    featured: true,
  },
  {
    _id: 'art-7',
    title: 'ScareCROW',
    slug: { current: 'scarecrow' },
    images: [
      {
        url: '/artworks/scarecrow.jpg',
        alt: 'ScareCROW artwork',
      },
    ],
    medium: 'Oil pastels on paper',
    dimensions: '22 by 14 cm',
    year: '2026',
    price: { kes: 20000, usd: 150 },
    printPrice: { kes: 1500, usd: 12 },
    type: 'both',
    status: 'available',
    description:
      'We are scared of being seen as we are scared of seeing',
    featured: true,
  },
  {
    _id: 'art-8',
    title: 'Frustration',
    slug: { current: 'frustration' },
    images: [
      {
        url: '/artworks/frustration.jpg',
        alt: 'Frustration artwork',
      },
    ],
    medium: 'Oil pastels on paper',
    dimensions: '22 by 14 cm',
    year: '2026',
    price: { kes: 20000, usd: 150 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'both',
    status: 'available',
    description:
      'Watching it all crumble down',
    featured: true,
  },
  {
    _id: 'art-9',
    title: 'Topic Ngumu "Hard Conversation"',
    slug: { current: 'topic-ngumu-hard-conversation' },
    images: [
      {
        url: '/artworks/topic-ngumu.jpg',
        alt: 'Topic Ngumu Hard Conversation artwork',
      },
    ],
    medium: 'Ink on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 0, usd: 0 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'print',
    status: 'available',
    description:
      '',
    featured: true,
  },
  {
    _id: 'art-10',
    title: 'Jishikilie',
    slug: { current: 'jishikilie' },
    images: [
      {
        url: '/artworks/jishikilie.jpg',
        alt: 'Jishikilie artwork',
      },
    ],
    medium: 'Ink on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 0, usd: 0 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'print',
    status: 'available',
    description:
      '',
    featured: true,
  },
  {
    _id: 'art-11',
    title: 'Lost files I',
    slug: { current: 'lost-files-i' },
    images: [
      {
        url: '/artworks/lost-files-i.jpg',
        alt: 'Lost files I artwork',
      },
    ],
    medium: 'Ink on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 0, usd: 0 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'print',
    status: 'available',
    description:
      '',
    featured: true,
  },
  {
    _id: 'art-12',
    title: 'Lost files II',
    slug: { current: 'lost-files-ii' },
    images: [
      {
        url: '/artworks/lost-files-ii.jpg',
        alt: 'Lost files II artwork',
      },
    ],
    medium: 'Ink on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 0, usd: 0 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'print',
    status: 'available',
    description:
      '',
    featured: true,
  },
  {
    _id: 'art-13',
    title: 'Kukaskizia',
    slug: { current: 'kukaskizia' },
    images: [
      {
        url: '/artworks/kukaskizia.jpg',
        alt: 'Kukaskizia artwork',
      },
    ],
    medium: 'Ink on paper',
    dimensions: '30 by 20 cm',
    year: '2026',
    price: { kes: 0, usd: 0 },
    printPrice: { kes: 2000, usd: 15 },
    type: 'print',
    status: 'available',
    description:
      '',
    category: ['Drawings', 'Ink', 'Figurative'],
    featured: true,
  },
];

export async function fetchArtworks(): Promise<Artwork[]> {
  if (!sanityClient) {
    return fallbackArtworks;
  }

  try {
    const query = `*[_type == "artwork"] | order(year desc) {
      _id,
      title,
      slug,
      "images": images[]{
        "url": asset->url,
        alt
      },
      medium,
      dimensions,
      year,
      price,
      printPrice,
      type,
      status,
      description,
      category,
      featured
    }`;
    const result = await sanityClient.fetch(query);
    if (!result || result.length === 0) {
      return fallbackArtworks;
    }
    return result;
  } catch (error) {
    console.warn('Error fetching from Sanity, falling back to mock data:', error);
    return fallbackArtworks;
  }
}

export async function fetchArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (!sanityClient) {
    return fallbackArtworks.find((item) => item.slug.current === slug) || null;
  }

  try {
    const query = `*[_type == "artwork" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      "images": images[]{
        "url": asset->url,
        alt
      },
      medium,
      dimensions,
      year,
      price,
      printPrice,
      type,
      status,
      description,
      category,
      featured
    }`;
    const result = await sanityClient.fetch(query, { slug });
    if (!result) {
      return fallbackArtworks.find((item) => item.slug.current === slug) || null;
    }
    return result;
  } catch (error) {
    console.warn('Error fetching artwork slug from Sanity, using fallback:', error);
    return fallbackArtworks.find((item) => item.slug.current === slug) || null;
  }
}

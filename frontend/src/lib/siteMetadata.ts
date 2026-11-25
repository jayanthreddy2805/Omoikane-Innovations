import type { Metadata } from 'next';
export const SITE_URL = 'https://www.omoikaneinnovations.com';
export const isIndexable = process.env.VERCEL_ENV === 'production';
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return { title, description, alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', siteName: 'Omoikane Innovations', url: `${SITE_URL}${path}`, title, description,
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Omoikane Innovations' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image.png'] },
    robots: { index: isIndexable, follow: isIndexable } };
}

export type Artwork = {
  id: number;
  title: string;
  artist: string;
  date: string;
  technique: string;
  description: string;
  imageUrl: string;
  credit: string;
};

const BASE = 'https://openaccess-api.clevelandart.org/api/artworks';
export const PAGE_SIZE = 20;

export function toArtwork(input: any): Artwork {
  return {
    id: Number(input.id),
    title: input.title?.trim() || 'Untitled',
    artist: input.creators?.[0]?.description || 'Artist unknown',
    date: input.creation_date || 'Date unknown',
    technique: input.technique || 'Medium not listed',
    description: input.description || 'No description is available for this artwork.',
    imageUrl: input.images?.web?.url || '',
    credit: input.creditline || 'The Cleveland Museum of Art',
  };
}

export async function searchArtworks(query: string, skip = 0, limit = PAGE_SIZE, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: query.trim(), has_image: '1', limit: String(limit), skip: String(skip) });
  // An empty cc0 parameter restricts image results to openly licensed works.
  const response = await fetch(`${BASE}?${params.toString()}&cc0`, { signal });
  if (!response.ok) throw new Error(`Museum service returned ${response.status}. Please try again.`);
  const body = await response.json();
  if (!Array.isArray(body.data) || typeof body.info?.total !== 'number') throw new Error('The museum sent an unexpected response.');
  return { works: body.data.map(toArtwork) as Artwork[], total: body.info.total as number };
}

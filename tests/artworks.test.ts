import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchArtworks, toArtwork } from '../src/api/artworks';

afterEach(() => vi.unstubAllGlobals());
describe('artwork API mapping', () => {
  it('handles missing information without a blank detail screen', () => {
    expect(toArtwork({ id: 7, title: '', creators: [], images: {} })).toMatchObject({
      id: 7, title: 'Untitled', artist: 'Artist unknown', imageUrl: '',
      description: 'No description is available for this artwork.',
    });
  });
  it('requests CC0 images with offset and a bounded page', async () => {
    const mock = vi.fn(async (_url: string) => ({ ok: true, json: async () => ({ info: { total: 23 }, data: [{ id: 1, title: 'Example' }] }) }));
    vi.stubGlobal('fetch', mock);
    const result = await searchArtworks('monet', 20, 10);
    expect(mock.mock.calls[0][0]).toContain('q=monet');
    expect(mock.mock.calls[0][0]).toContain('skip=20&cc0');
    expect(mock.mock.calls[0][0]).toContain('limit=10');
    expect(result.total).toBe(23);
    expect(result.works[0].title).toBe('Example');
  });
  it('makes a failed request recoverable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503 })));
    await expect(searchArtworks('art')).rejects.toThrow('503');
  });
  it('rejects malformed API data', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ data: null }) })));
    await expect(searchArtworks('art')).rejects.toThrow('unexpected response');
  });
});

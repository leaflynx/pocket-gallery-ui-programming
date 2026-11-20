import { useCallback, useEffect, useRef, useState } from 'react';
import { Artwork, PAGE_SIZE, searchArtworks } from '../api/artworks';

type Status = 'loading' | 'success' | 'empty' | 'error';
export function useArtworks(lowData: boolean) {
  const [query, setQuery] = useState('');
  const [settledQuery, setSettledQuery] = useState('');
  const [works, setWorks] = useState<Artwork[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [moreLoading, setMoreLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const pageSize = lowData ? 10 : PAGE_SIZE;

  useEffect(() => {
    const timer = setTimeout(() => setSettledQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const search = useCallback(async (term: string, count: number) => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setWorks([]); setTotal(0); setError(''); setStatus('loading'); setMoreLoading(false);
    try {
      const result = await searchArtworks(term, 0, count, request.signal);
      if (request.signal.aborted) return;
      setWorks(result.works); setTotal(result.total);
      setStatus(result.works.length ? 'success' : 'empty');
    } catch (e) {
      if (request.signal.aborted) return;
      setStatus('error'); setError(e instanceof Error ? e.message : 'Could not load artworks.');
    }
  }, []);

  useEffect(() => {
    search(settledQuery, pageSize);
    return () => controller.current?.abort();
  }, [settledQuery, pageSize, search]);

  const loadMore = useCallback(async () => {
    if (status !== 'success' || moreLoading || works.length >= total || query !== settledQuery) return;
    setMoreLoading(true);
    const request = new AbortController();
    controller.current = request;
    try {
      const result = await searchArtworks(settledQuery, works.length, pageSize, request.signal);
      if (!request.signal.aborted) {
        setWorks(previous => [...previous, ...result.works.filter(item => !previous.some(old => old.id === item.id))]);
        setTotal(result.total);
      }
    } catch (e) {
      if (!request.signal.aborted) setError(e instanceof Error ? e.message : 'Could not load more.');
    } finally { if (!request.signal.aborted) setMoreLoading(false); }
  }, [status, moreLoading, works, total, query, settledQuery, pageSize]);
  return { query, setQuery, works, total, status, error, moreLoading, loadMore, retry: () => search(settledQuery, pageSize) };
}

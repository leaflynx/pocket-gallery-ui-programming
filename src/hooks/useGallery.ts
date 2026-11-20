import { useCallback, useEffect, useState } from 'react';
import { Artwork } from '../api/artworks';
import { addSaved, listSaved, loadSettings, removeSaved, Saved, saveSettings } from '../db/store';
import { defaults, Settings } from '../ui/theme';

export function useGallery() {
  const [saved, setSaved] = useState<Saved[]>([]);
  const [settings, setSettings] = useState<Settings>(defaults);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [undo, setUndo] = useState<{ artwork: Artwork; deadline: number } | null>(null);
  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), Math.max(0, undo.deadline - Date.now()));
    return () => clearTimeout(timer);
  }, [undo]);

  const refresh = useCallback(async () => setSaved(await listSaved()), []);
  useEffect(() => {
    Promise.all([listSaved(), loadSettings()])
      .then(([works, prefs]) => { setSaved(works); setSettings(prefs); setReady(true); })
      .catch((e) => { setError(e instanceof Error ? e.message : 'Could not open saved works.'); setReady(true); });
  }, []);

  const save = async (art: Artwork) => {
    setBusy(true); setError('');
    try { await addSaved(art); await refresh(); setUndo(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save artwork.'); }
    finally { setBusy(false); }
  };
  const remove = async (art: Artwork) => {
    setBusy(true); setError('');
    try { await removeSaved(art.id); await refresh(); setUndo({ artwork: art, deadline: Date.now() + 6000 }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not remove artwork.'); }
    finally { setBusy(false); }
  };
  const undoRemove = async () => {
    if (!undo || Date.now() > undo.deadline) { setUndo(null); return; }
    await save(undo.artwork);
  };
  const updateSettings = async (next: Settings) => {
    setSettings(next);
    try { await saveSettings(next); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save settings.'); }
  };
  return { saved, settings, ready, error, busy, undo, save, remove, undoRemove, updateSettings, retry: refresh };
}

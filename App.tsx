import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Artwork } from './src/api/artworks';
import { useGallery } from './src/hooks/useGallery';
import { DetailScreen } from './src/screens/DetailScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { palette, textSize } from './src/ui/theme';

type Tab = 'Explore' | 'Saved' | 'Settings';
function Gallery() {
  const gallery = useGallery();
  const [tab, setTab] = useState<Tab>('Explore');
  const [selected, setSelected] = useState<Artwork | null>(null);
  const colors = palette(gallery.settings);
  const selectedSaved = gallery.saved.find(item => item.id === selected?.id);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selected) { setSelected(null); return true; }
      if (tab !== 'Explore') { setTab('Explore'); return true; }
      return false;
    });
    return () => listener.remove();
  }, [selected, tab]);
  const switchTab = (next: Tab) => { setSelected(null); setTab(next); };
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
    <StatusBar style="dark" />
    {!gallery.ready ? <View style={{ flex: 1, justifyContent: 'center' }}><Text style={{ textAlign: 'center', color: colors.ink }}>Opening gallery…</Text></View>
      : selected ? <DetailScreen art={selected} saved={selectedSaved} busy={gallery.busy} error={gallery.error}
        onBack={() => setSelected(null)} onSave={gallery.save} onRemove={gallery.remove} colors={colors} settings={gallery.settings} />
      : tab === 'Explore' ? <ExploreScreen onOpen={setSelected} colors={colors} settings={gallery.settings} />
      : tab === 'Saved' ? <SavedScreen saved={gallery.saved} undo={!!gallery.undo && Date.now() <= gallery.undo.deadline}
        onOpen={setSelected} onUndo={gallery.undoRemove} colors={colors} settings={gallery.settings} />
      : <SettingsScreen settings={gallery.settings} onChange={gallery.updateSettings} colors={colors} />}
    {gallery.error && !selected ? <Text accessibilityRole="alert" style={{ color: colors.danger, paddingHorizontal: 16 }}>{gallery.error}</Text> : null}
    {!selected ? <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }}>
      {(['Explore', 'Saved', 'Settings'] as Tab[]).map(next => <Pressable key={next} onPress={() => switchTab(next)}
        accessibilityRole="tab" accessibilityState={{ selected: tab === next }} accessibilityLabel={`${next} tab`}
        style={{ flex: 1, minHeight: 58, justifyContent: 'center', borderTopWidth: tab === next ? 3 : 0, borderTopColor: colors.accent }}>
        <Text style={{ textAlign: 'center', color: tab === next ? colors.accent : colors.muted, fontWeight: tab === next ? '700' : '500', fontSize: textSize(14, gallery.settings) }}>{next}</Text>
      </Pressable>)}
    </View> : null}
  </SafeAreaView>;
}
export default function App() { return <SafeAreaProvider><Gallery /></SafeAreaProvider>; }

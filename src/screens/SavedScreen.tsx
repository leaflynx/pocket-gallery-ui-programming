import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ArtworkCard } from '../components/ArtworkCard';
import { Artwork } from '../api/artworks';
import { Saved } from '../db/store';
import { Palette, Settings, textSize } from '../ui/theme';

export function SavedScreen({ saved, undo, onOpen, onUndo, colors, settings }: {
  saved: Saved[]; undo: boolean; onOpen: (art: Artwork) => void; onUndo: () => void;
  colors: Palette; settings: Settings;
}) {
  return <View style={{ flex: 1 }}>
    <Text accessibilityRole="header" style={{ fontSize: textSize(26, settings), color: colors.ink, fontWeight: '700', margin: 16 }}>Saved works</Text>
    {saved.length ? <FlatList data={saved} keyExtractor={item => String(item.id)}
      renderItem={({ item }) => <ArtworkCard art={item} localImage={item.localImage} onOpen={() => onOpen(item)} colors={colors} settings={settings} />}
      ListHeaderComponent={<Text style={{ color: colors.muted, marginHorizontal: 18, marginBottom: 8 }}>These details stay on your device. Images marked as downloaded can open offline.</Text>} />
      : <Text style={{ margin: 24, fontSize: textSize(16, settings), color: colors.muted }}>Nothing saved yet. Explore the collection and save an artwork you like.</Text>}
    {undo ? <View style={{ padding: 10, backgroundColor: colors.soft, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.ink }}>Artwork removed</Text>
      <Pressable accessibilityRole="button" onPress={onUndo} style={{ minHeight: 48, padding: 12 }}><Text style={{ color: colors.accent, fontWeight: '700' }}>Undo</Text></Pressable>
    </View> : null}
  </View>;
}

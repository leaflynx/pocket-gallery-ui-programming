import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Artwork } from '../api/artworks';
import { Saved } from '../db/store';
import { Palette, Settings, textSize } from '../ui/theme';

export function DetailScreen({ art, saved, busy, error, onBack, onSave, onRemove, colors, settings }: {
  art: Artwork; saved?: Saved; busy: boolean; error: string; onBack: () => void;
  onSave: (art: Artwork) => void; onRemove: (art: Artwork) => void; colors: Palette; settings: Settings;
}) {
  const image = saved?.localImage || art.imageUrl;
  const [showImage, setShowImage] = useState(!settings.lowData || !!saved?.localImage);
  return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Back to artworks" onPress={onBack} style={{ padding: 18, minHeight: 52 }}>
      <Text style={{ color: colors.accent, fontSize: textSize(17, settings), fontWeight: '700' }}>← Back</Text>
    </Pressable>
    {image && showImage ? <Image source={{ uri: image }} contentFit="contain" cachePolicy="disk"
      accessibilityLabel={`Artwork image: ${art.title}`} style={{ width: '100%', height: 380, backgroundColor: colors.soft }} />
      : <Pressable accessibilityRole="button" accessibilityLabel={`Load image for ${art.title}`} onPress={() => setShowImage(true)}
        style={{ height: 200, justifyContent: 'center', backgroundColor: colors.soft }}>
        <Text style={{ textAlign: 'center', color: colors.accent, fontWeight: '700' }}>{image ? 'Tap to load image' : 'Image unavailable'}</Text>
      </Pressable>}
    <View style={{ padding: 20 }}>
      <Text accessibilityRole="header" style={{ color: colors.ink, fontSize: textSize(27, settings), fontWeight: '700' }}>{art.title}</Text>
      <Text style={{ color: colors.muted, fontSize: textSize(17, settings), marginTop: 8 }}>{art.artist} · {art.date}</Text>
      <Text style={{ color: colors.muted, fontSize: textSize(14, settings), marginTop: 8 }}>{art.technique}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={saved ? `Remove ${art.title} from saved works` : `Save ${art.title}`}
        disabled={busy} onPress={() => saved ? onRemove(art) : onSave(art)}
        style={{ backgroundColor: colors.accent, borderRadius: 12, minHeight: 54, justifyContent: 'center', marginVertical: 24, padding: 8 }}>
        <Text style={{ color: '#FFFFFF', fontSize: textSize(16, settings), fontWeight: '700', textAlign: 'center' }}>{busy ? 'Please wait…' : saved ? 'Remove from saved' : 'Save artwork'}</Text>
      </Pressable>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.danger, marginBottom: 14 }}>{error}</Text> : null}
      {saved && !saved.localImage ? <Text style={{ color: colors.danger, marginBottom: 14 }}>Image was not saved offline. Details will still open without a connection.</Text> : null}
      <Text style={{ color: colors.ink, fontSize: textSize(18, settings), fontWeight: '700', marginBottom: 8 }}>About this work</Text>
      <Text style={{ color: colors.ink, fontSize: textSize(16, settings), lineHeight: textSize(25, settings) }}>{art.description}</Text>
      <Text style={{ color: colors.muted, marginTop: 24, fontSize: textSize(12, settings) }}>{art.credit} · Open Access</Text>
    </View>
  </ScrollView>;
}

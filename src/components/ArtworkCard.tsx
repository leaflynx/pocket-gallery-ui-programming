import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Artwork } from '../api/artworks';
import { Palette, Settings, textSize } from '../ui/theme';

export function ArtworkCard({ art, onOpen, colors, settings, localImage }: {
  art: Artwork; onOpen: () => void; colors: Palette; settings: Settings; localImage?: string | null;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${art.title} by ${art.artist}`}
    onPress={onOpen} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
      borderRadius: 14, marginHorizontal: 16, marginVertical: 6, overflow: 'hidden', minHeight: 132, flexDirection: 'row' }}>
    {(localImage || (art.imageUrl && !settings.lowData)) ? <Image source={{ uri: localImage || art.imageUrl }}
      style={{ width: 112, height: 132, backgroundColor: colors.soft }} resizeMode="cover"
      accessibilityLabel={`Image of ${art.title}`} /> : <View style={{ width: 112, backgroundColor: colors.soft, justifyContent: 'center' }}><Text style={{ textAlign: 'center', color: colors.muted }}>Image hidden</Text></View>}
    <View style={{ flex: 1, padding: 14, justifyContent: 'center' }}>
      <Text numberOfLines={settings.largeText ? 3 : 2} style={{ fontWeight: '700', color: colors.ink, fontSize: textSize(18, settings) }}>{art.title}</Text>
      <Text numberOfLines={2} style={{ color: colors.muted, fontSize: textSize(14, settings), marginTop: 6 }}>{art.artist}</Text>
      <Text style={{ color: colors.muted, fontSize: textSize(13, settings), marginTop: 6 }}>{art.date}</Text>
    </View>
  </Pressable>;
}

import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Artwork } from '../api/artworks';
import { ArtworkCard } from '../components/ArtworkCard';
import { useArtworks } from '../hooks/useArtworks';
import { Palette, Settings, textSize } from '../ui/theme';

export function ExploreScreen({ onOpen, colors, settings }: { onOpen: (art: Artwork) => void; colors: Palette; settings: Settings }) {
  const search = useArtworks(settings.lowData);
  return <View style={{ flex: 1 }}>
    <View style={{ margin: 16, marginBottom: 8 }}>
      <Text accessibilityRole="header" style={{ fontSize: textSize(26, settings), fontWeight: '700', color: colors.ink }}>Explore art</Text>
      <Text style={{ color: colors.muted, fontSize: textSize(14, settings), marginVertical: 8 }}>Cleveland Museum of Art · open collection</Text>
      <TextInput accessibilityLabel="Search artworks" placeholder="Search artworks or artists" placeholderTextColor={colors.muted}
        value={search.query} onChangeText={search.setQuery} returnKeyType="search" autoCorrect={false}
        style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12,
          minHeight: 52, paddingHorizontal: 16, fontSize: textSize(16, settings), color: colors.ink }} />
    </View>
    {search.status === 'loading' ? <View style={{ padding: 24 }}><ActivityIndicator color={colors.accent} /><Text style={{ textAlign: 'center', marginTop: 12, color: colors.muted }}>Loading artworks…</Text></View>
      : search.status === 'error' ? <View style={{ padding: 24 }}><Text style={{ color: colors.danger, fontSize: textSize(16, settings) }}>{search.error}</Text><Pressable accessibilityRole="button" onPress={search.retry} style={{ padding: 15, minHeight: 48 }}><Text style={{ color: colors.accent, fontWeight: '700' }}>Try again</Text></Pressable></View>
      : search.status === 'empty' ? <Text style={{ margin: 24, color: colors.muted, fontSize: textSize(16, settings) }}>No artworks found. Try another search.</Text>
      : <FlatList data={search.works} keyExtractor={item => String(item.id)}
        keyboardShouldPersistTaps="handled" renderItem={({ item }) => <ArtworkCard art={item} onOpen={() => onOpen(item)} colors={colors} settings={settings} />}
        ListHeaderComponent={<Text style={{ marginHorizontal: 18, marginBottom: 4, color: colors.muted }}>{search.total} results · showing {search.works.length}</Text>}
        ListFooterComponent={<View style={{ margin: 16 }}>
          {search.error ? <Text style={{ color: colors.danger, marginBottom: 8 }}>{search.error}</Text> : null}
          {search.works.length < search.total ? <Pressable accessibilityRole="button" accessibilityLabel="Load more artworks"
            disabled={search.moreLoading} onPress={search.loadMore} style={{ backgroundColor: colors.accent, minHeight: 52, borderRadius: 12, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>{search.moreLoading ? 'Loading…' : 'Load more'}</Text>
          </Pressable> : <Text style={{ textAlign: 'center', color: colors.muted }}>You have seen all results.</Text>}
        </View>} />}
  </View>;
}

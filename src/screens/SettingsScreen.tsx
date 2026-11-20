import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Palette, Settings, textSize } from '../ui/theme';

export function SettingsScreen({ settings, onChange, colors }: {
  settings: Settings; onChange: (next: Settings) => void; colors: Palette;
}) {
  const row = (key: keyof Settings, label: string, description: string) => <View key={key} style={{ borderBottomWidth: 1, borderBottomColor: colors.border,
    minHeight: 80, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
    <View style={{ flex: 1, marginRight: 16 }}><Text style={{ color: colors.ink, fontWeight: '700', fontSize: textSize(17, settings) }}>{label}</Text>
      <Text style={{ color: colors.muted, fontSize: textSize(13, settings), marginTop: 4 }}>{description}</Text></View>
    <Switch accessibilityLabel={label} value={settings[key]} onValueChange={value => onChange({ ...settings, [key]: value })}
      trackColor={{ true: colors.accent }} thumbColor="#FFFFFF" />
  </View>;
  return <ScrollView contentContainerStyle={{ padding: 20 }}>
    <Text accessibilityRole="header" style={{ color: colors.ink, fontSize: textSize(26, settings), fontWeight: '700', marginBottom: 10 }}>Settings</Text>
    {row('largeText', 'Larger text', 'Make titles, details and buttons easier to read.')}
    {row('highContrast', 'High contrast', 'Use darker outlines and text on white.')}
    {row('lowData', 'Use less data', 'Load 10 results per page and tap before loading images.')}
    <Text style={{ color: colors.muted, marginTop: 28, lineHeight: 21 }}>Art and images: The Cleveland Museum of Art Open Access collection. Search needs an internet connection. Saved details stay on your device.</Text>
  </ScrollView>;
}

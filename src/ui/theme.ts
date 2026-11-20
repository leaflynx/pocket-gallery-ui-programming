export type Settings = { largeText: boolean; highContrast: boolean; lowData: boolean };
export const defaults: Settings = { largeText: false, highContrast: false, lowData: false };

export function palette(settings: Settings) {
  return settings.highContrast ? {
    background: '#FFFFFF', surface: '#FFFFFF', ink: '#000000', muted: '#222222',
    accent: '#003B5C', border: '#111111', soft: '#EDEDED', danger: '#7D0011',
  } : {
    background: '#F5F7F4', surface: '#FFFFFF', ink: '#183444', muted: '#4A6270',
    accent: '#15556C', border: '#C6D5D8', soft: '#E4F0ED', danger: '#A03530',
  };
}
export type Palette = ReturnType<typeof palette>;
export const textSize = (base: number, settings: Settings) => base + (settings.largeText ? 4 : 0);

# Pocket Gallery

A small Expo / React Native gallery for the Cleveland Museum of Art's Open Access collection. Search, open details, save works, and adjust reading/data settings.

## Run

Requires Node.js 22.13 or newer and Expo Go (Android or iOS). Built with Expo SDK 58 and React Native 0.88.

```sh
npm ci
npx expo start
```

Scan the Expo QR code with Expo Go. To run tests and check the TypeScript project:

```sh
npx tsc --noEmit
npx vitest run
npx expo-doctor
```

The API is public and needs no key. Search requires internet access. Saved metadata is stored on-device in SQLite through Drizzle ORM. On Android and iOS, saving downloads the image to the app's documents folder; if the download fails, the saved metadata still opens, but its image may need internet. The web build saves metadata in SQLite, but does not download image files for offline use.

For a web demo, run `npx expo export --platform web` and serve the exported folder with `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless` headers, as Expo SQLite web needs SharedArrayBuffer. On native Expo Go those web headers are irrelevant.

## Layout

- `src/api/` maps CMA data and fetches pages.
- `src/db/` defines and stores saved works and preferences.
- `src/hooks/` handles search and saved state.
- `src/screens/` contains view components without fetch or SQL.
- `design/` contains the pre-code sketch and browser-tested screen captures.
- `tests/` covers API mapping and error paths.

CMA Open Access API: https://openaccess-api.clevelandart.org/

## Known limits

This project has been checked with TypeScript, Vitest, Expo Doctor, web export, and browser interaction. It has not been tested on a physical phone or emulator. Offline images are implemented for native platforms but have not been device-verified; the web version persists metadata, not downloaded images. A classroom/user study has not been conducted.

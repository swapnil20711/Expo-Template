# Expo SDK 56 Production Starter

An opinionated, batteries-included [Expo](https://expo.dev) template that shows off the newest of
SDK 56 and wires up the plumbing real apps need — auth, state, data, theming, linting, and CI — so
you can `init` and start building features immediately.

> Built on **Expo SDK 56** · React Native 0.85 · React 19 · React Compiler · Hermes v1 · typed routes.

## ✨ Highlights

- **Liquid Glass UI** — `expo-glass-effect` `GlassCard` with a graceful themed fallback off iOS 26.
- **Native Expo UI controls** — `@expo/ui` `BottomSheet`, `Switch`, `Slider`, `Picker`, `Button`
  (SwiftUI / Jetpack Compose under the hood) instead of community libraries.
- **Hybrid styling** — NativeWind v4 (`className`) **and** a typed StyleSheet theme, both fed from a
  single token source so light/dark stay in sync.
- **Auth that just works** — [Clerk](https://clerk.com) with **Google + GitHub** OAuth, secure token
  storage, a polished sign-in screen, and a declarative `Stack.Protected` auth gate.
- **State + data** — Zustand (persisted) for client state, TanStack Query for server state.
- **DX** — ESLint (flat config) + Prettier + lefthook pre-commit/pre-push hooks, strict TypeScript,
  GitHub Actions CI, and EAS build/submit profiles.
- **Universal** — runs on iOS, Android, and the web (static rendering).

## 🚀 Quick start

Use the green **“Use this template”** button on GitHub, or scaffold locally:

```bash
# with degit (no git history)
npx degit swapnil20711/Expo-Template my-app
cd my-app
bun install        # or: npm install

bun run start      # start the dev server
```

> Several features (Expo UI, glass effect, Clerk OAuth) require a **development build**, not Expo Go.
> Build one with `npx expo run:ios` / `npx expo run:android`, or via EAS (below).

## 🔐 Enabling auth (Clerk)

The app runs without auth configured — the auth gate is skipped and you land straight on the tabs.
To turn on Google + GitHub sign-in:

1. Create an app at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Under **User & Authentication → Social Connections**, enable **Google** and **GitHub**.
3. Copy `.env.example` to `.env` and set your key:
   ```bash
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   ```
4. Restart with a clean cache: `npx expo start -c`.

Once configured, unauthenticated users see the sign-in screen and authenticated users land on the
tabs (see `src/components/auth-gate` logic in `src/app/_layout.tsx`).

## 📁 Project structure

```
src/
  app/                 # expo-router routes (file-based)
    (tabs)/            #   tab group: index (home) + explore (showcase)
    sign-in.tsx        #   OAuth sign-in screen
    +not-found.tsx
    _layout.tsx        #   providers + auth-gated Stack + ErrorBoundary
  components/          # UI: themed-*, glass-card, user-badge, account, icons/, providers
  constants/
    tokens.ts          # single source of truth for colors + spacing
    theme.ts           # typed theme consumed by StyleSheet components
  hooks/               # use-theme, use-color-scheme (unified via NativeWind)
  lib/                 # env (zod), query-client, haptics
  stores/              # zustand stores (settings-store)
  global.css           # tailwind directives + CSS color variables
```

## 📜 Scripts

| Command                           | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `bun run start`                   | Start the Expo dev server                           |
| `bun run ios` / `android` / `web` | Start on a specific platform                        |
| `bun run typecheck`               | `tsc --noEmit`                                      |
| `bun run lint`                    | ESLint                                              |
| `bun run format` / `format:check` | Prettier write / check                              |
| `bun run test`                    | Jest (no tests yet — `--passWithNoTests`)           |
| `bun run reset-project`           | Move the example code to `/example` and start blank |

## 🎨 Theming

Colors and spacing live in `src/constants/tokens.ts`. They feed both:

- **NativeWind** (`tailwind.config.ts` + CSS variables in `global.css`) → `className="bg-surface text-text"`
- **StyleSheet** (`src/constants/theme.ts`) → `<ThemedText>`, `<ThemedView>`, `useTheme()`

Dark mode is class-based and driven by NativeWind; the persisted theme preference in
`settings-store` (`system` / `light` / `dark`) is applied in `providers.tsx`, so utilities and
themed components always agree.

## ☁️ Builds & deployment (EAS)

```bash
npm i -g eas-cli && eas login
eas init                       # link the project
eas build --profile development --platform ios
eas build --profile preview
eas build --profile production && eas submit
```

Profiles are defined in `eas.json` (`development` / `preview` / `production`). To enable OTA updates,
run `eas update:configure` and publish with `eas update --channel preview`.

## ✅ CI

`.github/workflows/ci.yml` runs typecheck, lint, format check, and tests on every push/PR to `main`.

## Roadmap / ideas

- Swap the placeholder hero logo and Terms/Privacy links for your brand.
- Add web SEO via expo-router `generateMetadata`.
- Add unit/component tests (the `test` script is ready).

## License

[MIT](./LICENSE)

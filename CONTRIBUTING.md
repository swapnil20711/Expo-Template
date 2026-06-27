# Contributing

Thanks for your interest in improving this template!

## Development setup

```bash
bun install
bun run start
```

## Before opening a PR

Run the same checks CI runs:

```bash
bun run typecheck
bun run lint
bun run format
bun run test
```

A pre-commit hook (lefthook) lints and formats staged files automatically, and a pre-push hook runs the typecheck. If you need to bypass them temporarily, use `git commit --no-verify`.

## Conventions

- Source lives in `src/`; only route files (screens/layouts) belong in `src/app/`.
- Keep design tokens in `src/constants/tokens.ts` so NativeWind and the StyleSheet theme stay in sync.
- Prefer reusing the existing `ThemedText` / `ThemedView` / `GlassCard` primitives.
- Use TanStack Query for server state and Zustand for client state.

## Reporting bugs

Open an issue using the bug report template with platform, versions, and reproduction steps.

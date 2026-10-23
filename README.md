# DanoNews — Cloudflare edition

Professional responsive Ghanaian news website and protected publishing dashboard.

- Navy/red editorial layout, Ghana/politics/sports/entertainment/business/world sections.
- Automatic RSS headlines with attribution, persistent caching and transparent fallback states.
- Admin article publishing, drafts, preview, cover-image upload, editing and deletion.
- Cloudflare Workers runtime, D1 article database and private R2 image storage.
- Cloudflare Access sign-in with cryptographically verified tokens and an administrator email allowlist.
- Device-local saved stories and headline search.

**Start with [CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md).** Account-specific fields in `wrangler.jsonc` must be filled before deployment. The build can run before those values are configured, but deployment intentionally cannot.

This branch is based on the redesigned DanoNews. The original application remains in Git history. Existing Supabase data is not imported automatically. The earlier ChatGPT-hosted preview is separate from this self-hosted version.

## Local development

Install the pinned dependencies, apply the local D1 migrations, then run `pnpm dev`. Public pages can be developed locally. Admin writes remain locked without genuine Cloudflare Access credentials; there is no development authentication bypass in this package.

```sh
pnpm install --frozen-lockfile
pnpm run db:migrate:local
pnpm dev
```

## Checks

```sh
pnpm test
pnpm typecheck
pnpm build
```

The security tests cover unsigned, forged, expired, wrong-audience and unapproved-email Access tokens, plus unauthorised publishing, cross-origin writes and invalid article input. The automated tests replace external infrastructure only inside test modules.

# Deploy DanoNews to your Cloudflare account

This branch replaces the old React/Vite + Express implementation with the redesigned full-stack DanoNews. Use **Cloudflare Workers**, not a Pages ZIP upload. The app uses D1 for articles and R2 for images. Admin authentication uses Cloudflare Access, not ChatGPT. Existing Supabase records are not migrated automatically.

## 1. Install and prepare

Use Node.js 22.13 or newer. Open a terminal in this project folder:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler d1 create danonews-db
pnpm exec wrangler r2 bucket create danonews-images
```

Use the browser window opened by Wrangler to sign in to your own Cloudflare account. Do not paste credentials into chat. Enable R2 in your account if Cloudflare requests it. Review any account-level billing requirements before enabling services.

Copy the database ID printed by the D1 create command into `wrangler.jsonc`, replacing `00000000-0000-4000-8000-000000000000`. Keep the binding names `DB` and `BUCKET` exactly as written.

## 2. Configure administrator login

In Cloudflare One / Zero Trust, create a **Self-hosted Access application** named `DanoNews Newsroom`.

For the hostname you will deploy on (for example `danonews.com`), add these protected paths under **the same Access application**, so they share one audience:

- `/admin*`
- `/api/session`
- `/api/posts*`
- `/api/upload*`

Allow only the administrator email address(es) you choose. Email one-time PIN is suitable if you do not already use another supported identity provider. Do not choose an Everyone policy. Leave the homepage, category pages, `/article/*`, `/api/news`, and `/api/images/*` public.

Copy these account-specific settings into the `vars` object in `wrangler.jsonc`:

| Setting | Value |
| --- | --- |
| `ACCESS_TEAM_DOMAIN` | Your full team origin, such as `https://your-team.cloudflareaccess.com` |
| `ACCESS_AUD` | The Application Audience (AUD) tag of `DanoNews Newsroom` |
| `ADMIN_EMAILS` | A comma-separated list of the same administrator emails allowed by Access |

These values are configuration, not passwords. If the repository is public and you do not want to commit your email address, keep your personalised configuration local and use Wrangler from your computer. The package deliberately contains no real email or account ID.

Requests still need a valid signature, correct issuer and audience, an unexpired token, and an allowlisted email. Setting forged ChatGPT or Cloudflare headers does not grant admin access. If Access or these settings are missing, publishing stays locked.

## 3. Migrate, build and deploy

```sh
pnpm run test
pnpm run typecheck
pnpm run db:migrate:remote
pnpm run build
pnpm run deploy
```

The migration creates new D1 tables. It does not connect to or delete your existing Supabase data. The deploy script refuses to run with the placeholder database ID or missing authentication configuration.

Wrangler prints your deployed URL. Public reading works on the workers.dev URL; use the hostname protected by your Access application for administrator sign-in. If you need admin access on a workers.dev hostname too, configure Access for that hostname and include it in the same application/audience where supported.

## 4. Connect danonews.com

In the Worker’s Cloudflare dashboard, open **Settings → Domains & Routes → Add → Custom Domain**. Add `danonews.com` and, if desired, `www.danonews.com`. Check any existing DNS records and hosting before confirming the domain change. Configure Access for every hostname on which you intend to use the newsroom. Use one canonical hostname for administration.

Open `/admin` on the protected hostname. Cloudflare Access handles sign-in. After login, the newsroom opens automatically; there is no first-user activation or public registration endpoint.

## 5. GitHub automatic deployments (optional)

After reviewing and merging the `cloudflare-redesign` branch, connect `dandemaverick/danonews` from **Workers & Pages → Create application → Import a repository**.

Use the repository root, Node 22 or newer, install command `pnpm install --frozen-lockfile`, build command `pnpm run build`, and deploy command `pnpm run db:migrate:remote && pnpm run deploy`. Provision D1/R2 and fill the account-specific configuration before enabling a successful automatic deployment. Preserve the project's pinned package manager and lockfile. Do not set a Pages output directory.

If the connected build token lacks D1 migration permission, apply migrations manually using the command in step 3 and use `pnpm run deploy` as the deploy command. Migrations must be applied before the new application serves requests.

## 6. Verify

- Homepage and all six categories show attributed stories.
- `/api/news` returns articles; `unavailable` lists sources using fallback results.
- Newsroom sign-in admits only allowlisted emails.
- Create a draft, upload a JPEG/PNG/WebP under 5 MB, preview and publish it.
- Open its article link from a signed-out browser; it should appear only when published.
- Signed-out calls to the upload/publishing API must not succeed.

Automatic news checks occur on page load and every five minutes while the page is visible, with a ten-minute server cache. External stories open at the original publisher. Publisher availability and syndication/image permissions still apply. No paid news API key is needed for the configured feeds.

## What has not been done for you

Account resources, Access application, DNS changes, and deployment to your own Cloudflare account require your authenticated account. No existing live site has been replaced. Legacy Supabase article migration requires a separate export/import step.

Official references:
- https://developers.cloudflare.com/workers/vite-plugin/
- https://developers.cloudflare.com/d1/wrangler-commands/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/

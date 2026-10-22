# Deploy DanoNews to your Cloudflare account

This branch replaces the old React/Vite + Express implementation with the redesigned full-stack DanoNews. Use **Cloudflare Workers**, not a Pages ZIP upload. The app uses D1 for articles and R2 for images. Admin authentication uses Cloudflare Access, not ChatGPT. Existing Supabase records are not migrated automatically.

## 1. Install and prepare

For DanoNews, `danonews-db`, `danonews-images`, and the Access application have already been created. Database and storage bindings are saved in this branch. Skip the resource-creation commands for this account; they are included below for a fresh installation.

Use Node.js 22.13 or newer. Open a terminal in this project folder:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler d1 create danonews-db
pnpm exec wrangler r2 bucket create danonews-images
```

Use the browser window opened by Wrangler to sign in to your own Cloudflare account. Do not paste credentials into chat. Enable R2 in your account if Cloudflare requests it. Review any account-level billing requirements before enabling services.

For a fresh installation, copy the database ID printed by the D1 create command into `wrangler.jsonc`. Keep the binding names `DB` and `BUCKET` exactly as written.

## 2. Configure administrator login

In Cloudflare One / Zero Trust, create a **Self-hosted Access application** named `DanoNews Newsroom`.

For the hostname you will deploy on (for example `danonews.com`), add these protected paths under **the same Access application**, so they share one audience:

- `/admin*`
- `/api/session`
- `/api/posts*`
- `/api/upload*`

Allow only the administrator email address(es) you choose. Email one-time PIN is suitable if you do not already use another supported identity provider. Do not choose an Everyone policy. Leave the homepage, category pages, `/article/*`, `/api/news`, and `/api/images/*` public.

Keep login settings out of the public repository. After the first Worker deployment, open **Workers & Pages → danonews → Settings → Variables and Secrets → Add**. Add each setting below with type **Secret**, then select **Deploy**:

| Setting | Value |
| --- | --- |
| `ACCESS_TEAM_DOMAIN` | Your full team origin, such as `https://your-team.cloudflareaccess.com` |
| `ACCESS_AUD` | The Application Audience (AUD) tag of `DanoNews Newsroom` |
| `ADMIN_EMAILS` | A comma-separated list of the same administrator emails allowed by Access, or `sha256:` followed by each lowercased email's SHA-256 digest |

These are Worker runtime secrets, not build variables. The initial deployment can serve public news while the newsroom remains locked until these settings are supplied. Cloudflare Access's policy must contain the actual administrator email address. A hash, if used, does not replace Access sign-in or signature verification.

Alternatively, from an authenticated local terminal after deployment, run `pnpm exec wrangler secret put ACCESS_TEAM_DOMAIN`, `pnpm exec wrangler secret put ACCESS_AUD`, and `pnpm exec wrangler secret put ADMIN_EMAILS`, entering each value at the prompt. Wrangler preserves existing secrets on later code deployments. `keep_vars` also preserves any runtime variables configured through the dashboard.

Requests still need a valid signature, correct issuer and audience, an unexpired token, and an allowlisted email. Setting forged ChatGPT or Cloudflare headers does not grant admin access. If Access or these settings are missing, publishing stays locked.

## 3. Migrate, build and deploy

```sh
pnpm run test
pnpm run typecheck
pnpm run db:migrate:remote
pnpm run build
pnpm run deploy
```

The migration creates new D1 tables. It does not connect to or delete your existing Supabase data. The deploy script refuses to run with the placeholder database ID. Configure the three runtime secrets after the first deployment; publishing stays locked until configuration and Access sign-in both succeed.

Wrangler prints your deployed URL. Public reading works on the workers.dev URL; use the hostname protected by your Access application for administrator sign-in. If you need admin access on a workers.dev hostname too, configure Access for that hostname and include it in the same application/audience where supported.

## 4. Connect danonews.com

In the Worker’s Cloudflare dashboard, open **Settings → Domains & Routes → Add → Custom Domain**. Add `danonews.com` and, if desired, `www.danonews.com`. Check any existing DNS records and hosting before confirming the domain change. Configure Access for every hostname on which you intend to use the newsroom. Use one canonical hostname for administration.

Open `/admin` on the protected hostname. Cloudflare Access handles sign-in. After login, the newsroom opens automatically; there is no first-user activation or public registration endpoint.

## 5. GitHub automatic deployments (optional)

Connect `dandemaverick/danonews` from **Workers & Pages → Create application → Import a repository**. The production branch must be `cloudflare-redesign` while this pull request remains unmerged. If the creation form does not expose a branch selector, open the created Worker, go to **Settings → Builds → Production branch** (also called **Branch control**), and select `cloudflare-redesign`. The first attempt on the old `main` branch fails with `Missing script: db:migrate:remote`; retrying that same commit does not deploy the redesign. Push a new commit to `cloudflare-redesign` after saving the branch setting to start the correct build. After the pull request is reviewed and merged, you can switch the production branch to `main`.

Keep preview builds off during the initial production setup. Under **Git repository → Manage**, confirm the **Cloudflare Workers and Pages** GitHub installation can access `dandemaverick/danonews`, preserving any other repositories already selected. A Git-account connection warning should be investigated if a new commit does not start a build. Successful repository access and a production-branch build are separate checks.

Use the repository root, Node 22.13 or newer, install command `pnpm install --frozen-lockfile`, build command `pnpm run build`, and deploy command `pnpm run db:migrate:remote && pnpm run deploy`. The deployment API token needs **Account → D1 → Edit** for the migration, in addition to the Workers and R2 permissions. Preserve the project's pinned package manager and lockfile. Do not set a Pages output directory.

If the connected build token lacks D1 migration permission, apply migrations manually using the command in step 3 and use `pnpm run deploy` as the deploy command. Migrations must be applied before the new application serves requests.

## 6. Verify

- Homepage and all six categories show attributed stories.
- `/api/news` returns articles; `unavailable` lists sources using fallback results.
- Newsroom sign-in admits only allowlisted emails.
- Create a draft, upload a JPEG/PNG/WebP under 5 MB, preview and publish it.
- Open its article link from a signed-out browser; it should appear only when published.
- Signed-out calls to the upload/publishing API must not succeed.

Automatic news checks occur on page load and every five minutes while the page is visible, with a ten-minute server cache. External stories open at the original publisher. Publisher availability and syndication/image permissions still apply. No paid news API key is needed for the configured feeds.

## Remaining deployment work

The D1 database, R2 bucket, and Access application have been created in the owner's account. Remote database migrations, the first Worker deployment, runtime secret configuration, custom-domain routing, and live administrator verification are still pending. No existing live site has been replaced. Legacy Supabase article migration requires a separate export/import step.

Official references:
- https://developers.cloudflare.com/workers/vite-plugin/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/
- https://developers.cloudflare.com/d1/wrangler-commands/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/

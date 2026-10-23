# DanoNews monetization

Open `/admin/monetization` through the existing Cloudflare Access login. Settings are stored in D1; no advertising credentials or private administrator identifiers belong in source control.

## Google AdSense

1. Add `danonews.com` to your own AdSense account. Enter and save the real `ca-pub-` publisher ID. DanoNews publishes the verification meta tag and `/ads.txt` without loading advertising scripts.
2. Obtain Google's site approval. Build a useful body of original reporting: copied or lightly rewritten feed content alone is not eligible inventory.
3. Create a responsive display ad unit and enter its numeric slot ID.
4. Publish and test Google's European regulations message in AdSense **Privacy & messaging**. Configure other applicable regional messages there too. The standard AdSense tag deploys the published message; no separate guessed Funding Choices URL is used.
5. Switch **Auto ads off**, confirm the completed steps in the newsroom, then enable AdSense.
6. For each suitable original article, check the editorial eligibility box before saving. Existing articles default to ineligible. The publisher must have monetization rights and add original editorial value.

Google advertising code only loads on published, explicitly eligible original article pages when every setup gate is satisfied. It does not load on feed briefs, listing/search pages, administrative pages or the privacy page. Requests are paused before loading the tag and remain paused for unknown, failed, pending or declined European consent. The tag consumes Google's real consent signals. On European ad pages, the privacy control reopens Google's message; subsequent declined consent pauses requests again. The published Google CMP handles other configured regions. Script loading itself still contacts Google.

Test with your real account before enabling: acceptance, refusal, returning visitors, revocation, region-specific messages, blockers, and a narrow mobile viewport. AdSense approval, consent delivery, ad fill and earnings cannot be confirmed with an unconfigured account. View actual earnings in AdSense; no revenue is invented in this CMS.

## Sponsorship and reader support

- Agree direct sponsorship fees and dates with the advertiser. Configure its name, text, HTTPS destination and optional uploaded image. Enable the labelled homepage/category placement after your agreement. Disable it when the campaign ends. The site does not collect advertising payments automatically.
- Create a hosted payment page with your payment provider, verify the recipient and terms, and paste the HTTPS link into Reader support. Readers choose and complete the payment with that provider. Card details, refunds and receipts stay with the provider.
- Configure an email intended for public business enquiries. It appears on contact, advertising, support and privacy pages; it is separate from the private administrator login.

## News feeds and archive

The source list includes MyJoyOnline, BBC News, GhanaWeb, OnuaOnline, 3News and GBC Ghana Online. Thirteen feed endpoints refresh on a 15-minute Cloudflare cron and on reader requests when the ten-minute cache is stale. Failed sources retain previously retrieved, dated excerpts. The checked-in snapshot is an offline fallback and may lack a source that was unavailable when the snapshot was made.

Every feed headline links to `/story/feed-…`. The D1 archive retains short feed excerpts so these links survive feed rotation. Full `content:encoded` articles are not imported. GhanaWeb user blogs are excluded. Do not treat an available RSS feed as a licence to republish complete articles or images beyond the publisher's permitted use. Obtain publisher permission for full syndication.

## Deployment and verification

Migration `0001_reader_and_monetization.sql` adds the archive, settings table and disabled-by-default article eligibility flag. The existing deployment command applies migrations before publishing the Worker. Cloudflare runtime variables and Access policies stay unchanged.

`/api/site-status` returns the release label `reader-revenue-1`. HTML and the www redirect use `Cache-Control: no-store`; this prevents new HTML responses being cached but cannot remove a previously installed browser worker or an old response that never reaches Cloudflare.

References:
- https://support.google.com/adsense/answer/7584263
- https://support.google.com/publisherpolicies/answer/11190248
- https://support.google.com/adsense/answer/10960768
- https://developers.google.com/funding-choices/fc-api-docs
- https://support.google.com/adsense/answer/7670312

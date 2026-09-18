# Vitaly Chait - personal website

Static portfolio configured for Cloudflare Workers Static Assets on the Free plan.

## Publish from GitHub

In Cloudflare, open Workers & Pages, create an application, and connect a Git repository using the Workers flow.

| Setting | Value |
| --- | --- |
| Repository | VitalyChait/VitalyChait.github.io |
| Production branch | cloudflare-portfolio |
| Worker name | vitaly-chait-portfolio |
| Root directory | Repository root |
| Build command | Leave blank |
| Deploy command | npx wrangler deploy |

Keep the account on Workers Free. No paid services, database, or server-side Worker script are required. The wrangler.json file serves only the public directory. Cloudflare provides the workers.dev address after deployment.

Cloudflare documents static asset requests as free and unlimited, with no additional asset storage cost. The Free plan remains subject to platform and build limits.

## Deploy from your computer

With Node.js installed, clone this branch, sign in to Cloudflare, and deploy.

```sh
git clone --branch cloudflare-portfolio https://github.com/VitalyChait/VitalyChait.github.io.git
cd VitalyChait.github.io
npx wrangler login
npx wrangler deploy
```

## Files

- public/index.html contains the current portfolio
- public/styles.css contains the styling
- public/404.html handles missing pages
- public/_headers configures response headers
- wrangler.json configures Workers static asset hosting

The root index.html and _config.yml belong to the previous GitHub Pages website. Workers publishes only public/, so those legacy files are excluded. The master branch remains unchanged.

This configuration does not by itself create a Cloudflare project or confirm deployment.

## References

- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/

# Vitaly Chait - personal website

## Site search

The search control beside Translate reads `/search-index.json` in the visitor's browser. It does not need an account, API key, database, or external search service. After changing page content, regenerate the index before publishing:

```bash
python tools/build_search_index.py
```

The index contains text from each page's main content. Search works offline after the index has loaded and is served as a static asset by Cloudflare.

A responsive, static HTML/CSS portfolio. No npm packages, server, build system, API keys, or ChatGPT services are required. Google Fonts is optional, system fonts are used when unavailable.

## GitHub → Cloudflare Pages

1. In Cloudflare, open **Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Connect GitHub and select `VitalyChait/VitalyChait.github.io`.
3. Use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `cloudflare-portfolio` |
| Framework preset | None |
| Root directory | Repository root (leave blank) |
| Build command | `exit 0` |
| Build output directory | `public` |
| Environment variables | None |

4. Deploy. Cloudflare supplies a `pages.dev` address. Subsequent pushes to `cloudflare-portfolio` automatically update the website. Use the Pages project's **Custom domains** settings to connect your domain.

Use **Pages**, not the Workers creation flow: this package is designed for Pages static hosting and does not require a Worker entrypoint or Wrangler configuration. No GitHub Actions workflow or Cloudflare token in GitHub is needed when using Cloudflare's native Git integration.

Official references:
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/

## Editing

Edit the files on the cloudflare-portfolio branch. Website files are in public/. Cloudflare Pages should publish that directory.

The original master branch is preserved. This branch contains the updated LinkedIn-based portfolio.

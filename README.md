# karimsangid.dev — Personal Portfolio

A multi-page portfolio site for Karim Sangid, built with pure HTML, CSS, and JavaScript. No frameworks, no build tools — just clean, performant code. Deployed to Vercel.

**By Hummus Development LLC**

## Live Site

[karimsangid.dev](https://karimsangid.dev)

## Pages

- `/` — single-page portfolio (about, work, case studies, stack, experience, contact)
- `/case/roofroof` — RoofRoof.solutions live marketplace deep-dive
- `/case/wheaton` — Wheaton Valet Cleaners paid-client case study
- `/resume` — web view of resume v3 with Print/PDF action
- `/admin` — gated profit-telemetry dashboard (httpOnly JWT cookie via `middleware.js`)

## Features

- Responsive single-page design (mobile-first)
- Smooth scroll animations via IntersectionObserver
- Animated CSS gradient mesh background
- Project showcase with custom CSS illustrations
- Case-study deep-dives with architecture diagrams
- Vertical timeline for experience
- Mobile hamburger navigation
- SEO optimized with Open Graph tags + canonical URLs
- Lighthouse 95+ performance score
- Print-friendly resume page (`/resume`)

## Deployment (Vercel)

Deployed via Vercel CLI. **Auto-deploy on push is NOT wired** — pushes to GitHub do not trigger a build.

```bash
# from project directory
npx vercel --prod --yes
# then promote alias if needed
```

`vercel.json` configures `cleanUrls: true` so `/resume.html` → `/resume`, `/case/roofroof.html` → `/case/roofroof`. Admin routes are excluded from indexing via `X-Robots-Tag: noindex, nofollow`.

DNS:
- CNAME file in repo root points the domain to Vercel
- Apex domain configured in Vercel dashboard

## Admin Dashboard

`/admin` is gated by an `admin_session` httpOnly JWT cookie issued by `/api/admin/login`. Verified in `middleware.js` via `jose`. Required env vars on Vercel:
- `ADMIN_PASSWORD`
- `ADMIN_JWT_SECRET`

## Local Development

Just open `index.html` in a browser. No build step required for the public pages. (The admin login + JWT verification only run on Vercel, since `middleware.js` runs in the Vercel Edge runtime.)

## License

MIT License

Copyright (c) 2026 Karim Sangid / Hummus Development LLC

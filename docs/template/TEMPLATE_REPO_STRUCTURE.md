# automation-sites-template Structure

## Purpose
This file defines the structure that every new site repository should inherit.

## Recommended structure
- `.github/workflows/deploy.yml`
- `deploy/nginx/site.conf`
- `deploy/scripts/deploy.sh`
- `src/config/site.identity.ts`
- `src/config/site.tasks.ts`
- `src/lib/site-config.ts`
- `src/lib/seo.ts`
- `src/lib/site-connector.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `SITE_SETUP_CHECKLIST.md`
- `docs/NEW_SITE_SOP.md`

## Rules
- keep site identity config-driven
- keep deploy flow identical across sites
- keep Master Site Panel integration consistent
- keep visual design flexible inside components and theme layer

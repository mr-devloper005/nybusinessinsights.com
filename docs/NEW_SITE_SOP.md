# New Site SOP

## Goal
Create a production-ready site from the automation template with minimal custom code.

## Principle
Every new site should be an instance of the same operating system:
- shared deploy flow
- shared SEO system
- shared connector flow
- shared monitoring flow
- different branding and theme

## Steps

### 1. Create the repo
Create a new repository from `automation-sites-template`.

### 2. Update environment values
Update `.env` with the new site identity values.

### 3. Update site config
Review:
- `src/config/site.identity.ts`
- `src/config/site.tasks.ts`
- `src/lib/site-config.ts`

### 4. Replace brand assets
Update:
- logo
- favicon
- default OG image
- brand copy

### 5. Register the site in Master Site Panel
Create the site with:
- unique `siteCode`
- `frontendUrl`
- supported tasks
- category
- SEO defaults

### 6. Deploy
- create VPS directory
- clone repo
- set `.env`
- connect nginx
- enable SSL
- add GitHub Actions secrets

### 7. Verify content flow
- feed loads from panel
- test listing/article publish works
- sitemap includes live URLs
- search works
- comments work if enabled

### 8. Verify SEO flow
- title template
- meta description
- canonical
- schema
- robots
- sitemap
- indexing status in panel

## What should not happen
- no hardcoded site name in shared components
- no domain-specific logic inside reusable core components
- no manual SEO fixes per page unless required
- no per-site deploy pattern drift

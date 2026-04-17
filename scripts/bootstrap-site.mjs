#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const getArg = (flag, fallback = '') => {
  const index = args.indexOf(flag)
  return index >= 0 ? args[index + 1] || fallback : fallback
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const siteName = getArg('--name', 'New Automation Site')
const siteUrl = getArg('--url', 'https://example.com')
const siteCode = getArg('--code', slugify(siteName))
const siteDomain = getArg('--domain', siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))
const siteTagline = getArg('--tagline', 'All-in-One Publishing Hub')
const siteDescription = getArg(
  '--description',
  `${siteName} is a production-ready automation site powered by the shared template and Master Site Panel.`
)

const root = process.cwd()
const outputDir = path.join(root, '.codex-output')
fs.mkdirSync(outputDir, { recursive: true })

const envTemplate = `NEXT_PUBLIC_SITE_CODE=${siteCode}\nNEXT_PUBLIC_SITE_NAME=${siteName}\nNEXT_PUBLIC_SITE_TAGLINE=${siteTagline}\nNEXT_PUBLIC_SITE_DESCRIPTION=${siteDescription}\nNEXT_PUBLIC_SITE_DOMAIN=${siteDomain}\nNEXT_PUBLIC_SITE_URL=${siteUrl}\nNEXT_PUBLIC_SITE_OG_IMAGE=/og-default.png\nNEXT_PUBLIC_MASTER_PANEL_URL=https://master-site-panel.onrender.com\nNEXT_PUBLIC_MASTER_API_URL=https://master-site-panel.onrender.com\n`

const summary = `# New Site Bootstrap Summary\n\n## Identity\n- Site name: ${siteName}\n- Site code: ${siteCode}\n- Site URL: ${siteUrl}\n- Site domain: ${siteDomain}\n\n## Next steps\n1. Copy the env block into your new site's .env\n2. Update src/config/site.identity.ts defaults if needed\n3. Replace logo, favicon, and OG image\n4. Register the new site in Master Site Panel\n5. Add VPS + GitHub Actions secrets\n6. Run deploy and verify sitemap/search/SEO\n`

fs.writeFileSync(path.join(outputDir, `${siteCode}.env.preview`), envTemplate)
fs.writeFileSync(path.join(outputDir, `${siteCode}.summary.md`), summary)

console.log(`Generated:\n- ${path.join('.codex-output', `${siteCode}.env.preview`)}\n- ${path.join('.codex-output', `${siteCode}.summary.md`)}`)

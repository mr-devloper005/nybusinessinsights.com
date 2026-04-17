# Fast Site Creation Flow

## Goal
Create a new production-ready site in the fewest possible manual steps.

## Fast path
1. Create a new repository from the template.
2. Run the bootstrap helper.
3. Paste the generated env preview into `.env`.
4. Update logo, favicon, and OG image.
5. Register the site in Master Site Panel.
6. Add deploy secrets.
7. Deploy and verify.

## Bootstrap helper
Run from the project root:

```bash
node scripts/bootstrap-site.mjs --name "City Biz Now" --url "https://citybiznow.com" --code "citybiznow"
```

This generates:
- `.codex-output/<siteCode>.env.preview`
- `.codex-output/<siteCode>.summary.md`

# Template Readiness Notes

## What LinkRiseUp already proves
- production deploy on VPS works
- GitHub Actions deploy path works
- Master Site Panel connector exists
- dynamic SEO system exists
- sitemap and robots exist
- content tasks and detail pages exist

## What must stay reusable
- connector and feed logic
- metadata builders
- sitemap generation
- task routing conventions
- deployment scripts and compose setup
- indexing/status endpoints

## What must become config-driven
- site identity
- task labels and enabled state
- theme tokens
- homepage marketing copy
- default SEO copy

## What should stay outside Master Panel
- raw component design
- full page layout authoring
- one-off animation choices

## Recommended scale model
- one template repository
- one new repo per site created from template
- one deploy pattern per site
- one control plane in Master Site Panel for operations and SEO

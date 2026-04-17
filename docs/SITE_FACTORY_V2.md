# Site Factory V2

This repo is moving from a single-theme template into a recipe-driven site factory.

## Core idea
- one shared architecture
- many reusable brand packs
- many reusable task layouts
- one recipe per site

## V2 layers
1. `src/design/factory/types.ts`
2. `src/design/factory/brand-packs.ts`
3. `src/design/factory/task-modules.ts`
4. `src/config/site.factory.ts`

## Starter packs
- editorial-luxe
- directory-clean
- studio-dark
- market-utility

## Starter task modules
- listing: directory, showcase
- classified: bulletin, market
- article: editorial, journal
- image: masonry, portfolio
- profile: creator, business
- sbm: curation, library

## Next implementation steps
1. add dedicated navbar components per navbar layout
2. add dedicated homepage components per home layout
3. add dedicated task list/detail components per task layout
4. add a recipe application script that updates `src/config/site.factory.ts`
5. render the correct UI from the recipe instead of shared generic components

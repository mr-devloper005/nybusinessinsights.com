import type { BrandPack } from '@/design/factory/types'

export const BRAND_PACKS: Record<BrandPack['key'], BrandPack> = {
  'editorial-luxe': {
    key: 'editorial-luxe',
    displayName: 'Editorial Luxe',
    bodyClassName: 'factory-brand-editorial',
    fontClassName: 'factory-font-editorial',
    paletteClassName: 'factory-palette-editorial',
    surfaceClassName: 'factory-surface-editorial',
    accentClassName: 'factory-accent-editorial',
  },
  'directory-clean': {
    key: 'directory-clean',
    displayName: 'Directory Clean',
    bodyClassName: 'factory-brand-directory',
    fontClassName: 'factory-font-directory',
    paletteClassName: 'factory-palette-directory',
    surfaceClassName: 'factory-surface-directory',
    accentClassName: 'factory-accent-directory',
  },
  'studio-dark': {
    key: 'studio-dark',
    displayName: 'Studio Dark',
    bodyClassName: 'factory-brand-studio',
    fontClassName: 'factory-font-studio',
    paletteClassName: 'factory-palette-studio',
    surfaceClassName: 'factory-surface-studio',
    accentClassName: 'factory-accent-studio',
  },
  'market-utility': {
    key: 'market-utility',
    displayName: 'Market Utility',
    bodyClassName: 'factory-brand-market',
    fontClassName: 'factory-font-market',
    paletteClassName: 'factory-palette-market',
    surfaceClassName: 'factory-surface-market',
    accentClassName: 'factory-accent-market',
  },
}

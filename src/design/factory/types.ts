export type BrandPackKey = 'editorial-luxe' | 'directory-clean' | 'studio-dark' | 'market-utility'
export type NavbarLayoutKey = 'editorial-bar' | 'compact-bar' | 'floating-bar' | 'utility-bar'
export type FooterLayoutKey = 'editorial-footer' | 'columns-footer' | 'dense-footer' | 'minimal-footer'
export type HomeLayoutKey = 'article-home' | 'listing-home' | 'image-profile-home' | 'classified-home'
export type MotionPackKey = 'editorial-soft' | 'minimal' | 'studio-stagger' | 'utility-snappy'

export type TaskKey = 'listing' | 'classified' | 'article' | 'image' | 'profile' | 'sbm' | 'mediaDistribution'

export type TaskLayoutKey =
  | 'listing-directory'
  | 'listing-showcase'
  | 'classified-bulletin'
  | 'classified-market'
  | 'article-editorial'
  | 'article-journal'
  | 'image-masonry'
  | 'image-portfolio'
  | 'profile-creator'
  | 'profile-business'
  | 'sbm-curation'
  | 'sbm-library'

export type BrandPack = {
  key: BrandPackKey
  displayName: string
  bodyClassName: string
  fontClassName: string
  paletteClassName: string
  surfaceClassName: string
  accentClassName: string
}

export type SiteFactoryRecipe = {
  brandPack: BrandPackKey
  navbar: NavbarLayoutKey
  footer: FooterLayoutKey
  homeLayout: HomeLayoutKey
  motionPack: MotionPackKey
  primaryTask: TaskKey
  enabledTasks: TaskKey[]
  taskLayouts: Partial<Record<TaskKey, TaskLayoutKey>>
}

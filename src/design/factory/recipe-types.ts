import type { FooterLayoutKey, HomeLayoutKey, MotionPackKey, NavbarLayoutKey, TaskKey, TaskLayoutKey } from '@/design/factory/types'

export type ProductFamily = 'directory' | 'editorial' | 'visual' | 'curation'

export type ThemePackKey =
  | 'yelp-local'
  | 'directory-premium'
  | 'medium-journal'
  | 'magazine-contrast'
  | 'pinterest-creator'
  | 'visual-portfolio'
  | 'curation-library'
  | 'curation-warm'

export type SiteRecipe = {
  productFamily: ProductFamily
  themePack: ThemePackKey
  homepageTemplate?: HomeLayoutKey
  navbarTemplate?: NavbarLayoutKey
  footerTemplate?: FooterLayoutKey
  motionPack?: MotionPackKey
  primaryTask: TaskKey
  enabledTasks: TaskKey[]
  taskTemplates: Partial<Record<TaskKey, TaskLayoutKey>>
  manualOverrides: {
    navbar: boolean
    footer: boolean
    homePage: boolean
    taskListPage: boolean
    taskDetailPage: boolean
    taskCard: boolean
    contactPage: boolean
    loginPage: boolean
    registerPage: boolean
  }
}

export type ThemePackDefinition = {
  key: ThemePackKey
  label: string
  productFamily: ProductFamily
  brandPack: 'editorial-luxe' | 'directory-clean' | 'studio-dark' | 'market-utility'
  navbar: NavbarLayoutKey
  footer: FooterLayoutKey
  homeLayout: HomeLayoutKey
  motionPack: MotionPackKey
  defaultTaskTemplates: Partial<Record<TaskKey, TaskLayoutKey>>
  notes: string[]
}

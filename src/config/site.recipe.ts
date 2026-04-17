import type { SiteRecipe } from '@/design/factory/recipe-types'

export const SITE_RECIPE: SiteRecipe = {
  productFamily: 'editorial',
  themePack: 'medium-journal',
  homepageTemplate: 'article-home',
  navbarTemplate: 'editorial-bar',
  footerTemplate: 'editorial-footer',
  motionPack: 'minimal',
  primaryTask: 'mediaDistribution',
  enabledTasks: ['mediaDistribution'],
  taskTemplates: {
    mediaDistribution: 'article-journal',
  },
  manualOverrides: {
    navbar: true,
    footer: true,
    homePage: true,
    taskListPage: true,
    taskDetailPage: true,
    taskCard: false,
    contactPage: true,
    loginPage: false,
    registerPage: false,
  },
}

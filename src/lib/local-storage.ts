'use client'

export const storageKeys = {
  user: 'nexus-user',
  bookmarks: 'nexus-bookmarks',
  bookmarkCollections: 'nexus-bookmark-collections',
  articles: 'nexus-articles',
  listings: 'nexus-listings',
  ads: 'nexus-ads',
  localPosts: 'nexus-local-posts',
  bookmarkSaves: 'nexus-bookmark-saves',
  articleLikes: 'nexus-article-likes',
  articleSaves: 'nexus-article-saves',
  listingSaves: 'nexus-listing-saves',
  adSaves: 'nexus-ad-saves',
  theme: 'nexus-theme',
  settings: 'nexus-settings',
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

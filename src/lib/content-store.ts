'use client'

import type { Article, Bookmark, ClassifiedAd, Listing } from '@/types'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'

export function loadStoredArticles(): Article[] {
  return loadFromStorage<Article[]>(storageKeys.articles, [])
}

export function saveStoredArticles(articles: Article[]) {
  saveToStorage(storageKeys.articles, articles)
}

export function loadStoredListings(): Listing[] {
  return loadFromStorage<Listing[]>(storageKeys.listings, [])
}

export function saveStoredListings(listings: Listing[]) {
  saveToStorage(storageKeys.listings, listings)
}

export function loadStoredAds(): ClassifiedAd[] {
  return loadFromStorage<ClassifiedAd[]>(storageKeys.ads, [])
}

export function saveStoredAds(ads: ClassifiedAd[]) {
  saveToStorage(storageKeys.ads, ads)
}

export function loadStoredBookmarks(): Bookmark[] {
  return loadFromStorage<Bookmark[]>(storageKeys.bookmarks, [])
}

export function saveStoredBookmarks(bookmarks: Bookmark[]) {
  saveToStorage(storageKeys.bookmarks, bookmarks)
}

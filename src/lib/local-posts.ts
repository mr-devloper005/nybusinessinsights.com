"use client";

import type { SitePost } from "@/lib/site-connector";
import type { TaskKey } from "@/lib/site-config";
import { loadFromStorage, saveToStorage, storageKeys } from "@/lib/local-storage";

export type LocalPost = SitePost & {
  localOnly: true;
  task: TaskKey;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

export const loadLocalPosts = (): LocalPost[] =>
  loadFromStorage<LocalPost[]>(storageKeys.localPosts, []);

export const saveLocalPosts = (posts: LocalPost[]) =>
  saveToStorage(storageKeys.localPosts, posts);

export const getLocalPostsForTask = (task: TaskKey) =>
  loadLocalPosts().filter((post) => post.task === task);

export const getLocalPostBySlug = (task: TaskKey, slug: string) =>
  loadLocalPosts().find((post) => post.task === task && post.slug === slug) || null;

export const addLocalPost = (post: Omit<LocalPost, "localOnly" | "slug" | "id"> & { slug?: string }) => {
  const posts = loadLocalPosts();
  const slug = post.slug ? normalize(post.slug) : normalize(post.title || "post");
  const id = `local-${post.task}-${Date.now()}`;
  const next: LocalPost = {
    ...post,
    id,
    slug,
    localOnly: true,
  };
  saveLocalPosts([next, ...posts]);
  return next;
};

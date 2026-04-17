// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  coverImage?: string
  joinedDate: string
  location?: string
  website?: string
  followers: number
  following: number
  isVerified: boolean
}

// Article Types
export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: User
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  views: number
  likes: number
  commentsCount: number
  isFeatured: boolean
  status?: 'published' | 'draft' | 'archived'
}

// Listing Types
export interface Listing {
  id: string
  title: string
  slug: string
  description: string
  images: string[]
  category: string
  subcategory?: string
  location: string
  address?: string
  price?: number
  priceRange?: string
  rating: number
  reviewsCount: number
  tags: string[]
  amenities?: string[]
  contactPhone?: string
  contactEmail?: string
  website?: string
  hours?: BusinessHours[]
  owner: User
  createdAt: string
  isFeatured: boolean
  isVerified: boolean
  status: 'active' | 'pending' | 'closed'
}

export interface BusinessHours {
  day: string
  open: string
  close: string
  isClosed: boolean
}

// Classified Ad Types
export interface ClassifiedAd {
  id: string
  title: string
  slug: string
  description: string
  images: string[]
  category: string
  subcategory?: string
  price: number
  currency: string
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  location: string
  seller: User
  createdAt: string
  expiresAt?: string
  views: number
  saves: number
  isFeatured: boolean
  isNegotiable: boolean
  status: 'active' | 'sold' | 'pending' | 'expired'
}

// Comment Types
export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
  parentId?: string
}

// Social Bookmarking Types
export interface Bookmark {
  id: string
  title: string
  slug: string
  url: string
  description: string
  image: string
  domain: string
  tags: string[]
  category: string
  createdAt: string
  author: User
  upvotes: number
  saves: number
  commentsCount: number
  isUpvoted: boolean
  isSaved: boolean
}

export interface BookmarkCollection {
  id: string
  name: string
  description: string
  updatedAt: string
  isPrivate: boolean
  bookmarks: Bookmark[]
  coverImages: string[]
}

// Dashboard Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  link?: string
}

export interface DashboardStats {
  totalArticles: number
  totalListings: number
  totalAds: number
  totalViews: number
  totalLikes: number
  savedItems: number
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
  count: number
  subcategories?: Category[]
}

// Filter Types
export interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options: FilterOption[]
}

// Testimonial Type
export interface Testimonial {
  id: string
  content: string
  author: User
  rating: number
  company?: string
  role?: string
}

// Content Hub Types
export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  location: string
}

export interface CommunityEvent {
  id: string
  title: string
  date: string
  tag: string
  description: string
}

export interface CommunityGroup {
  id: string
  name: string
  members: number
  focus: string
}

export interface PressAsset {
  id: string
  title: string
  description: string
  fileType: string
  previewUrl?: string
}

export interface ApiEndpoint {
  id: string
  method: string
  path: string
  description: string
  scope: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface BlogPost {
  id: string
  title: string
  date: string
  excerpt: string
  tag: string
  author: string
  readTime: string
}

export interface PressCoverage {
  id: string
  outlet: string
  headline: string
  date: string
}

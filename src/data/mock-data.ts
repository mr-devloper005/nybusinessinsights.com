import type { User, Article, Listing, ClassifiedAd, Comment, Bookmark, BookmarkCollection, Notification, Category, Testimonial, DashboardStats, TeamMember, CommunityEvent, CommunityGroup, PressAsset, ApiEndpoint, FAQItem, BlogPost, PressCoverage } from '@/types'

// Mock Users
export const mockUsers: User[] = []

export const currentUser: User = mockUsers[0]

// Mock Articles
export const mockArticles: Article[] = [
 
  {
    id: '4',
    title: 'Remote Work Culture: Lessons from Leading Teams',
    slug: 'remote-work-culture-lessons',
    excerpt: 'How top companies are building thriving remote cultures and what you can learn from them.',
    content: '<p>The shift to remote work has fundamentally changed how teams collaborate...</p>',
    coverImage: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&h=600&fit=crop',
    author: mockUsers[3],
    category: 'Business',
    tags: ['Remote Work', 'Culture', 'Leadership'],
    publishedAt: '2026-03-01',
    readTime: 10,
    views: 15200,
    likes: 1120,
    commentsCount: 67,
    isFeatured: true
  },
  {
    id: '5',
    title: 'Accessibility First: Designing for Everyone',
    slug: 'accessibility-first-design',
    excerpt: 'Why accessibility should be at the foundation of every design decision, not an afterthought.',
    content: '<p>Accessibility is not just about compliance—it is about creating experiences that work for everyone...</p>',
    coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=600&fit=crop',
    author: mockUsers[4],
    category: 'Accessibility',
    tags: ['Accessibility', 'Inclusive Design', 'WCAG'],
    publishedAt: '2026-02-28',
    readTime: 7,
    views: 5400,
    likes: 389,
    commentsCount: 19,
    isFeatured: false
  },
  {
    id: '6',
    title: 'The Complete Guide to TypeScript 6.0',
    slug: 'complete-guide-typescript-6',
    excerpt: 'Everything you need to know about the latest TypeScript release and its game-changing features.',
    content: '<p>TypeScript continues to evolve, bringing more powerful type-safety features...</p>',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    author: mockUsers[1],
    category: 'Technology',
    tags: ['TypeScript', 'JavaScript', 'Development'],
    publishedAt: '2026-02-25',
    readTime: 15,
    views: 21000,
    likes: 1560,
    commentsCount: 89,
    isFeatured: true
  }
]

// Mock Listings
export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Artisan Coffee House',
    slug: 'artisan-coffee-house',
    description: 'A cozy specialty coffee shop featuring single-origin beans from around the world. Our expert baristas craft each cup with precision and care. Enjoy our warm atmosphere with free WiFi and comfortable seating perfect for remote work.',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
    category: 'Food & Drink',
    subcategory: 'Coffee Shops',
    location: 'San Francisco, CA',
    address: '123 Market Street, San Francisco, CA 94102',
    priceRange: '$$',
    rating: 4.8,
    reviewsCount: 234,
    tags: ['WiFi', 'Outdoor Seating', 'Pet Friendly'],
    amenities: ['Free WiFi', 'Outdoor Seating', 'Pet Friendly', 'Wheelchair Accessible'],
    contactPhone: '(415) 555-0123',
    contactEmail: 'hello@artisancoffee.com',
    website: 'https://artisancoffee.com',
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Tuesday', open: '7:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Wednesday', open: '7:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Thursday', open: '7:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Friday', open: '7:00 AM', close: '9:00 PM', isClosed: false },
      { day: 'Saturday', open: '8:00 AM', close: '9:00 PM', isClosed: false },
      { day: 'Sunday', open: '8:00 AM', close: '6:00 PM', isClosed: false }
    ],
    owner: mockUsers[0],
    createdAt: '2025-11-15',
    isFeatured: true,
    isVerified: true,
    status: 'active'
  },
  {
    id: '2',
    title: 'Zen Wellness Spa',
    slug: 'zen-wellness-spa',
    description: 'Experience ultimate relaxation at our award-winning spa. We offer a full range of treatments including massage therapy, facials, and holistic healing sessions.',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop'
    ],
    category: 'Health & Wellness',
    subcategory: 'Spas',
    location: 'Los Angeles, CA',
    address: '456 Sunset Blvd, Los Angeles, CA 90028',
    priceRange: '$$$',
    rating: 4.9,
    reviewsCount: 189,
    tags: ['Massage', 'Facials', 'Couples Treatments'],
    owner: mockUsers[1],
    createdAt: '2025-10-20',
    isFeatured: true,
    isVerified: true,
    status: 'active'
  },
  {
    id: '3',
    title: 'TechHub Coworking Space',
    slug: 'techhub-coworking',
    description: 'Modern coworking space designed for startups and remote workers. Features high-speed internet, meeting rooms, and networking events.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
    ],
    category: 'Services',
    subcategory: 'Coworking',
    location: 'Austin, TX',
    address: '789 Congress Ave, Austin, TX 78701',
    price: 299,
    rating: 4.7,
    reviewsCount: 156,
    tags: ['High-Speed WiFi', '24/7 Access', 'Meeting Rooms'],
    owner: mockUsers[2],
    createdAt: '2025-12-01',
    isFeatured: true,
    isVerified: true,
    status: 'active'
  },
  {
    id: '4',
    title: 'Bella Italia Restaurant',
    slug: 'bella-italia-restaurant',
    description: 'Authentic Italian cuisine made with imported ingredients. Our chef brings 20 years of experience from Tuscany to your table.',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
    ],
    category: 'Food & Drink',
    subcategory: 'Restaurants',
    location: 'New York, NY',
    address: '321 Little Italy, New York, NY 10012',
    priceRange: '$$$',
    rating: 4.6,
    reviewsCount: 312,
    tags: ['Italian', 'Wine Bar', 'Romantic'],
    owner: mockUsers[3],
    createdAt: '2025-09-15',
    isFeatured: false,
    isVerified: true,
    status: 'active'
  },
  {
    id: '5',
    title: 'FitZone Gym',
    slug: 'fitzone-gym',
    description: 'State-of-the-art fitness facility with personal training, group classes, and the latest equipment. Join our community of fitness enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop'
    ],
    category: 'Health & Wellness',
    subcategory: 'Gyms',
    location: 'Chicago, IL',
    address: '555 Michigan Ave, Chicago, IL 60611',
    price: 49,
    rating: 4.5,
    reviewsCount: 278,
    tags: ['Personal Training', 'Group Classes', '24/7'],
    owner: mockUsers[4],
    createdAt: '2025-08-10',
    isFeatured: false,
    isVerified: true,
    status: 'active'
  },
  {
    id: '6',
    title: 'Creative Studio Photography',
    slug: 'creative-studio-photography',
    description: 'Professional photography studio for portraits, products, and events. Fully equipped with lighting and backdrops.',
    images: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop'
    ],
    category: 'Services',
    subcategory: 'Photography',
    location: 'Seattle, WA',
    address: '888 Pike Street, Seattle, WA 98101',
    priceRange: '$$',
    rating: 4.8,
    reviewsCount: 98,
    tags: ['Portrait', 'Product', 'Events'],
    owner: mockUsers[0],
    createdAt: '2025-11-28',
    isFeatured: true,
    isVerified: false,
    status: 'active'
  }
]

// Mock Classified Ads
export const mockClassifiedAds: ClassifiedAd[] = [
  {
    id: '1',
    title: 'MacBook Pro 16" M3 Max - Like New',
    slug: 'macbook-pro-16-m3-max',
    description: 'Selling my MacBook Pro 16" with M3 Max chip. Only 6 months old, in perfect condition. Comes with original box, charger, and AppleCare+ until 2027. 64GB RAM, 1TB SSD. Great for video editing and development.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop'
    ],
    category: 'Electronics',
    subcategory: 'Computers',
    price: 2800,
    currency: 'USD',
    condition: 'like-new',
    location: 'San Francisco, CA',
    seller: mockUsers[1],
    createdAt: '2026-03-12',
    views: 456,
    saves: 34,
    isFeatured: true,
    isNegotiable: true,
    status: 'active'
  },
  {
    id: '2',
    title: 'Vintage Mid-Century Modern Sofa',
    slug: 'vintage-mid-century-sofa',
    description: 'Beautiful authentic 1960s Danish modern sofa in excellent condition. Original teak frame with new upholstery in emerald green velvet. A true statement piece.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop'
    ],
    category: 'Home & Garden',
    subcategory: 'Furniture',
    price: 1500,
    currency: 'USD',
    condition: 'good',
    location: 'Los Angeles, CA',
    seller: mockUsers[0],
    createdAt: '2026-03-10',
    views: 234,
    saves: 28,
    isFeatured: true,
    isNegotiable: true,
    status: 'active'
  },
  {
    id: '3',
    title: '2023 Trek Domane SL5 Road Bike',
    slug: 'trek-domane-sl5-road-bike',
    description: 'High-performance road bike, size 56cm. Carbon frame, Shimano 105 groupset. Perfect for long rides and racing. Less than 500 miles ridden.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop'
    ],
    category: 'Sports & Outdoors',
    subcategory: 'Cycling',
    price: 2200,
    currency: 'USD',
    condition: 'like-new',
    location: 'Austin, TX',
    seller: mockUsers[2],
    createdAt: '2026-03-08',
    views: 189,
    saves: 15,
    isFeatured: false,
    isNegotiable: false,
    status: 'active'
  },
  {
    id: '4',
    title: 'Sony A7IV Camera Body + 24-70mm Lens',
    slug: 'sony-a7iv-camera-kit',
    description: 'Professional mirrorless camera kit. Includes Sony A7IV body and Sony 24-70mm f/2.8 GM lens. Shutter count under 5000. Perfect for photography and videography.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop'
    ],
    category: 'Electronics',
    subcategory: 'Cameras',
    price: 3200,
    currency: 'USD',
    condition: 'good',
    location: 'New York, NY',
    seller: mockUsers[3],
    createdAt: '2026-03-05',
    views: 312,
    saves: 41,
    isFeatured: true,
    isNegotiable: true,
    status: 'active'
  },
  {
    id: '5',
    title: 'Herman Miller Aeron Chair - Size B',
    slug: 'herman-miller-aeron-chair',
    description: 'Ergonomic office chair in graphite. Fully loaded with all adjustments. Size B fits most people. Original purchase from authorized dealer.',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop'
    ],
    category: 'Home & Garden',
    subcategory: 'Furniture',
    price: 850,
    currency: 'USD',
    condition: 'good',
    location: 'Seattle, WA',
    seller: mockUsers[4],
    createdAt: '2026-03-01',
    views: 178,
    saves: 22,
    isFeatured: false,
    isNegotiable: true,
    status: 'active'
  },
  {
    id: '6',
    title: 'Apartment Available - 2BR Downtown',
    slug: 'apartment-2br-downtown',
    description: 'Spacious 2-bedroom apartment in the heart of downtown. Modern kitchen, in-unit laundry, gym access. Available April 1st. $2,500/month.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    category: 'Real Estate',
    subcategory: 'Rentals',
    price: 2500,
    currency: 'USD',
    condition: 'new',
    location: 'Chicago, IL',
    seller: mockUsers[0],
    createdAt: '2026-02-28',
    views: 567,
    saves: 89,
    isFeatured: true,
    isNegotiable: false,
    status: 'active'
  }
]

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This is an incredibly insightful article. The section on AI-powered design systems really resonated with our team\'s experience.',
    author: mockUsers[1],
    createdAt: '2026-03-12T10:30:00Z',
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        content: 'Totally agree! We\'ve been implementing similar approaches and the productivity gains are remarkable.',
        author: mockUsers[2],
        createdAt: '2026-03-12T11:15:00Z',
        likes: 8,
        isLiked: true,
        parentId: '1'
      },
      {
        id: '1-2',
        content: 'Would love to hear more about your implementation. Do you have any resources to share?',
        author: mockUsers[4],
        createdAt: '2026-03-12T14:00:00Z',
        likes: 3,
        isLiked: false,
        parentId: '1'
      }
    ]
  },
  {
    id: '2',
    content: 'Great breakdown of the token-based architecture. One thing I\'d add is the importance of documentation when scaling these systems across teams.',
    author: mockUsers[3],
    createdAt: '2026-03-11T16:45:00Z',
    likes: 15,
    isLiked: true,
    replies: []
  },
  {
    id: '3',
    content: 'The future is definitely exciting. I\'m curious about how this will affect junior designer roles. Will there still be a need for traditional design skills?',
    author: mockUsers[4],
    createdAt: '2026-03-11T09:20:00Z',
    likes: 32,
    isLiked: false,
    replies: [
      {
        id: '3-1',
        content: 'I think core design principles will always be valuable. AI is a tool that amplifies skills, not replaces them.',
        author: mockUsers[0],
        createdAt: '2026-03-11T10:00:00Z',
        likes: 18,
        isLiked: true,
        parentId: '3'
      }
    ]
  }
]

// Mock Bookmarks
export const mockBookmarks: Bookmark[] = [
  {
    id: 'bm-1',
    title: 'Web Vitals Field Guide',
    slug: 'web-vitals-field-guide',
    url: 'https://web.dev/vitals/',
    description: 'A practical handbook for measuring real-user performance and shipping faster experiences.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
    domain: 'web.dev',
    tags: ['Performance', 'Web Vitals', 'Core'],
    category: 'Web Dev',
    createdAt: '2026-03-15T08:10:00Z',
    author: mockUsers[0],
    upvotes: 248,
    saves: 134,
    commentsCount: 18,
    isUpvoted: true,
    isSaved: true
  },
  {
    id: 'bm-2',
    title: 'Design System Audit Checklist',
    slug: 'design-system-audit-checklist',
    url: 'https://designsystems.com/checklist',
    description: 'A step-by-step checklist to align components, tokens, and governance across teams.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
    domain: 'designsystems.com',
    tags: ['Design Systems', 'UI', 'Governance'],
    category: 'Design',
    createdAt: '2026-03-14T14:20:00Z',
    author: mockUsers[1],
    upvotes: 192,
    saves: 98,
    commentsCount: 12,
    isUpvoted: false,
    isSaved: true
  },
  {
    id: 'bm-3',
    title: 'Product Metrics That Actually Matter',
    slug: 'product-metrics-that-matter',
    url: 'https://productschool.com/metrics',
    description: 'A no-fluff framework for choosing north star metrics and avoiding vanity numbers.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    domain: 'productschool.com',
    tags: ['Product', 'Analytics', 'Growth'],
    category: 'Product',
    createdAt: '2026-03-13T18:05:00Z',
    author: mockUsers[2],
    upvotes: 156,
    saves: 87,
    commentsCount: 9,
    isUpvoted: true,
    isSaved: false
  },
  {
    id: 'bm-4',
    title: 'Color Contrast Toolkit',
    slug: 'color-contrast-toolkit',
    url: 'https://www.figma.com/resources/contrast',
    description: 'Check contrast ratios, simulate color vision deficiencies, and ship inclusive palettes.',
    image: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=1200&h=800&fit=crop',
    domain: 'figma.com',
    tags: ['Accessibility', 'Design', 'Color'],
    category: 'Accessibility',
    createdAt: '2026-03-12T09:40:00Z',
    author: mockUsers[3],
    upvotes: 134,
    saves: 76,
    commentsCount: 7,
    isUpvoted: false,
    isSaved: false
  },
  {
    id: 'bm-5',
    title: 'AI Prompt Pattern Library',
    slug: 'ai-prompt-pattern-library',
    url: 'https://prompting.guide/patterns',
    description: 'Reusable prompt structures for extraction, reasoning, and structured output.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=800&fit=crop',
    domain: 'prompting.guide',
    tags: ['AI', 'Prompting', 'Workflow'],
    category: 'AI',
    createdAt: '2026-03-11T12:15:00Z',
    author: mockUsers[4],
    upvotes: 312,
    saves: 205,
    commentsCount: 26,
    isUpvoted: true,
    isSaved: true
  },
  {
    id: 'bm-6',
    title: 'Secure Auth Patterns for Modern Apps',
    slug: 'secure-auth-patterns',
    url: 'https://auth0.com/blog/secure-auth-patterns',
    description: 'Guidelines for session handling, refresh tokens, and zero-trust onboarding.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=800&fit=crop',
    domain: 'auth0.com',
    tags: ['Security', 'Auth', 'Backend'],
    category: 'Engineering',
    createdAt: '2026-03-10T15:55:00Z',
    author: mockUsers[1],
    upvotes: 118,
    saves: 64,
    commentsCount: 5,
    isUpvoted: false,
    isSaved: false
  },
  {
    id: 'bm-7',
    title: 'Storytelling for Product Launches',
    slug: 'storytelling-for-launches',
    url: 'https://www.intercom.com/blog/product-storytelling',
    description: 'A tactical guide to positioning, narratives, and launch messaging that converts.',
    image: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200&h=800&fit=crop',
    domain: 'intercom.com',
    tags: ['Marketing', 'Launch', 'Copywriting'],
    category: 'Marketing',
    createdAt: '2026-03-09T11:05:00Z',
    author: mockUsers[0],
    upvotes: 98,
    saves: 52,
    commentsCount: 3,
    isUpvoted: false,
    isSaved: true
  },
  {
    id: 'bm-8',
    title: 'Remote Team Rituals Playbook',
    slug: 'remote-team-rituals-playbook',
    url: 'https://www.atlassian.com/team-playbook',
    description: 'Rituals, templates, and facilitation guides for healthy distributed teams.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop',
    domain: 'atlassian.com',
    tags: ['Culture', 'Remote', 'Leadership'],
    category: 'Teams',
    createdAt: '2026-03-08T07:35:00Z',
    author: mockUsers[2],
    upvotes: 172,
    saves: 110,
    commentsCount: 14,
    isUpvoted: true,
    isSaved: false
  },
  {
    id: 'bm-9',
    title: 'Lightning CSS Tricks for Responsive UI',
    slug: 'lightning-css-tricks',
    url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    description: 'Advanced grid and clamp patterns for fluid responsive layouts.',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=800&fit=crop',
    domain: 'css-tricks.com',
    tags: ['CSS', 'Responsive', 'Layout'],
    category: 'Web Dev',
    createdAt: '2026-03-07T19:25:00Z',
    author: mockUsers[3],
    upvotes: 221,
    saves: 143,
    commentsCount: 21,
    isUpvoted: true,
    isSaved: true
  }
]

export const mockBookmarkComments: Comment[] = [
  {
    id: 'bm-c-1',
    content: 'This guide helped us catch a layout shift regression before launch.',
    author: mockUsers[2],
    createdAt: '2026-03-15T12:30:00Z',
    likes: 12,
    isLiked: true,
    replies: [
      {
        id: 'bm-c-1-1',
        content: 'Same here. The field data examples are super actionable.',
        author: mockUsers[0],
        createdAt: '2026-03-15T13:05:00Z',
        likes: 4,
        isLiked: false,
        parentId: 'bm-c-1'
      }
    ]
  },
  {
    id: 'bm-c-2',
    content: 'Would love a follow-up on prioritizing fixes when everything is red.',
    author: mockUsers[4],
    createdAt: '2026-03-14T18:20:00Z',
    likes: 7,
    isLiked: false,
    replies: []
  },
  {
    id: 'bm-c-3',
    content: 'Sharing this with our product team. Clear and practical.',
    author: mockUsers[1],
    createdAt: '2026-03-14T09:10:00Z',
    likes: 9,
    isLiked: true,
    replies: []
  }
]

export const mockBookmarkCollections: BookmarkCollection[] = [
  {
    id: 'col-1',
    name: 'Design Systems',
    description: 'Governance, audits, and accessibility tooling for scalable UI.',
    updatedAt: '2026-03-15T10:00:00Z',
    isPrivate: false,
    bookmarks: [mockBookmarks[1], mockBookmarks[3]],
    coverImages: [mockBookmarks[1].image, mockBookmarks[3].image]
  },
  {
    id: 'col-2',
    name: 'Growth & Analytics',
    description: 'Metrics, experiments, and sustainable growth practices.',
    updatedAt: '2026-03-13T16:45:00Z',
    isPrivate: false,
    bookmarks: [mockBookmarks[2], mockBookmarks[6]],
    coverImages: [mockBookmarks[2].image, mockBookmarks[6].image]
  },
  {
    id: 'col-3',
    name: 'AI Tools',
    description: 'Prompts, workflows, and automation playbooks.',
    updatedAt: '2026-03-12T08:15:00Z',
    isPrivate: true,
    bookmarks: [mockBookmarks[4], mockBookmarks[5]],
    coverImages: [mockBookmarks[4].image, mockBookmarks[5].image]
  },
  {
    id: 'col-4',
    name: 'Reading List',
    description: 'Deep dives to revisit on the weekend.',
    updatedAt: '2026-03-11T21:05:00Z',
    isPrivate: false,
    bookmarks: [mockBookmarks[0], mockBookmarks[7], mockBookmarks[8]],
    coverImages: [mockBookmarks[0].image, mockBookmarks[7].image, mockBookmarks[8].image]
  }
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Article Published',
    message: 'Your article "The Future of Design Systems" has been published successfully.',
    timestamp: '2026-03-15T10:00:00Z',
    isRead: false,
    link: '/articles/future-of-design-systems-2026'
  },
  {
    id: '2',
    type: 'info',
    title: 'New Follower',
    message: 'James Chen started following you.',
    timestamp: '2026-03-15T09:30:00Z',
    isRead: false,
    link: '/profile/james-chen'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Listing Expiring Soon',
    message: 'Your listing "Artisan Coffee House" will expire in 3 days.',
    timestamp: '2026-03-14T15:00:00Z',
    isRead: true,
    link: '/listings/artisan-coffee-house'
  },
  {
    id: '4',
    type: 'info',
    title: 'New Comment',
    message: 'Emily Rodriguez commented on your article.',
    timestamp: '2026-03-14T12:00:00Z',
    isRead: true,
    link: '/articles/future-of-design-systems-2026#comments'
  }
]

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', icon: 'Monitor', count: 156 },
  { id: '2', name: 'Design', slug: 'design', icon: 'Palette', count: 89 },
  { id: '3', name: 'Business', slug: 'business', icon: 'Briefcase', count: 134 },
  { id: '4', name: 'Health & Wellness', slug: 'health-wellness', icon: 'Heart', count: 67 },
  { id: '5', name: 'Food & Drink', slug: 'food-drink', icon: 'UtensilsCrossed', count: 98 },
  { id: '6', name: 'Services', slug: 'services', icon: 'Wrench', count: 112 },
  { id: '7', name: 'Electronics', slug: 'electronics', icon: 'Smartphone', count: 203 },
  { id: '8', name: 'Home & Garden', slug: 'home-garden', icon: 'Home', count: 87 },
  { id: '9', name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: 'Bike', count: 76 },
  { id: '10', name: 'Real Estate', slug: 'real-estate', icon: 'Building', count: 54 }
]

// Mock Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    content: 'This platform has completely transformed how we manage our business listings. The interface is intuitive and our engagement has increased by 300%.',
    author: mockUsers[1],
    rating: 5,
    company: 'TechStart Inc.',
    role: 'CEO'
  },
  {
    id: '2',
    content: 'The best publishing platform I\'ve used. The reading experience rivals Medium, and the community engagement features are outstanding.',
    author: mockUsers[2],
    rating: 5,
    company: 'Creative Agency',
    role: 'Content Director'
  },
  {
    id: '3',
    content: 'Sold my items within days of listing. The classified ads section is well-designed and attracts serious buyers.',
    author: mockUsers[3],
    rating: 4,
    company: 'Freelance',
    role: 'Photographer'
  }
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalArticles: 12,
  totalListings: 5,
  totalAds: 8,
  totalViews: 45600,
  totalLikes: 3200,
  savedItems: 24
}

// Content Hub Data
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Avery Brooks',
    role: 'Head of Community',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop',
    bio: 'Building programs that connect creators with meaningful collaborations.',
    location: 'Austin, TX'
  },
  {
    id: 'team-2',
    name: 'Jordan Lee',
    role: 'Product Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: 'Designing calm, curated experiences for modern teams.',
    location: 'San Francisco, CA'
  },
  {
    id: 'team-3',
    name: 'Priya Desai',
    role: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop',
    bio: 'Focused on reliability, search, and delightful performance.',
    location: 'New York, NY'
  }
]

export const mockCommunityEvents: CommunityEvent[] = [
  {
    id: 'event-1',
    title: 'Weekly Bookmark Jam',
    date: 'Every Friday',
    tag: 'Live',
    description: 'Curate your best links together and learn from fellow members.'
  },
  {
    id: 'event-2',
    title: 'Design Systems Roundtable',
    date: 'April 2',
    tag: 'Workshop',
    description: 'Swap processes and audit templates with peers.'
  },
  {
    id: 'event-3',
    title: 'Creator Office Hours',
    date: 'April 10',
    tag: 'AMA',
    description: 'Ask our team anything about your workflow.'
  }
]

export const mockCommunityGroups: CommunityGroup[] = [
  { id: 'group-1', name: 'Product Leaders', members: 1240, focus: 'Roadmaps and strategy' },
  { id: 'group-2', name: 'Design Ops', members: 860, focus: 'Systems and governance' },
  { id: 'group-3', name: 'Frontend Guild', members: 1510, focus: 'UI engineering' },
  { id: 'group-4', name: 'Remote Teams', members: 930, focus: 'Distributed rituals' }
]

export const mockPressAssets: PressAsset[] = [
  {
    id: 'press-1',
    title: 'Brand Logo Pack',
    description: 'SVG, PNG, and monochrome variations.',
    fileType: 'ZIP',
    previewUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=600&fit=crop'
  },
  {
    id: 'press-2',
    title: 'Product Screenshots',
    description: 'High-resolution UI captures for media.',
    fileType: 'ZIP',
    previewUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&h=600&fit=crop'
  },
  {
    id: 'press-3',
    title: 'Brand Guidelines',
    description: 'Usage rules, color palette, and typography.',
    fileType: 'PDF',
    previewUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&h=600&fit=crop'
  }
]

export const mockApiEndpoints: ApiEndpoint[] = [
  {
    id: 'api-1',
    method: 'GET',
    path: '/api/bookmarks',
    description: 'List bookmarks with filters.',
    scope: 'bookmarks:read'
  },
  {
    id: 'api-2',
    method: 'POST',
    path: '/api/bookmarks',
    description: 'Create a new bookmark.',
    scope: 'bookmarks:write'
  },
  {
    id: 'api-3',
    method: 'GET',
    path: '/api/collections',
    description: 'Fetch collections.',
    scope: 'collections:read'
  }
]

export const mockFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I submit a bookmark?',
    answer: 'Open Social Bookmarks and choose Submit Bookmark to add your link.'
  },
  {
    id: 'faq-2',
    question: 'Can I create private collections?',
    answer: 'Yes. Set your collection to private when creating it.'
  },
  {
    id: 'faq-3',
    question: 'How do I upgrade plans?',
    answer: 'Go to Settings, then Billing to manage your subscription.'
  }
]

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Community Notes: March',
    date: 'Mar 12, 2026',
    excerpt: 'Highlights from the community, trending collections, and product updates.',
    tag: 'Updates',
    author: 'Avery Brooks',
    readTime: '4 min'
  },
  {
    id: 'blog-2',
    title: 'Designing for Shared Knowledge',
    date: 'Feb 28, 2026',
    excerpt: 'How we think about curation, trust, and discovery in social bookmarking.',
    tag: 'Design',
    author: 'Jordan Lee',
    readTime: '6 min'
  },
  {
    id: 'blog-3',
    title: 'Building the Social Bookmarking Hub',
    date: 'Feb 10, 2026',
    excerpt: 'A behind-the-scenes look at the new SBM module and its workflows.',
    tag: 'Product',
    author: 'Priya Desai',
    readTime: '5 min'
  }
]

export const mockPressCoverage: PressCoverage[] = [
  {
    id: 'press-coverage-1',
    outlet: 'Product Weekly',
    headline: 'This platform makes link sharing feel premium.',
    date: 'Mar 2026'
  },
  {
    id: 'press-coverage-2',
    outlet: 'Design Journal',
    headline: 'A fresh take on community curation.',
    date: 'Feb 2026'
  },
  {
    id: 'press-coverage-3',
    outlet: 'Tech Today',
    headline: 'Why teams are switching to this platform.',
    date: 'Jan 2026'
  }
]

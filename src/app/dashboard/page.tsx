"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Store,
  Tag,
  BarChart3,
  MessageSquare,
  Heart,
  Eye,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { loadFromStorage, storageKeys } from "@/lib/local-storage"
import type { Article, Listing, ClassifiedAd } from "@/types"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const recentActivity = [
  {
    id: 1,
    type: "comment",
    user: "Sarah Wilson",
    action: "commented on your article",
    target: "Building Modern Web Apps",
    time: "5 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    type: "like",
    user: "Mike Chen",
    action: "liked your listing",
    target: "Tech Solutions Inc.",
    time: "15 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    type: "follow",
    user: "Emily Johnson",
    action: "started following you",
    target: "",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    type: "message",
    user: "Alex Rivera",
    action: "sent you a message about",
    target: "2019 Honda Civic",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const viewWeights = [0.14, 0.12, 0.15, 0.13, 0.16, 0.14, 0.16]
const viewDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const [storedArticles, setStoredArticles] = useState<Article[]>([])
  const [storedListings, setStoredListings] = useState<Listing[]>([])
  const [storedAds, setStoredAds] = useState<ClassifiedAd[]>([])

  const loadDashboardData = () => {
    setStoredArticles(loadFromStorage<Article[]>(storageKeys.articles, []))
    setStoredListings(loadFromStorage<Listing[]>(storageKeys.listings, []))
    setStoredAds(loadFromStorage<ClassifiedAd[]>(storageKeys.ads, []))
  }

  useEffect(() => {
    loadDashboardData()
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || !event.key.startsWith("nexus-")) return
      loadDashboardData()
    }
    const handleProfileUpdate = () => loadDashboardData()
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadDashboardData()
      }
    }
    window.addEventListener("storage", handleStorage)
    window.addEventListener("nexus-profile-updated", handleProfileUpdate)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("nexus-profile-updated", handleProfileUpdate)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  const userArticles = useMemo(
    () => (user ? storedArticles.filter((article) => article.author.id === user.id) : []),
    [storedArticles, user]
  )
  const userListings = useMemo(
    () => (user ? storedListings.filter((listing) => listing.owner.id === user.id) : []),
    [storedListings, user]
  )
  const userAds = useMemo(
    () => (user ? storedAds.filter((ad) => ad.seller.id === user.id) : []),
    [storedAds, user]
  )

  const totalViews = useMemo(
    () =>
      userArticles.reduce((sum, article) => sum + (article.views || 0), 0) +
      userListings.reduce((sum, listing) => sum + (listing.views || 0), 0) +
      userAds.reduce((sum, ad) => sum + (ad.views || 0), 0),
    [userAds, userArticles, userListings]
  )
  const totalLikes = useMemo(
    () => userArticles.reduce((sum, article) => sum + (article.likes || 0), 0),
    [userArticles]
  )
  const totalComments = useMemo(
    () => userArticles.reduce((sum, article) => sum + (article.commentsCount || 0), 0),
    [userArticles]
  )

  const statsData = useMemo(
    () => [
      {
        title: "Total Views",
        value: totalViews.toLocaleString(),
        change: "Live",
        trend: "up",
        icon: Eye,
      },
      {
        title: "Total Likes",
        value: totalLikes.toLocaleString(),
        change: "Live",
        trend: "up",
        icon: Heart,
      },
      {
        title: "Comments",
        value: totalComments.toLocaleString(),
        change: "Live",
        trend: totalComments > 0 ? "up" : "down",
        icon: MessageSquare,
      },
      {
        title: "Followers",
        value: (user?.followers ?? 0).toLocaleString(),
        change: "Live",
        trend: "up",
        icon: TrendingUp,
      },
    ],
    [totalComments, totalLikes, totalViews, user]
  )

  const viewsData = useMemo(() => {
    const total = totalViews || 0
    const distributed = viewWeights.map((weight) => Math.round(total * weight))
    const diff = total - distributed.reduce((sum, value) => sum + value, 0)
    if (diff !== 0) {
      distributed[distributed.length - 1] += diff
    }
    return viewDays.map((name, index) => ({ name, views: distributed[index] || 0 }))
  }, [totalViews])

  const contentData = useMemo(
    () => [
      { name: "Articles", count: userArticles.length },
      { name: "Listings", count: userListings.length },
      { name: "Ads", count: userAds.length },
      { name: "Reviews", count: 0 },
    ],
    [userAds.length, userArticles.length, userListings.length]
  )

  const myContent = useMemo(
    () => ({
      articles: userArticles.map((article) => ({
        id: article.id,
        title: article.title,
        status: article.status ?? "published",
        views: article.views ?? 0,
        likes: article.likes ?? 0,
        date: new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
      listings: userListings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        status: listing.status,
        views: listing.views ?? 0,
        inquiries: 0,
        date: new Date(listing.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
      ads: userAds.map((ad) => ({
        id: ad.id,
        title: ad.title,
        status: ad.status,
        views: ad.views ?? 0,
        messages: 0,
        price: `$${ad.price.toLocaleString()}`,
        date: new Date(ad.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
    }),
    [userAds, userArticles, userListings]
  )

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || "User"}! Here's what's happening.
            </p>
          </div>
          <div className="flex gap-3">
                <Button variant="outline" size="icon" asChild>
                  <Link href="/dashboard/notifications">
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/articles/new">
                    <FileText className="h-4 w-4 mr-2" />
                    New Article
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/listings/new">
                    <Store className="h-4 w-4 mr-2" />
                    New Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/ads/new">
                    <Tag className="h-4 w-4 mr-2" />
                    New Ad
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge
                  variant="secondary"
                  className={
                    stat.trend === "up"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Charts & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Views Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Views Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your content performance this week
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Date range applied",
                      description: "Showing performance for this week.",
                    })
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  This Week
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Content Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl border border-border"
            >
              <Tabs defaultValue="articles" className="w-full">
                <div className="px-6 pt-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    My Content
                  </h2>
                  <TabsList className="w-full justify-start bg-muted/50">
                    <TabsTrigger value="articles">Articles</TabsTrigger>
                    <TabsTrigger value="listings">Listings</TabsTrigger>
                    <TabsTrigger value="ads">Ads</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="articles" className="p-6 pt-4">
                  <div className="space-y-4">
                    {myContent.articles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{article.date}</span>
                            <span>{article.views} views</span>
                            <span>{article.likes} likes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Badge
                            variant={
                              article.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {article.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/articles/${article.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/articles/${article.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/articles/${article.id}/edit`}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/articles">
                      View all articles
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </TabsContent>

                <TabsContent value="listings" className="p-6 pt-4">
                  <div className="space-y-4">
                    {myContent.listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {listing.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{listing.date}</span>
                            <span>{listing.views} views</span>
                            <span>{listing.inquiries} inquiries</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Badge
                            variant={
                              listing.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {listing.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/listings/${listing.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/listings/${listing.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/listings/${listing.id}/edit`}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/listings">
                      View all listings
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </TabsContent>

                <TabsContent value="ads" className="p-6 pt-4">
                  <div className="space-y-4">
                    {myContent.ads.map((ad) => (
                      <div
                        key={ad.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {ad.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {ad.price}
                            </span>
                            <span>{ad.views} views</span>
                            <span>{ad.messages} messages</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Badge
                            variant={
                              ad.status === "active"
                                ? "default"
                                : ad.status === "sold"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {ad.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/ads/${ad.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/ads/${ad.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/ads/${ad.id}/edit`}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/ads">
                      View all ads
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-8">
            {/* Content Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Content Distribution
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Activity
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/notifications">View all</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                        {activity.target && (
                          <span className="font-medium"> {activity.target}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/articles/new">
                    <FileText className="h-4 w-4 mr-3" />
                    Write new article
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/listings/new">
                    <Store className="h-4 w-4 mr-3" />
                    Add business listing
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/ads/new">
                    <Tag className="h-4 w-4 mr-3" />
                    Post classified ad
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/sbm">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Open Social Bookmarks
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}


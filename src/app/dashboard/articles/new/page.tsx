"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Heading1,
  Heading2,
  X,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { loadFromStorage, saveToStorage, storageKeys } from "@/lib/local-storage"
import { CATEGORY_OPTIONS } from "@/lib/categories"
import type { Article } from "@/types"

const categories = CATEGORY_OPTIONS

export default function NewArticlePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const handleCoverUpload = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image." })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2MB." })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setCoverImage(result)
      toast({ title: "Cover added", description: "Image uploaded successfully." })
    }
    reader.readAsDataURL(file)
  }

  const handleToolbarAction = (label: string) => {
    toast({
      title: 'Editor action',
      description: `${label} formatting is a UI-only action in this demo.`,
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const buildArticle = (status: Article['status']): Article | null => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create an article.",
      })
      router.push("/login")
      return null
    }
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast({
        title: "Missing details",
        description: "Add a title, excerpt, and content to continue.",
      })
      return null
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60)

    return {
      id: `user-article-${Date.now()}`,
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || "/placeholder.svg?height=720&width=1280",
      author: user,
      category: category || "General",
      tags: tags.length > 0 ? tags : ["New"],
      publishedAt: new Date().toISOString(),
      readTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      views: 0,
      likes: 0,
      commentsCount: 0,
      isFeatured: false,
      status,
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    const article = buildArticle('draft')
    if (!article) {
      setIsSaving(false)
      return
    }
    const stored = loadFromStorage<Article[]>(storageKeys.articles, [])
    saveToStorage(storageKeys.articles, [article, ...stored])
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast({
      title: "Draft saved",
      description: "Your article was saved to your dashboard.",
    })
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    const article = buildArticle('published')
    if (!article) {
      setIsPublishing(false)
      return
    }
    const stored = loadFromStorage<Article[]>(storageKeys.articles, [])
    saveToStorage(storageKeys.articles, [article, ...stored])
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push("/dashboard/articles")
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">New Article</h1>
              <p className="text-sm text-muted-foreground">
                Create and publish your article
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/articles/preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              {/* Title */}
              <div className="space-y-2 mb-6">
                <Input
                  type="text"
                  placeholder="Article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a short summary of your article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 mb-4 bg-muted/50 rounded-lg">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('H1')}>
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('H2')}>
                  <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Bulleted list')}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Numbered list')}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Quote')}>
                  <Quote className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Link')}>
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Image')}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction('Code')}>
                  <Code className="h-4 w-4" />
                </Button>
              </div>

              {/* Content Editor */}
              <Textarea
                placeholder="Start writing your article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="min-h-[400px] resize-none"
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <Label className="mb-4 block">Cover Image</Label>
              {coverImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setCoverImage("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload cover image
                  </p>
                </div>
              )}
              <Input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverUpload(e.target.files?.[0] ?? null)}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => coverInputRef.current?.click()}>
                  Upload Image
                </Button>
                <Input
                  type="url"
                  placeholder="Or paste image URL..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <Label className="mb-4 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <Label className="mb-4 block">Tags</Label>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Publishing Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <Label className="mb-4 block">Publishing Options</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="text-foreground">Public</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="text-foreground">Enabled</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

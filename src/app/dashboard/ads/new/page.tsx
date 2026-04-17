"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  X,
  Plus,
  MapPin,
  DollarSign,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import type { ClassifiedAd } from "@/types"

const categories = CATEGORY_OPTIONS.map((item) => ({
  value: item.slug,
  label: item.name,
}))

const conditions = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
]

export default function NewAdPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [price, setPrice] = useState("")
  const [priceType, setPriceType] = useState("fixed")
  const [location, setLocation] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState("")
  const imageUploadRef = useRef<HTMLInputElement | null>(null)
  const [contactPreference, setContactPreference] = useState("messages")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleAddImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim()) && images.length < 8) {
      setImages([...images, imageInput.trim()])
      setImageInput("")
    }
  }

  const handleImageUpload = (file: File | null) => {
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
      setImages((prev) => (prev.length < 8 ? [...prev, result] : prev))
      toast({ title: "Image added", description: "Upload complete." })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter((img) => img !== imageToRemove))
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

  const buildAd = (): ClassifiedAd | null => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to publish an ad.",
      })
      router.push("/login")
      return null
    }

    if (!title.trim() || !description.trim() || !category || !location.trim()) {
      toast({
        title: "Missing details",
        description: "Complete the required fields to continue.",
      })
      return null
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60)

    const normalizedCondition = condition === "excellent" ? "good" : condition || "good"
    const computedPrice = priceType === "free" ? 0 : Number(price || 0)

    return {
      id: `user-ad-${Date.now()}`,
      title,
      slug,
      description,
      images: images.length > 0 ? images : ["/placeholder.svg?height=720&width=960"],
      category,
      price: computedPrice,
      currency: "USD",
      condition: normalizedCondition as ClassifiedAd["condition"],
      location,
      seller: user,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      views: 0,
      saves: 0,
      isFeatured: false,
      isNegotiable: priceType === "negotiable",
      status: "active",
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    const ad = buildAd()
    if (!ad) {
      setIsSaving(false)
      return
    }
    const stored = loadFromStorage<ClassifiedAd[]>(storageKeys.ads, [])
    saveToStorage(storageKeys.ads, [ad, ...stored])
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast({
      title: "Draft saved",
      description: "Your ad was saved to your dashboard.",
    })
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    const ad = buildAd()
    if (!ad) {
      setIsPublishing(false)
      return
    }
    const stored = loadFromStorage<ClassifiedAd[]>(storageKeys.ads, [])
    saveToStorage(storageKeys.ads, [ad, ...stored])
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push("/dashboard/ads")
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
              <h1 className="text-2xl font-bold text-foreground">Post New Ad</h1>
              <p className="text-sm text-muted-foreground">
                Create a classified ad to sell your items
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Ad"}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Ad Details
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What are you selling?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {title.length}/80
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((cond) => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail. Include brand, model, condition, and any other relevant information..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                <DollarSign className="h-5 w-5 inline mr-2" />
                Pricing
              </h2>
              <div className="space-y-6">
                <RadioGroup
                  value={priceType}
                  onValueChange={setPriceType}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="font-normal cursor-pointer">
                      Fixed Price
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="negotiable" id="negotiable" />
                    <Label htmlFor="negotiable" className="font-normal cursor-pointer">
                      Negotiable
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="font-normal cursor-pointer">
                      Free
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="contact" id="contact" />
                    <Label htmlFor="contact" className="font-normal cursor-pointer">
                      Contact for Price
                    </Label>
                  </div>
                </RadioGroup>

                {(priceType === "fixed" || priceType === "negotiable") && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                <MapPin className="h-5 w-5 inline mr-2" />
                Location
              </h2>
              <div className="space-y-2">
                <Label htmlFor="location">City / Area *</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Only your general area will be shown. Your exact address is private.
                </p>
              </div>
            </motion.div>

            {/* Contact Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Contact Preferences
              </h2>
              <RadioGroup
                value={contactPreference}
                onValueChange={setContactPreference}
                className="space-y-3"
              >
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="messages" id="messages" className="mt-1" />
                  <div>
                    <Label htmlFor="messages" className="font-normal cursor-pointer">
                      In-app messages only
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive messages through our platform
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="phone" id="phone" className="mt-1" />
                  <div>
                    <Label htmlFor="phone" className="font-normal cursor-pointer">
                      Show phone number
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow buyers to call or text you directly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="both" id="both" className="mt-1" />
                  <div>
                    <Label htmlFor="both" className="font-normal cursor-pointer">
                      Both messages and phone
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow all contact methods
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <Label className="mb-4 block">
                <ImageIcon className="h-4 w-4 inline mr-2" />
                Photos ({images.length}/8)
              </Label>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Paste image URL..."
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddImage()
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddImage}
                  disabled={images.length >= 8}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <Input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => imageUploadRef.current?.click()}
                  disabled={images.length >= 8}
                >
                  Upload Image
                </Button>
                <span className="text-xs text-muted-foreground">
                  Add up to 8 images
                </span>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={img}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleRemoveImage(img)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {i === 0 && (
                        <Badge className="absolute bottom-1 left-1 text-xs">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Add photos of your item
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                First photo will be the main image. Add up to 8 photos.
              </p>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <Label className="mb-4 block">
                <Tag className="h-4 w-4 inline mr-2" />
                Tags
              </Label>
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
              <p className="text-xs text-muted-foreground mt-4">
                Add relevant tags to help buyers find your ad.
              </p>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-primary/5 rounded-xl border border-primary/20 p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                Tips for a Great Ad
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Use clear, high-quality photos</li>
                <li>- Write a descriptive title</li>
                <li>- Be honest about the condition</li>
                <li>- Set a competitive price</li>
                <li>- Respond promptly to inquiries</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

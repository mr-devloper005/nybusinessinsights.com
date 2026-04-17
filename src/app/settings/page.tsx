"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language & Region", icon: Globe },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const [activeSection, setActiveSection] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Form states
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [location, setLocation] = useState(user?.location || "")
  const [website, setWebsite] = useState(user?.website || "")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showEmail, setShowEmail] = useState(false)
  const [allowMessages, setAllowMessages] = useState(true)

  const handleSave = (section?: string) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences were updated.",
      })
    }, 1000)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  useEffect(() => {
    const stored = loadFromStorage<any>(storageKeys.settings, {})
    if (stored.profileVisibility) setProfileVisibility(stored.profileVisibility)
    if (typeof stored.showEmail === "boolean") setShowEmail(stored.showEmail)
    if (typeof stored.allowMessages === "boolean") setAllowMessages(stored.allowMessages)
    if (typeof stored.emailNotifications === "boolean") setEmailNotifications(stored.emailNotifications)
    if (typeof stored.pushNotifications === "boolean") setPushNotifications(stored.pushNotifications)
    if (typeof stored.marketingEmails === "boolean") setMarketingEmails(stored.marketingEmails)
    if (typeof stored.weeklyDigest === "boolean") setWeeklyDigest(stored.weeklyDigest)
    if (stored.language) setLanguage(stored.language)
    if (stored.timezone) setTimezone(stored.timezone)
    if (stored.dateFormat) setDateFormat(stored.dateFormat)
    if (stored.currency) setCurrency(stored.currency)
    if (stored.theme) setTheme(stored.theme)
  }, [])

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setBio(user.bio)
    setLocation(user.location || "")
    setWebsite(user.website || "")
  }, [user])

  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("pst")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [currency, setCurrency] = useState("usd")
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light")

  const persistSettings = (next: Record<string, any>) => {
    const stored = loadFromStorage<Record<string, any>>(storageKeys.settings, {})
    saveToStorage(storageKeys.settings, { ...stored, ...next })
  }

  const notifyProfileUpdate = () => {
    window.dispatchEvent(new CustomEvent("nexus-profile-updated"))
  }

  const handleProfileSave = () => {
    if (!user) return
    updateUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      bio: bio.trim() || user.bio,
      location: location.trim() || undefined,
      website: website.trim() || undefined,
    })
    notifyProfileUpdate()
    persistSettings({
      profileVisibility,
      showEmail,
      allowMessages,
    })
    handleSave("profile")
    setIsEditingProfile(false)
  }

  const handleNotificationSave = () => {
    persistSettings({
      emailNotifications,
      pushNotifications,
      marketingEmails,
      weeklyDigest,
    })
    handleSave("notifications")
  }

  const handlePrivacySave = () => {
    persistSettings({
      profileVisibility,
      showEmail,
      allowMessages,
    })
    handleSave("privacy")
  }

  const handleAppearanceChange = (nextTheme: "Light" | "Dark" | "System") => {
    setTheme(nextTheme)
    persistSettings({ theme: nextTheme })
    const root = document.documentElement
    if (nextTheme === "System") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    } else {
      root.classList.toggle("dark", nextTheme === "Dark")
    }
    toast({
      title: "Theme updated",
      description: `Switched to ${nextTheme} mode.`,
    })
  }

  const handleLanguageSave = () => {
    persistSettings({ language, timezone, dateFormat, currency })
    handleSave("language")
  }

  const handleAvatarUpload = (file: File | null) => {
    if (!file || !user) return
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
      updateUser({ avatar: result })
      toast({ title: "Avatar updated", description: "Your profile photo was updated." })
    }
    reader.readAsDataURL(file)
  }

  const handleCoverUpload = (file: File | null) => {
    if (!file || !user) return
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
      updateUser({ coverImage: result })
      notifyProfileUpdate()
      toast({ title: "Cover updated", description: "Your cover image was updated." })
    }
    reader.readAsDataURL(file)
  }

  const handleProfileCancel = () => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setBio(user.bio)
    setLocation(user.location || "")
    setWebsite(user.website || "")
    toast({ title: "Changes discarded", description: "Profile updates were not saved." })
    setIsEditingProfile(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  {section.label}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              ))}
              <Separator className="my-4" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Profile Information
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Update your personal information and profile picture.
                    </p>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-2xl">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          if (!isEditingProfile) {
                            toast({ title: "Edit mode required", description: "Click Edit Profile to upload." })
                            return
                          }
                          avatarInputRef.current?.click()
                        }}
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <Input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleAvatarUpload(event.target.files?.[0] ?? null)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!isEditingProfile) {
                            toast({ title: "Edit mode required", description: "Click Edit Profile to upload." })
                            return
                          }
                          avatarInputRef.current?.click()
                        }}
                      >
                        Upload new photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-xl border border-border">
                      <div
                        className="h-32 w-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${user?.coverImage || "/placeholder.svg?height=320&width=1280"})`,
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleCoverUpload(event.target.files?.[0] ?? null)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!isEditingProfile) {
                            toast({ title: "Edit mode required", description: "Click Edit Profile to upload." })
                            return
                          }
                          coverInputRef.current?.click()
                        }}
                      >
                        Upload cover image
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Recommended size 1280x320.
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={4}
                        disabled={!isEditingProfile}
                      />
                      <p className="text-xs text-muted-foreground">
                        Brief description for your profile. Max 160 characters.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    {isEditingProfile ? (
                      <>
                        <Button variant="outline" onClick={handleProfileCancel}>
                          Cancel
                        </Button>
                        <Button onClick={handleProfileSave} disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save changes"}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditingProfile(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage how you receive notifications.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for important updates.
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get push notifications on your devices.
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and promotions.
                        </p>
                      </div>
                      <Switch
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Get a weekly summary of activity.
                        </p>
                      </div>
                      <Switch
                        checked={weeklyDigest}
                        onCheckedChange={setWeeklyDigest}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button onClick={handleNotificationSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save preferences"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Privacy & Security
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Control your privacy settings and account security.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Profile visibility</Label>
                      <Select
                        value={profileVisibility}
                        onValueChange={setProfileVisibility}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="followers">Followers only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show email on profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your email address.
                        </p>
                      </div>
                      <Switch
                        checked={showEmail}
                        onCheckedChange={setShowEmail}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow direct messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Let others send you private messages.
                        </p>
                      </div>
                      <Switch
                        checked={allowMessages}
                        onCheckedChange={setAllowMessages}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">
                        Danger Zone
                      </h3>
                      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              Delete account
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all data.
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              toast({
                                title: "Request received",
                                description: "Account deletion requires confirmation.",
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button onClick={handlePrivacySave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save settings"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Appearance
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize how the platform looks for you.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {(["Light", "Dark", "System"] as const).map((themeOption) => (
                        <button
                          key={themeOption}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            theme === themeOption
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-muted-foreground"
                          }`}
                          onClick={() => handleAppearanceChange(themeOption)}
                        >
                          <div
                            className={`w-full h-20 rounded mb-2 ${
                              themeOption === "Light"
                                ? "bg-white border"
                                : themeOption === "Dark"
                                ? "bg-zinc-900"
                                : "bg-gradient-to-r from-white to-zinc-900"
                            }`}
                          />
                          <span className="text-sm font-medium">{themeOption}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Language Section */}
              {activeSection === "language" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Language & Region
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Set your preferred language and regional settings.
                    </p>
                  </div>

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">
                            Pacific Time (PT)
                          </SelectItem>
                          <SelectItem value="est">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="gmt">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date format</Label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (EUR)</SelectItem>
                          <SelectItem value="gbp">GBP (GBP)</SelectItem>
                          <SelectItem value="jpy">JPY (JPY)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button onClick={handleLanguageSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save settings"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}


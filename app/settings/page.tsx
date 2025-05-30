"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import { UserMenu } from "@/components/user-menu"
import { Zap, User, SettingsIcon, Bell, Upload, Check, Palette } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileSettings, setProfileSettings] = useState({
    displayName: "",
    bio: "",
    theme: "default",
    notifications: {
      email: true,
      discord: true,
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load user settings if they exist
      const userSettings = localStorage.getItem(`aurora_user_settings_${parsedUser.id}`)
      if (userSettings) {
        const parsedSettings = JSON.parse(userSettings)
        setProfileSettings(parsedSettings)
      } else {
        // Set default values based on user data
        setProfileSettings((prev) => ({
          ...prev,
          displayName: parsedUser.username,
        }))
      }

      // Load avatar if exists
      const userAvatar = localStorage.getItem(`aurora_user_avatar_${parsedUser.id}`)
      if (userAvatar) {
        setAvatarPreview(userAvatar)
      }
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("aurora_user")
    router.push("/")
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setAvatarPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save settings to localStorage
      localStorage.setItem(`aurora_user_settings_${user.id}`, JSON.stringify(profileSettings))

      // Save avatar if changed
      if (avatarPreview) {
        localStorage.setItem(`aurora_user_avatar_${user.id}`, avatarPreview)
      }

      // Update user object with display name
      const updatedUser = {
        ...user,
        displayName: profileSettings.displayName,
      }
      localStorage.setItem("aurora_user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black relative">
      <WebGLBackground />
      <FloatingParticles />

      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Aurora MC
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-300 hover:text-purple-400 transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-slate-300 hover:text-purple-400 transition-colors">
                Shop
              </Link>
              <Link href="/vote" className="text-slate-300 hover:text-purple-400 transition-colors">
                Vote
              </Link>
              <Link href="/apply" className="text-slate-300 hover:text-purple-400 transition-colors">
                Apply
              </Link>
              <UserMenu onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Customize your profile and manage your account preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-purple-500/20">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-8">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-200">Profile Customization</CardTitle>
                  <CardDescription className="text-slate-400">
                    Customize how others see you on Aurora MC
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {saveSuccess && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Check className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-400">
                        Your profile has been updated successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-slate-700 cursor-pointer group-hover:border-purple-500 transition-colors">
                        <AvatarImage
                          src={avatarPreview || `https://crafatar.com/avatars/${user.username}?size=96&overlay`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="displayName" className="text-slate-300">
                        Display Name
                      </Label>
                      <Input
                        id="displayName"
                        value={profileSettings.displayName}
                        onChange={(e) => setProfileSettings({ ...profileSettings, displayName: e.target.value })}
                        className="bg-slate-800/50 border-slate-700 text-slate-200"
                        placeholder="How you want to be known"
                      />
                      <p className="text-xs text-slate-500">This will be displayed instead of your username</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      value={profileSettings.bio}
                      onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                      className="w-full min-h-[100px] rounded-md bg-slate-800/50 border border-slate-700 text-slate-200 p-2"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-slate-300 flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Profile Theme
                    </Label>
                    <Select
                      value={profileSettings.theme}
                      onValueChange={(value) => setProfileSettings({ ...profileSettings, theme: value })}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="default">Default (Aurora)</SelectItem>
                        <SelectItem value="dark">Dark Void</SelectItem>
                        <SelectItem value="neon">Neon Dreams</SelectItem>
                        <SelectItem value="sunset">Sunset Blaze</SelectItem>
                        <SelectItem value="ocean">Ocean Depths</SelectItem>
                      </SelectContent>
                    </Select>
                    <div
                      className="h-6 w-full rounded-md mt-2"
                      style={{
                        background:
                          profileSettings.theme === "default"
                            ? "linear-gradient(to right, #8b5cf6, #3b82f6)"
                            : profileSettings.theme === "dark"
                              ? "linear-gradient(to right, #1f2937, #111827)"
                              : profileSettings.theme === "neon"
                                ? "linear-gradient(to right, #f0abfc, #818cf8)"
                                : profileSettings.theme === "sunset"
                                  ? "linear-gradient(to right, #f97316, #db2777)"
                                  : "linear-gradient(to right, #0ea5e9, #2dd4bf)",
                      }}
                    ></div>
                  </div>

                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-8">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-200">Account Information</CardTitle>
                  <CardDescription className="text-slate-400">Manage your account details and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Username</Label>
                    <Input value={user.username} className="bg-slate-800/50 border-slate-700 text-slate-200" disabled />
                    <p className="text-xs text-slate-500">Your Minecraft username cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input value={user.email} className="bg-slate-800/50 border-slate-700 text-slate-200" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Account Rank</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.rank === "Owner"
                            ? "bg-red-500/20 text-red-400"
                            : user.rank === "Admin"
                              ? "bg-orange-500/20 text-orange-400"
                              : user.rank === "MVP+"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : user.rank === "MVP"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : user.rank === "VIP+"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : user.rank === "VIP"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {user.rank}
                      </div>
                      {user.rank !== "Owner" && user.rank !== "Admin" && (
                        <Link href="/shop">
                          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 text-xs">
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Join Date</Label>
                    <Input value={user.joinDate} className="bg-slate-800/50 border-slate-700 text-slate-200" disabled />
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-8">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-200">Notification Preferences</CardTitle>
                  <CardDescription className="text-slate-400">Control how and when we contact you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-slate-200 font-medium">Email Notifications</h4>
                        <p className="text-sm text-slate-400">Receive server updates and announcements via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={profileSettings.notifications.email}
                          onChange={() =>
                            setProfileSettings({
                              ...profileSettings,
                              notifications: {
                                ...profileSettings.notifications,
                                email: !profileSettings.notifications.email,
                              },
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-slate-200 font-medium">Discord Notifications</h4>
                        <p className="text-sm text-slate-400">Receive notifications via Discord DM</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={profileSettings.notifications.discord}
                          onChange={() =>
                            setProfileSettings({
                              ...profileSettings,
                              notifications: {
                                ...profileSettings.notifications,
                                discord: !profileSettings.notifications.discord,
                              },
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

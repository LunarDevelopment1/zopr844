"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import { UserMenu } from "@/components/user-menu"
import { Users, Video, Zap, Send, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ApplyPage() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({
    staffApplications: true,
    mediaApplications: true,
    banAppeals: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load settings
    const adminSettings = localStorage.getItem("aurora_admin_settings")
    if (adminSettings) {
      const parsed = JSON.parse(adminSettings)
      setSettings({
        staffApplications: parsed.staffApplications ?? true,
        mediaApplications: parsed.mediaApplications ?? true,
        banAppeals: parsed.banAppeals ?? true,
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("aurora_user")
    setUser(null)
  }

  const handleSubmit = async (type: "staff" | "media" | "appeal", formData: any) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (type === "appeal") {
        // Save ban appeal
        const appeals = JSON.parse(localStorage.getItem("aurora_ban_appeals") || "[]")
        const newAppeal = {
          id: Date.now().toString(),
          username: user.username,
          ...formData,
          status: "pending",
          submittedAt: new Date().toISOString(),
        }
        appeals.push(newAppeal)
        localStorage.setItem("aurora_ban_appeals", JSON.stringify(appeals))
      } else {
        // Save application
        const applications = JSON.parse(localStorage.getItem("aurora_applications") || "[]")
        const newApplication = {
          id: Date.now().toString(),
          type,
          username: user.username,
          email: user.email,
          ...formData,
          status: "pending",
          submittedAt: new Date().toISOString(),
        }
        applications.push(newApplication)
        localStorage.setItem("aurora_applications", JSON.stringify(applications))
      }

      setSubmitSuccess(`Your ${type} application has been submitted successfully!`)
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const ApplicationForm = ({ type }: { type: "staff" | "media" }) => {
    const [formData, setFormData] = useState({
      age: "",
      discordId: "",
      experience: "",
      reason: "",
      timezone: "",
      availability: "",
      channelLink: "", // Only for media applications
    })

    const isEnabled = type === "staff" ? settings.staffApplications : settings.mediaApplications

    if (!isEnabled) {
      return (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Applications Closed</h3>
            <p className="text-slate-400">
              {type === "staff" ? "Staff" : "Media"} applications are currently closed. Please check back later.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            {type === "staff" ? <Users className="w-5 h-5 mr-2" /> : <Video className="w-5 h-5 mr-2" />}
            {type === "staff" ? "Staff Application" : "Media Application"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {type === "staff"
              ? "Apply to become a staff member and help manage the server"
              : "Apply to join our media team and create content for Aurora MC"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitSuccess && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-400">{submitSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-300">
                Age
              </Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
                placeholder="Your age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discordId" className="text-slate-300">
                Discord ID
              </Label>
              <Input
                id="discordId"
                value={formData.discordId}
                onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
                placeholder="e.g., username#1234 or user ID"
                required
              />
            </div>
          </div>

          {type === "media" && (
            <div className="space-y-2">
              <Label htmlFor="channelLink" className="text-slate-300">
                Channel/Content Link
              </Label>
              <Input
                id="channelLink"
                value={formData.channelLink}
                onChange={(e) => setFormData({ ...formData, channelLink: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
                placeholder="YouTube/Twitch/TikTok channel URL"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-slate-300">
              {type === "staff" ? "Moderation Experience" : "Content Creation Experience"}
            </Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[100px]"
              placeholder={
                type === "staff"
                  ? "Describe your experience with moderation, Discord servers, etc."
                  : "Describe your YouTube channel, streaming experience, social media following, etc."
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-slate-300">
              Why do you want to join our {type} team?
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[100px]"
              placeholder="Tell us why you want to be part of our team..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-slate-300">
                Timezone
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="EST">EST (UTC-5)</SelectItem>
                  <SelectItem value="CST">CST (UTC-6)</SelectItem>
                  <SelectItem value="MST">MST (UTC-7)</SelectItem>
                  <SelectItem value="PST">PST (UTC-8)</SelectItem>
                  <SelectItem value="GMT">GMT (UTC+0)</SelectItem>
                  <SelectItem value="CET">CET (UTC+1)</SelectItem>
                  <SelectItem value="IST">IST (UTC+5:30)</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-slate-300">
                Availability (hours/week)
              </Label>
              <Input
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
                placeholder="e.g., 10-15 hours"
                required
              />
            </div>
          </div>

          <Button
            onClick={() => handleSubmit(type, formData)}
            disabled={isSubmitting || !user}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const BanAppealForm = () => {
    const [formData, setFormData] = useState({
      discordId: "",
      banReason: "",
      appealMessage: "",
    })

    if (!settings.banAppeals) {
      return (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Appeals Closed</h3>
            <p className="text-slate-400">Ban appeals are currently closed. Please check back later.</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Ban Appeal
          </CardTitle>
          <CardDescription className="text-slate-400">
            Submit an appeal if you believe your ban was unjustified or if you've learned from your mistakes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitSuccess && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-400">{submitSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="discordId" className="text-slate-300">
              Discord ID
            </Label>
            <Input
              id="discordId"
              value={formData.discordId}
              onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200"
              placeholder="e.g., username#1234 or user ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banReason" className="text-slate-300">
              Ban Reason (if known)
            </Label>
            <Input
              id="banReason"
              value={formData.banReason}
              onChange={(e) => setFormData({ ...formData, banReason: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200"
              placeholder="e.g., Griefing, Harassment, etc. (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appealMessage" className="text-slate-300">
              Appeal Message
            </Label>
            <Textarea
              id="appealMessage"
              value={formData.appealMessage}
              onChange={(e) => setFormData({ ...formData, appealMessage: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[150px]"
              placeholder="Explain why you believe your ban should be lifted. Be honest about what happened and show that you understand why your actions were wrong..."
              required
            />
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-400">
              <strong>Important:</strong> Be honest and respectful in your appeal. False information or disrespectful
              language will result in your appeal being denied.
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => handleSubmit("appeal", formData)}
            disabled={isSubmitting || !user}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Submitting Appeal...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Appeal
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black relative">
        <WebGLBackground />
        <FloatingParticles />

        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <Card className="bg-slate-900/50 border-slate-800 max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Login Required</h3>
              <p className="text-slate-400 mb-6">You must be logged in to submit an application.</p>
              <div className="flex space-x-2">
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">Login</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                    Register
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              <Link href="/apply" className="text-purple-400 font-medium">
                Apply
              </Link>
              <UserMenu onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Help make Aurora MC the best Minecraft server experience for everyone
          </p>
        </div>

        <Tabs defaultValue="staff" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="staff" className="data-[state=active]:bg-purple-500/20">
              <Users className="w-4 h-4 mr-2" />
              Staff Application
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-purple-500/20">
              <Video className="w-4 h-4 mr-2" />
              Media Application
            </TabsTrigger>
            <TabsTrigger value="appeal" className="data-[state=active]:bg-purple-500/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ban Appeal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-8">
            <ApplicationForm type="staff" />
          </TabsContent>

          <TabsContent value="media" className="mt-8">
            <ApplicationForm type="media" />
          </TabsContent>

          <TabsContent value="appeal" className="mt-8">
            <BanAppealForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

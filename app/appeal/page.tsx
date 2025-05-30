"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import { UserMenu } from "@/components/user-menu"
import { MessageSquare, Zap, Send, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AppealPage() {
  const [user, setUser] = useState(null)
  const [banAppealsEnabled, setBanAppealsEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    discordTag: "",
    banReason: "",
    appealMessage: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setFormData((prev) => ({ ...prev, username: parsed.username }))
    }

    // Load settings
    const adminSettings = localStorage.getItem("aurora_admin_settings")
    if (adminSettings) {
      const parsed = JSON.parse(adminSettings)
      setBanAppealsEnabled(parsed.banAppeals ?? true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("aurora_user")
    setUser(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save ban appeal
      const appeals = JSON.parse(localStorage.getItem("aurora_ban_appeals") || "[]")
      const newAppeal = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        submittedAt: new Date().toISOString(),
      }
      appeals.push(newAppeal)
      localStorage.setItem("aurora_ban_appeals", JSON.stringify(appeals))

      setSubmitSuccess(true)
      setFormData({
        username: user.username,
        discordTag: "",
        banReason: "",
        appealMessage: "",
      })
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
              <Link href="/appeal" className="text-purple-400 font-medium">
                Appeal
              </Link>
              <UserMenu onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ban Appeal
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Submit an appeal if you believe your ban was unjustified or if you've learned from your mistakes
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!banAppealsEnabled ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Appeals Closed</h3>
                <p className="text-slate-400">Ban appeals are currently closed. Please check back later.</p>
              </CardContent>
            </Card>
          ) : submitSuccess ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Appeal Submitted</h3>
                <p className="text-slate-400 mb-6">
                  Your ban appeal has been submitted successfully. Our staff team will review it and get back to you
                  soon.
                </p>
                <Button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  Submit Another Appeal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Submit Ban Appeal
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Please fill out all fields honestly and thoroughly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-300">
                      Minecraft Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 text-slate-200"
                      placeholder="Your banned username"
                      required
                      disabled={!!user}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discordTag" className="text-slate-300">
                      Discord Tag
                    </Label>
                    <Input
                      id="discordTag"
                      name="discordTag"
                      value={formData.discordTag}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 text-slate-200"
                      placeholder="YourName#1234"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banReason" className="text-slate-300">
                      Ban Reason (if known)
                    </Label>
                    <Input
                      id="banReason"
                      name="banReason"
                      value={formData.banReason}
                      onChange={handleChange}
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
                      name="appealMessage"
                      value={formData.appealMessage}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[150px]"
                      placeholder="Explain why you believe your ban should be lifted. Be honest about what happened and show that you understand why your actions were wrong..."
                      required
                    />
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-blue-400">
                      <strong>Important:</strong> Be honest and respectful in your appeal. False information or
                      disrespectful language will result in your appeal being denied.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
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
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

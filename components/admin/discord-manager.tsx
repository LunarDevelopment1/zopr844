"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, ExternalLink, Copy } from "lucide-react"

export function DiscordManager() {
  const [discordLink, setDiscordLink] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load Discord link from localStorage
    const savedLink = localStorage.getItem("aurora_discord_link")
    if (savedLink) {
      setDiscordLink(savedLink)
    } else {
      setDiscordLink("https://discord.gg/auroramc")
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("aurora_discord_link", discordLink)
    setIsEditing(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(discordLink)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">Discord Management</h2>
        <Badge variant="outline" className="border-slate-600 text-slate-400">
          Active
        </Badge>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">Discord Invite Link</CardTitle>
          <CardDescription className="text-slate-400">
            Manage the Discord server invite link used for store purchases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discord-link" className="text-slate-300">
                  Discord Invite URL
                </Label>
                <Input
                  id="discord-link"
                  value={discordLink}
                  onChange={(e) => setDiscordLink(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-200"
                  placeholder="https://discord.gg/..."
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-slate-200 font-mono">{discordLink}</p>
                  <p className="text-slate-400 text-sm mt-1">Players will be redirected here after store purchases</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="border-slate-600 text-slate-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(discordLink, "_blank")}
                    className="border-slate-600 text-slate-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                Edit Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">Purchase Flow</CardTitle>
          <CardDescription className="text-slate-400">How the store purchase process works</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <p className="text-slate-300">Player clicks "Purchase" on any store item</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <p className="text-slate-300">System checks if player is logged in</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <p className="text-slate-300">If not logged in, redirect to login page</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                4
              </div>
              <p className="text-slate-300">If logged in, redirect to Discord server</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

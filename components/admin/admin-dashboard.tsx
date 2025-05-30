"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  LogOut,
  FileText,
  DollarSign,
  Users,
  Settings,
  MessageSquare,
  ExternalLink,
  Check,
  X,
  Clock,
} from "lucide-react"
import { NewsEditor } from "./news-editor"
import { PriceEditor } from "./price-editor"
import { ApplicationReview } from "./application-review"
import { BanAppealManager } from "./ban-appeal-manager"
import { DiscordManager } from "./discord-manager"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [settings, setSettings] = useState({
    staffApplications: true,
    mediaApplications: true,
    banAppeals: true,
  })

  const [stats, setStats] = useState({
    pendingApplications: 12,
    pendingAppeals: 5,
    totalUsers: 1247,
    totalSales: 2890,
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("aurora_admin_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("aurora_admin_settings", JSON.stringify(newSettings))
  }

  return (
    <div className="min-h-screen bg-black relative z-10">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
            <Button onClick={onLogout} variant="ghost" className="text-slate-300 hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{stats.pendingApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Appeals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.pendingAppeals}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${stats.totalSales}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-500/20">
              <Settings className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-red-500/20">
              <FileText className="w-4 h-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="prices" className="data-[state=active]:bg-red-500/20">
              <DollarSign className="w-4 h-4 mr-2" />
              Prices
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-red-500/20">
              <Users className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="appeals" className="data-[state=active]:bg-red-500/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Appeals
            </TabsTrigger>
            <TabsTrigger value="discord" className="data-[state=active]:bg-red-500/20">
              <ExternalLink className="w-4 h-4 mr-2" />
              Discord
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-200">Application Settings</CardTitle>
                  <CardDescription className="text-slate-400">Toggle application forms on/off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">Staff Applications</p>
                      <p className="text-slate-400 text-sm">Allow players to apply for staff positions</p>
                    </div>
                    <Switch
                      checked={settings.staffApplications}
                      onCheckedChange={(checked) => updateSetting("staffApplications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">Media Applications</p>
                      <p className="text-slate-400 text-sm">Allow players to apply for media team</p>
                    </div>
                    <Switch
                      checked={settings.mediaApplications}
                      onCheckedChange={(checked) => updateSetting("mediaApplications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">Ban Appeals</p>
                      <p className="text-slate-400 text-sm">Allow banned players to submit appeals</p>
                    </div>
                    <Switch
                      checked={settings.banAppeals}
                      onCheckedChange={(checked) => updateSetting("banAppeals", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-200">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        <Check className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                      <span className="text-slate-300">Staff application from Steve_Builder</span>
                      <span className="text-slate-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Badge variant="outline" className="border-red-500/50 text-red-400">
                        <X className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                      <span className="text-slate-300">Ban appeal from Griefer123</span>
                      <span className="text-slate-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-slate-300">Media application from Alex_Creator</span>
                      <span className="text-slate-500">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <NewsEditor />
          </TabsContent>

          <TabsContent value="prices" className="mt-6">
            <PriceEditor />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationReview settings={settings} />
          </TabsContent>

          <TabsContent value="appeals" className="mt-6">
            <BanAppealManager enabled={settings.banAppeals} />
          </TabsContent>

          <TabsContent value="discord" className="mt-6">
            <DiscordManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

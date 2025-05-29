"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Server, Users, Zap, Crown, Coins, Package } from "lucide-react"
import Link from "next/link"
import { NewsSection } from "@/components/news-section"
import { ContactSection } from "@/components/contact-section"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import { LivePlayerList } from "@/components/live-player-list"
import { UserMenu } from "@/components/user-menu"
import { useState, useEffect } from "react"

export default function HomePage() {
  const serverInfo = {
    ip: "auroramc.playcraft.me",
    version: "1.20.4",
    description:
      "Experience the ultimate survival adventure with custom features, friendly community, and endless possibilities.",
    onlinePlayers: 127,
    maxPlayers: 500,
  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("aurora_user")
    setUser(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative">
      <WebGLBackground />
      <FloatingParticles />
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Aurora MC
              </span>
            </div>
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
              <Link href="#contact" className="text-slate-300 hover:text-purple-400 transition-colors">
                Contact
              </Link>
              <UserMenu onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Aurora MC
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">{serverInfo.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                <Server className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300 font-mono">{serverInfo.ip}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(serverInfo.ip)}
                  className="h-6 w-6 p-0 hover:bg-purple-500/20"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Server Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Server className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-slate-200">Server Version</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-purple-400">{serverInfo.version}</p>
                <p className="text-slate-400 text-sm">Latest Minecraft</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <CardTitle className="text-slate-200">Players Online</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {serverInfo.onlinePlayers}/{serverInfo.maxPlayers}
                </p>
                <p className="text-slate-400 text-sm">Active Community</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-green-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <CardTitle className="text-slate-200">Server Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-green-400">Online</p>
                <p className="text-slate-400 text-sm">99.9% Uptime</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Shop Preview */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-200 mb-4">Server Shop</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Enhance your gameplay with ranks, coins, and exclusive items
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <CardTitle className="text-yellow-400">VIP Ranks</CardTitle>
                <CardDescription className="text-slate-400">Unlock exclusive perks and privileges</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-300">Starting at $5.99</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Coins className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <CardTitle className="text-blue-400">Aurora Coins</CardTitle>
                <CardDescription className="text-slate-400">In-game currency for purchases</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-300">1000 coins - $2.99</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-purple-400">Item Packages</CardTitle>
                <CardDescription className="text-slate-400">Starter kits and special items</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-300">Various prices</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3">
                Visit Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Player List and News */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <LivePlayerList />
            <NewsSection />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Aurora MC
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 Aurora MC. All rights reserved. Not affiliated with Mojang Studios.
          </p>
        </div>
      </footer>
    </div>
  )
}

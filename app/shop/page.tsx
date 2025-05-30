"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Coins, Package, Zap, Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import { UserMenu } from "@/components/user-menu"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ShopPage() {
  const [user, setUser] = useState(null)
  const [discordLink, setDiscordLink] = useState("https://discord.gg/auroramc")
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Get Discord link from admin settings
    const savedLink = localStorage.getItem("aurora_discord_link")
    if (savedLink) {
      setDiscordLink(savedLink)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("aurora_user")
    setUser(null)
  }

  const handlePurchase = (item: any) => {
    if (!user) {
      setShowLoginAlert(true)
      // Scroll to top to show alert
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Redirect to Discord
    window.open(discordLink, "_blank")
  }

  const ranks = [
    {
      name: "VIP",
      price: "$5.99",
      color: "from-green-500 to-emerald-500",
      features: ["Colored name", "5 homes", "Kit VIP", "Priority join"],
    },
    {
      name: "VIP+",
      price: "$9.99",
      color: "from-blue-500 to-cyan-500",
      features: ["All VIP perks", "10 homes", "Kit VIP+", "Fly in lobby", "/nick command"],
    },
    {
      name: "MVP",
      price: "$19.99",
      color: "from-purple-500 to-violet-500",
      features: ["All VIP+ perks", "20 homes", "Kit MVP", "Particle effects", "Custom join message"],
    },
    {
      name: "MVP+",
      price: "$29.99",
      color: "from-yellow-500 to-orange-500",
      features: ["All MVP perks", "Unlimited homes", "Kit MVP+", "Pet companion", "Exclusive areas"],
    },
  ]

  const coinPackages = [
    { amount: "1,000", price: "$2.99", bonus: "" },
    { amount: "2,500", price: "$6.99", bonus: "+500 bonus" },
    { amount: "5,000", price: "$12.99", bonus: "+1,000 bonus" },
    { amount: "10,000", price: "$24.99", bonus: "+2,500 bonus" },
    { amount: "25,000", price: "$49.99", bonus: "+7,500 bonus" },
  ]

  const itemPackages = [
    {
      name: "Starter Kit",
      price: "$3.99",
      description: "Perfect for new players",
      items: ["Diamond tools", "Food supplies", "Basic armor", "Building blocks"],
    },
    {
      name: "Builder's Pack",
      price: "$7.99",
      description: "Everything you need to build",
      items: ["Rare blocks", "Redstone components", "Decoration items", "WorldEdit access"],
    },
    {
      name: "Warrior Bundle",
      price: "$12.99",
      description: "Gear up for combat",
      items: ["Enchanted weapons", "Protection armor", "Potions", "PvP accessories"],
    },
    {
      name: "Ultimate Package",
      price: "$24.99",
      description: "The complete experience",
      items: ["All starter items", "Exclusive cosmetics", "Rare materials", "Special commands"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative">
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
              <Link href="/shop" className="text-purple-400 font-medium">
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

      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Server Shop
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Enhance your Aurora MC experience with ranks, coins, and exclusive items
          </p>
          
          {showLoginAlert && (
            <Alert className="mt-6 border-orange-500/50 bg-orange-500/10 max-w-xl mx-auto">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-400">
                You need to be logged in to make a purchase. 
                <Link href="/login" className="ml-2 underline">
                  Login now
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="ranks" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
              <TabsTrigger
                value="ranks"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
              >
                <Crown className="w-4 h-4 mr-2" />
                Ranks
              </TabsTrigger>
              <TabsTrigger
                value="coins"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
              >
                <Coins className="w-4 h-4 mr-2" />
                Coins
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                <Package className="w-4 h-4 mr-2" />
                Items
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ranks" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ranks.map((rank, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rank.color}`} />
                    <CardHeader className="text-center">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${rank.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
                      >
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-slate-200">{rank.name}</CardTitle>
                      <CardDescription className="text-2xl font-bold text-purple-400">{rank.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {rank.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-slate-300">
                            <Star className="w-3 h-3 text-purple-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full bg-gradient-to-r ${rank.color} hover:opacity-90 text-white`}
                        onClick={() => handlePurchase(rank)}
                      >
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="coins" className="mt-8">
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                {coinPackages.map((pack, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-slate-200">{pack.amount} Coins</CardTitle>
                      {pack.bonus && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          {pack.bonus}
                        </Badge>
                      )}
                      <CardDescription className="text-xl font-bold text-blue-400">{pack.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                        onClick={() => handlePurchase(pack)}
                      >
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="items" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {itemPackages.map((pack, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/50 border-slate-800 hover:border-green-500/50 transition-all duration-300"
                  >
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-\

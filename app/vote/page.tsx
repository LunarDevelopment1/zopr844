"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, ExternalLink, Gift, Trophy, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import { UserMenu } from "@/components/user-menu"
import { useState, useEffect } from "react"

interface VoteLink {
  id: string
  name: string
  url: string
  description: string
  reward: string
  cooldown: number // in hours
  icon: string
  color: string
  lastVoted?: number
}

export default function VotePage() {
  const [user, setUser] = useState(null)
  const [voteData, setVoteData] = useState<{ [key: string]: number }>({})
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load vote data from localStorage
    const savedVoteData = localStorage.getItem("aurora_votes")
    if (savedVoteData) {
      const parsed = JSON.parse(savedVoteData)
      setVoteData(parsed)
      setTotalVotes(Object.values(parsed).reduce((sum: number, votes: number) => sum + votes, 0))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("aurora_user")
    setUser(null)
  }

  const voteLinks: VoteLink[] = [
    {
      id: "planetminecraft",
      name: "Planet Minecraft",
      url: "https://www.planetminecraft.com/server/aurora-mc/vote/",
      description: "Vote on Planet Minecraft and help us reach more players!",
      reward: "500 Aurora Coins + Vote Crate Key",
      cooldown: 24,
      icon: "🌍",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "minecraftservers",
      name: "Minecraft-Servers.net",
      url: "https://minecraft-servers.net/server/aurora-mc/vote/",
      description: "Support us on Minecraft-Servers.net for awesome rewards!",
      reward: "300 Aurora Coins + XP Boost",
      cooldown: 24,
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "topminecraftservers",
      name: "TopMinecraftServers",
      url: "https://topminecraftservers.org/server/aurora-mc/vote/",
      description: "Help us climb the rankings on TopMinecraftServers!",
      reward: "400 Aurora Coins + Rare Item",
      cooldown: 24,
      icon: "🏆",
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "minecraftserverlist",
      name: "Minecraft Server List",
      url: "https://minecraftserverlist.eu/server/aurora-mc/vote/",
      description: "Vote on Minecraft Server List and get exclusive rewards!",
      reward: "350 Aurora Coins + Vote Token",
      cooldown: 24,
      icon: "💎",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  const handleVote = (voteLink: VoteLink) => {
    // Update vote count
    const newVoteData = {
      ...voteData,
      [voteLink.id]: (voteData[voteLink.id] || 0) + 1,
    }
    setVoteData(newVoteData)
    setTotalVotes(totalVotes + 1)
    localStorage.setItem("aurora_votes", JSON.stringify(newVoteData))

    // Open vote link in new tab
    window.open(voteLink.url, "_blank")
  }

  const getTimeUntilNextVote = (lastVoted: number, cooldown: number) => {
    const now = Date.now()
    const nextVoteTime = lastVoted + cooldown * 60 * 60 * 1000
    const timeLeft = nextVoteTime - now

    if (timeLeft <= 0) return null

    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))

    return `${hours}h ${minutes}m`
  }

  const canVote = (lastVoted?: number, cooldown = 24) => {
    if (!lastVoted) return true
    const now = Date.now()
    const nextVoteTime = lastVoted + cooldown * 60 * 60 * 1000
    return now >= nextVoteTime
  }

  const getVoteProgress = () => {
    const dailyGoal = 100
    const todayVotes = totalVotes % dailyGoal
    return (todayVotes / dailyGoal) * 100
  }

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
              <Link href="/shop" className="text-slate-300 hover:text-purple-400 transition-colors">
                Shop
              </Link>
              <Link href="/vote" className="text-purple-400 font-medium">
                Vote
              </Link>
              <Link href="/#contact" className="text-slate-300 hover:text-purple-400 transition-colors">
                Contact
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
            Vote for Aurora MC
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Support our server by voting on these platforms and earn amazing rewards!
          </p>

          {/* Vote Statistics */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="text-center pb-2">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <CardTitle className="text-slate-200 text-lg">Total Votes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{totalVotes.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="text-center pb-2">
                <Gift className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <CardTitle className="text-slate-200 text-lg">Daily Progress</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Progress value={getVoteProgress()} className="mb-2" />
                <p className="text-sm text-slate-400">{Math.floor(getVoteProgress())}% to daily goal</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="text-center pb-2">
                <Star className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <CardTitle className="text-slate-200 text-lg">Server Rank</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-400">#12</p>
                <p className="text-sm text-slate-400">Climbing fast!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vote Links */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {voteLinks.map((voteLink, index) => {
              const userCanVote = canVote(voteLink.lastVoted, voteLink.cooldown)
              const timeLeft = voteLink.lastVoted ? getTimeUntilNextVote(voteLink.lastVoted, voteLink.cooldown) : null
              const voteCount = voteData[voteLink.id] || 0

              return (
                <Card
                  key={voteLink.id}
                  className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${voteLink.color}`} />

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${voteLink.color} rounded-lg flex items-center justify-center text-2xl`}
                        >
                          {voteLink.icon}
                        </div>
                        <div>
                          <CardTitle className="text-slate-200">{voteLink.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              {voteCount} votes
                            </Badge>
                            {!userCanVote && timeLeft && (
                              <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {timeLeft}
                              </Badge>
                            )}
                            {userCanVote && (
                              <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ready
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-slate-400 mt-2">{voteLink.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gift className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">Rewards:</span>
                      </div>
                      <p className="text-sm text-slate-400 bg-slate-800/30 p-2 rounded">{voteLink.reward}</p>
                    </div>

                    <Button
                      onClick={() => handleVote(voteLink)}
                      disabled={!userCanVote}
                      className={`w-full bg-gradient-to-r ${voteLink.color} hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {userCanVote ? (
                        <>
                          Vote Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Cooldown: {timeLeft}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vote Rewards Info */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-200 mb-4">Why Vote?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Your votes help Aurora MC grow and reach more players. In return, we reward you with exclusive items and
              currency!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-900/50 border-slate-800 text-center">
              <CardHeader>
                <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-slate-200">Instant Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Get Aurora Coins, crate keys, and exclusive items immediately after voting.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 text-center">
              <CardHeader>
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <CardTitle className="text-slate-200">Server Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Help Aurora MC climb the rankings and attract more awesome players to our community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 text-center">
              <CardHeader>
                <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <CardTitle className="text-slate-200">Daily Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Vote on all sites daily to unlock special bonus rewards and multipliers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vote Leaderboard */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-200 mb-4">Top Voters This Month</h2>
            <p className="text-slate-400">These dedicated players are helping Aurora MC grow!</p>
          </div>

          <Card className="bg-slate-900/50 border-slate-800 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Steve_Builder", votes: 124, reward: "MVP+ Rank" },
                  { rank: 2, name: "Alex_Warrior", votes: 118, reward: "10,000 Coins" },
                  { rank: 3, name: "Diamond_Miner", votes: 112, reward: "5,000 Coins" },
                  { rank: 4, name: "Redstone_Master", votes: 98, reward: "Vote Crate x5" },
                  { rank: 5, name: "Creeper_Hunter", votes: 87, reward: "Vote Crate x3" },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          player.rank === 1
                            ? "bg-yellow-500 text-black"
                            : player.rank === 2
                              ? "bg-slate-400 text-black"
                              : player.rank === 3
                                ? "bg-orange-500 text-black"
                                : "bg-slate-600 text-white"
                        }`}
                      >
                        #{player.rank}
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">{player.name}</p>
                        <p className="text-slate-400 text-sm">{player.votes} votes</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      {player.reward}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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

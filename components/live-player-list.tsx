"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Wifi, WifiOff } from "lucide-react"
import { useEffect, useState } from "react"

interface Player {
  uuid: string
  name: string
  rank: string
  rankColor: string
  isOnline: boolean
  joinTime: number
  ping: number
}

interface ServerStatus {
  online: boolean
  players: {
    online: number
    max: number
    list: Player[]
  }
  version: string
  motd: string
  ping: number
}

export function LivePlayerList() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock live server data - in production, this would connect to your Minecraft server API
  const mockServerStatus: ServerStatus = {
    online: true,
    players: {
      online: 127,
      max: 500,
      list: [
        {
          uuid: "550e8400-e29b-41d4-a716-446655440000",
          name: "Steve_Builder",
          rank: "MVP+",
          rankColor: "text-yellow-400",
          isOnline: true,
          joinTime: Date.now() - 3600000,
          ping: 45,
        },
        {
          uuid: "550e8400-e29b-41d4-a716-446655440001",
          name: "Alex_Warrior",
          rank: "MVP",
          rankColor: "text-purple-400",
          isOnline: true,
          joinTime: Date.now() - 7200000,
          ping: 32,
        },
        {
          uuid: "550e8400-e29b-41d4-a716-446655440002",
          name: "Notch_Fan",
          rank: "VIP+",
          rankColor: "text-blue-400",
          isOnline: true,
          joinTime: Date.now() - 1800000,
          ping: 67,
        },
        {
          uuid: "550e8400-e29b-41d4-a716-446655440003",
          name: "Creeper_Hunter",
          rank: "VIP",
          rankColor: "text-green-400",
          isOnline: true,
          joinTime: Date.now() - 900000,
          ping: 23,
        },
        {
          uuid: "550e8400-e29b-41d4-a716-446655440004",
          name: "Diamond_Miner",
          rank: "Member",
          rankColor: "text-slate-400",
          isOnline: true,
          joinTime: Date.now() - 5400000,
          ping: 89,
        },
        {
          uuid: "550e8400-e29b-41d4-a716-446655440005",
          name: "Redstone_Master",
          rank: "MVP",
          rankColor: "text-purple-400",
          isOnline: true,
          joinTime: Date.now() - 2700000,
          ping: 41,
        },
      ],
    },
    version: "1.20.4",
    motd: "§5Aurora MC §8- §bSurvival Adventure",
    ping: 15,
  }

  const fetchServerStatus = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, replace with actual server API call:
      // const response = await fetch('/api/server-status')
      // const data = await response.json()

      // Simulate occasional connection issues
      if (Math.random() < 0.1) {
        throw new Error("Failed to connect to server")
      }

      // Add some randomness to player count
      const randomizedStatus = {
        ...mockServerStatus,
        players: {
          ...mockServerStatus.players,
          online: mockServerStatus.players.online + Math.floor(Math.random() * 10) - 5,
          list: mockServerStatus.players.list
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 8) + 4)
            .map((player) => ({
              ...player,
              ping: Math.floor(Math.random() * 100) + 10,
            })),
        },
      }

      setServerStatus(randomizedStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setServerStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServerStatus()

    // Update every 30 seconds
    const interval = setInterval(fetchServerStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatPlayTime = (joinTime: number) => {
    const minutes = Math.floor((Date.now() - joinTime) / 60000)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  const getPingColor = (ping: number) => {
    if (ping < 50) return "text-green-400"
    if (ping < 100) return "text-yellow-400"
    return "text-red-400"
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-200">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Live Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-slate-400">Connecting to server...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !serverStatus) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-200">
            <WifiOff className="w-5 h-5 mr-2 text-red-400" />
            Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-400 mb-2">Failed to connect to server</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button
              onClick={fetchServerStatus}
              className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-200">
          <div className="flex items-center">
            <Wifi className="w-5 h-5 mr-2 text-green-400" />
            Live Players ({serverStatus.players.online}/{serverStatus.players.max})
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            {serverStatus.ping}ms
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {serverStatus.players.list.map((player) => (
            <div
              key={player.uuid}
              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={`https://crafatar.com/avatars/${player.uuid}?size=32&overlay`}
                    alt={player.name}
                    className="w-8 h-8 rounded border border-slate-700"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse" />
                </div>
                <div>
                  <p className="text-slate-200 font-medium">{player.name}</p>
                  <div className="flex items-center space-x-2">
                    {player.rank !== "Member" && <Crown className="w-3 h-3 text-yellow-400" />}
                    <span className={`text-xs ${player.rankColor}`}>{player.rank}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{formatPlayTime(player.joinTime)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={`border-slate-600 ${getPingColor(player.ping)} text-xs`}>
                  {player.ping}ms
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Server Version: {serverStatus.version}</span>
            <button onClick={fetchServerStatus} className="text-purple-400 hover:text-purple-300 transition-colors">
              Refresh
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

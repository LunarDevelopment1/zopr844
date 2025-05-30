"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Wifi, WifiOff } from "lucide-react"

interface Player {
  uuid?: string
  name: string
}

interface ServerResponse {
  online: boolean
  players?: {
    online: number
    max: number
    list?: Player[]
  }
  version?: string
}

export function LivePlayerList() {
  const [serverData, setServerData] = useState<ServerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.mcsrvstat.us/2/paid-01.minegg.lol:25571")
        const data: ServerResponse = await res.json()
        setServerData(data)
      } catch (err) {
        setError("Failed to fetch server status.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // auto refresh every 10 sec

    return () => clearInterval(interval)
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!serverData?.online) return <p className="text-gray-500">Server is offline <WifiOff /></p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Players ({serverData.players?.online} / {serverData.players?.max})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {serverData.players?.list?.map((player, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm">{player.name}</span>
            <Badge><Wifi size={14} /></Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

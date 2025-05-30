"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface BanAppeal {
  id: string
  username: string
  discordTag: string
  banReason: string
  appealMessage: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

interface BanAppealManagerProps {
  enabled: boolean
}

export function BanAppealManager({ enabled }: BanAppealManagerProps) {
  const [appeals, setAppeals] = useState<BanAppeal[]>([])

  useEffect(() => {
    // Load appeals from localStorage
    const savedAppeals = localStorage.getItem("aurora_ban_appeals")
    if (savedAppeals) {
      setAppeals(JSON.parse(savedAppeals))
    } else {
      // Mock appeals
      const mockAppeals: BanAppeal[] = [
        {
          id: "1",
          username: "Griefer123",
          discordTag: "Griefer123#1234",
          banReason: "Griefing spawn area",
          appealMessage:
            "I'm sorry for what I did. I was having a bad day and took it out on the server. I promise it won't happen again and I'll help rebuild what I destroyed.",
          status: "pending",
          submittedAt: "2024-01-15T14:20:00Z",
        },
        {
          id: "2",
          username: "ToxicPlayer",
          discordTag: "ToxicPlayer#5678",
          banReason: "Harassment and toxic behavior",
          appealMessage:
            "I realize my behavior was unacceptable. I've learned from my mistakes and want to be a positive member of the community.",
          status: "pending",
          submittedAt: "2024-01-14T09:15:00Z",
        },
      ]
      setAppeals(mockAppeals)
      localStorage.setItem("aurora_ban_appeals", JSON.stringify(mockAppeals))
    }
  }, [])

  const updateAppealStatus = (id: string, status: "approved" | "rejected") => {
    const updatedAppeals = appeals.map((appeal) => (appeal.id === id ? { ...appeal, status } : appeal))
    setAppeals(updatedAppeals)
    localStorage.setItem("aurora_ban_appeals", JSON.stringify(updatedAppeals))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400 border-green-500/30 bg-green-500/20"
      case "rejected":
        return "text-red-400 border-red-500/30 bg-red-500/20"
      case "pending":
        return "text-orange-400 border-orange-500/30 bg-orange-500/20"
      default:
        return "text-slate-400 border-slate-500/30 bg-slate-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">Ban Appeal Management</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-slate-600 text-slate-400">
            {appeals.filter((appeal) => appeal.status === "pending").length} pending
          </Badge>
          {!enabled && (
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              Disabled
            </Badge>
          )}
        </div>
      </div>

      {!enabled && (
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <p className="text-orange-400">Ban appeals are currently disabled</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {appeals.length > 0 ? (
          appeals.map((appeal) => (
            <Card key={appeal.id} className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-slate-200">{appeal.username}</CardTitle>
                    <CardDescription className="text-slate-400">{appeal.discordTag}</CardDescription>
                    <Badge variant="outline" className={`mt-2 ${getStatusColor(appeal.status)}`}>
                      {appeal.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">{new Date(appeal.submittedAt).toLocaleString()}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-300">Ban Reason:</p>
                  <p className="text-sm text-slate-400">{appeal.banReason}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-300">Appeal Message:</p>
                  <p className="text-sm text-slate-400">{appeal.appealMessage}</p>
                </div>

                {appeal.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateAppealStatus(appeal.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Unban
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateAppealStatus(appeal.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8 text-center">
              <p className="text-slate-400">No ban appeals yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

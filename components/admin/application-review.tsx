"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X } from "lucide-react"

interface Application {
  id: string
  type: "staff" | "media"
  username: string
  email: string
  age: string
  experience: string
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

interface ApplicationReviewProps {
  settings: {
    staffApplications: boolean
    mediaApplications: boolean
  }
}

export function ApplicationReview({ settings }: ApplicationReviewProps) {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    // Load applications from localStorage
    const savedApplications = localStorage.getItem("aurora_applications")
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    } else {
      // Mock applications
      const mockApplications: Application[] = [
        {
          id: "1",
          type: "staff",
          username: "Steve_Builder",
          email: "steve@example.com",
          age: "18",
          experience: "2 years moderating Discord servers",
          reason: "I want to help make the server a better place for everyone",
          status: "pending",
          submittedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          type: "media",
          username: "Alex_Creator",
          email: "alex@example.com",
          age: "20",
          experience: "YouTube channel with 10k subscribers",
          reason: "I create Minecraft content and want to showcase Aurora MC",
          status: "pending",
          submittedAt: "2024-01-14T15:45:00Z",
        },
      ]
      setApplications(mockApplications)
      localStorage.setItem("aurora_applications", JSON.stringify(mockApplications))
    }
  }, [])

  const updateApplicationStatus = (id: string, status: "approved" | "rejected") => {
    const updatedApplications = applications.map((app) => (app.id === id ? { ...app, status } : app))
    setApplications(updatedApplications)
    localStorage.setItem("aurora_applications", JSON.stringify(updatedApplications))
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

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-slate-200">{application.username}</CardTitle>
            <CardDescription className="text-slate-400">{application.email}</CardDescription>
            <Badge variant="outline" className={`mt-2 ${getStatusColor(application.status)}`}>
              {application.status}
            </Badge>
          </div>
          <Badge variant="outline" className="border-slate-600 text-slate-400 capitalize">
            {application.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-300">Age: {application.age}</p>
          <p className="text-sm font-medium text-slate-300 mt-1">Experience:</p>
          <p className="text-sm text-slate-400">{application.experience}</p>
          <p className="text-sm font-medium text-slate-300 mt-2">Reason:</p>
          <p className="text-sm text-slate-400">{application.reason}</p>
        </div>

        <div className="text-xs text-slate-500">Submitted: {new Date(application.submittedAt).toLocaleString()}</div>

        {application.status === "pending" && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => updateApplicationStatus(application.id, "approved")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              onClick={() => updateApplicationStatus(application.id, "rejected")}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const staffApplications = applications.filter((app) => app.type === "staff")
  const mediaApplications = applications.filter((app) => app.type === "media")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">Application Review</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-slate-600 text-slate-400">
            {applications.filter((app) => app.status === "pending").length} pending
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="staff" className="data-[state=active]:bg-red-500/20">
            Staff Applications ({staffApplications.length})
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-red-500/20">
            Media Applications ({mediaApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-6">
          {!settings.staffApplications && (
            <Card className="bg-orange-500/10 border-orange-500/30 mb-6">
              <CardContent className="p-4">
                <p className="text-orange-400">Staff applications are currently disabled</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {staffApplications.length > 0 ? (
              staffApplications.map((app) => <ApplicationCard key={app.id} application={app} />)
            ) : (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-8 text-center">
                  <p className="text-slate-400">No staff applications yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          {!settings.mediaApplications && (
            <Card className="bg-orange-500/10 border-orange-500/30 mb-6">
              <CardContent className="p-4">
                <p className="text-orange-400">Media applications are currently disabled</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {mediaApplications.length > 0 ? (
              mediaApplications.map((app) => <ApplicationCard key={app.id} application={app} />)
            ) : (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-8 text-center">
                  <p className="text-slate-400">No media applications yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

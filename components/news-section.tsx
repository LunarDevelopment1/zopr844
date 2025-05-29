import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Zap, Gift, Wrench } from "lucide-react"

export function NewsSection() {
  const news = [
    {
      title: "Winter Event Now Live!",
      date: "2024-01-15",
      type: "Event",
      icon: Gift,
      content:
        "Join our winter celebration with special rewards, snow-themed builds, and limited-time items. Event runs until January 31st!",
      color: "text-blue-400",
    },
    {
      title: "Server Update 1.20.4",
      date: "2024-01-10",
      type: "Update",
      icon: Wrench,
      content:
        "Updated to Minecraft 1.20.4 with performance improvements, new features, and bug fixes. Check out the new content!",
      color: "text-green-400",
    },
    {
      title: "New PvP Arena Released",
      date: "2024-01-05",
      type: "Feature",
      icon: Zap,
      content:
        "Experience intense battles in our brand new PvP arena with custom game modes and exclusive rewards for winners.",
      color: "text-purple-400",
    },
    {
      title: "Community Build Contest",
      date: "2024-01-01",
      type: "Contest",
      icon: Calendar,
      content:
        "Show off your building skills in our monthly contest! Theme: 'Futuristic Cities'. Prizes include ranks and exclusive items.",
      color: "text-yellow-400",
    },
  ]

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-200">
          <Calendar className="w-5 h-5 mr-2 text-purple-400" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {news.map((item, index) => (
            <div key={index} className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <h3 className="font-semibold text-slate-200">{item.title}</h3>
                </div>
                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                  {item.type}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mb-2">{item.content}</p>
              <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

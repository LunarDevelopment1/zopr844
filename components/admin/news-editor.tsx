"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  content: string
  type: string
  date: string
  published: boolean
}

export function NewsEditor() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    // Load news from localStorage
    const savedNews = localStorage.getItem("aurora_news")
    if (savedNews) {
      setNews(JSON.parse(savedNews))
    } else {
      // Default news items
      const defaultNews: NewsItem[] = [
        {
          id: "1",
          title: "Winter Event Now Live!",
          content:
            "Join our winter celebration with special rewards, snow-themed builds, and limited-time items. Event runs until January 31st!",
          type: "Event",
          date: "2024-01-15",
          published: true,
        },
        {
          id: "2",
          title: "Server Update 1.20.4",
          content:
            "Updated to Minecraft 1.20.4 with performance improvements, new features, and bug fixes. Check out the new content!",
          type: "Update",
          date: "2024-01-10",
          published: true,
        },
      ]
      setNews(defaultNews)
      localStorage.setItem("aurora_news", JSON.stringify(defaultNews))
    }
  }, [])

  const saveNews = (updatedNews: NewsItem[]) => {
    setNews(updatedNews)
    localStorage.setItem("aurora_news", JSON.stringify(updatedNews))
  }

  const handleSave = (newsItem: NewsItem) => {
    if (isCreating) {
      const newNews = [...news, { ...newsItem, id: Date.now().toString() }]
      saveNews(newNews)
      setIsCreating(false)
    } else {
      const updatedNews = news.map((item) => (item.id === newsItem.id ? newsItem : item))
      saveNews(updatedNews)
    }
    setEditingNews(null)
  }

  const handleDelete = (id: string) => {
    const updatedNews = news.filter((item) => item.id !== id)
    saveNews(updatedNews)
  }

  const NewsForm = ({
    item,
    onSave,
    onCancel,
  }: {
    item: NewsItem | null
    onSave: (item: NewsItem) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<NewsItem>(
      item || {
        id: "",
        title: "",
        content: "",
        type: "Update",
        date: new Date().toISOString().split("T")[0],
        published: true,
      },
    )

    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">{item ? "Edit News" : "Create News"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200"
              placeholder="News title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-300">
              Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[100px]"
              placeholder="News content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-slate-300">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Update">Update</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Feature">Feature</SelectItem>
                  <SelectItem value="Contest">Contest</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-300">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-200"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => onSave(formData)} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={onCancel} variant="outline" className="border-slate-600 text-slate-300">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">News Management</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create News
        </Button>
      </div>

      {(isCreating || editingNews) && (
        <NewsForm
          item={editingNews}
          onSave={handleSave}
          onCancel={() => {
            setIsCreating(false)
            setEditingNews(null)
          }}
        />
      )}

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id} className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-slate-200">{item.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="border-slate-600 text-slate-400">
                      {item.type}
                    </Badge>
                    <span className="text-slate-500 text-sm">{item.date}</span>
                    {item.published && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingNews(item)}
                    className="border-slate-600 text-slate-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

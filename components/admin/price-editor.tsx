"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, Edit, X } from "lucide-react"

interface PriceItem {
  id: string
  name: string
  category: "ranks" | "coins" | "items"
  price: string
  description: string
}

export function PriceEditor() {
  const [prices, setPrices] = useState<PriceItem[]>([])
  const [editingItem, setEditingItem] = useState<string | null>(null)

  useEffect(() => {
    // Load prices from localStorage
    const savedPrices = localStorage.getItem("aurora_prices")
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices))
    } else {
      // Default prices
      const defaultPrices: PriceItem[] = [
        { id: "1", name: "VIP", category: "ranks", price: "$5.99", description: "Basic VIP rank" },
        { id: "2", name: "VIP+", category: "ranks", price: "$9.99", description: "Enhanced VIP rank" },
        { id: "3", name: "MVP", category: "ranks", price: "$19.99", description: "MVP rank with perks" },
        { id: "4", name: "MVP+", category: "ranks", price: "$29.99", description: "Ultimate MVP rank" },
        { id: "5", name: "1,000 Coins", category: "coins", price: "$2.99", description: "Aurora Coins" },
        { id: "6", name: "5,000 Coins", category: "coins", price: "$12.99", description: "Aurora Coins + bonus" },
        { id: "7", name: "Starter Kit", category: "items", price: "$3.99", description: "Perfect for new players" },
        { id: "8", name: "Ultimate Package", category: "items", price: "$24.99", description: "Complete experience" },
      ]
      setPrices(defaultPrices)
      localStorage.setItem("aurora_prices", JSON.stringify(defaultPrices))
    }
  }, [])

  const savePrices = (updatedPrices: PriceItem[]) => {
    setPrices(updatedPrices)
    localStorage.setItem("aurora_prices", JSON.stringify(updatedPrices))
  }

  const handleSave = (id: string, newPrice: string) => {
    const updatedPrices = prices.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    savePrices(updatedPrices)
    setEditingItem(null)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ranks":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/20"
      case "coins":
        return "text-blue-400 border-blue-500/30 bg-blue-500/20"
      case "items":
        return "text-green-400 border-green-500/30 bg-green-500/20"
      default:
        return "text-slate-400 border-slate-500/30 bg-slate-500/20"
    }
  }

  const groupedPrices = prices.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, PriceItem[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">Price Management</h2>
        <Badge variant="outline" className="border-slate-600 text-slate-400">
          {prices.length} items
        </Badge>
      </div>

      {Object.entries(groupedPrices).map(([category, items]) => (
        <Card key={category} className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200 capitalize flex items-center">
              {category}
              <Badge variant="outline" className={`ml-2 ${getCategoryColor(category)}`}>
                {items.length} items
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-400">Manage {category} pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-200">{item.name}</h3>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {editingItem === item.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          defaultValue={item.price}
                          className="w-24 bg-slate-700 border-slate-600 text-slate-200"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSave(item.id, (e.target as HTMLInputElement).value)
                            }
                            if (e.key === "Escape") {
                              setEditingItem(null)
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const input = document.querySelector(
                              `input[defaultValue="${item.price}"]`,
                            ) as HTMLInputElement
                            if (input) handleSave(item.id, input.value)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(null)}
                          className="border-slate-600 text-slate-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-slate-200">{item.price}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(item.id)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

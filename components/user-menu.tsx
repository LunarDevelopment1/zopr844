"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, LogOut, Crown, User } from "lucide-react"
import Link from "next/link"

interface UserType {
  id: string
  email: string
  username: string
  displayName?: string
  rank: string
  joinDate: string
}

interface UserMenuProps {
  onLogout: () => void
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("aurora_user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Check for custom avatar
      const userAvatar = localStorage.getItem(`aurora_user_avatar_${parsedUser.id}`)
      if (userAvatar) {
        setAvatarUrl(userAvatar)
      }
    }
  }, [])

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="ghost" className="text-slate-300 hover:text-purple-400">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Owner":
        return "text-red-400 border-red-500/30 bg-red-500/20"
      case "Admin":
        return "text-orange-400 border-orange-500/30 bg-orange-500/20"
      case "MVP+":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/20"
      case "MVP":
        return "text-purple-400 border-purple-500/30 bg-purple-500/20"
      case "VIP+":
        return "text-blue-400 border-blue-500/30 bg-blue-500/20"
      case "VIP":
        return "text-green-400 border-green-500/30 bg-green-500/20"
      default:
        return "text-slate-400 border-slate-500/30 bg-slate-500/20"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-slate-700">
            <AvatarImage
              src={avatarUrl || `https://crafatar.com/avatars/${user.username}?size=40&overlay`}
              alt={user.username}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none text-slate-200">{user.displayName || user.username}</p>
              {user.rank !== "Member" && <Crown className="w-3 h-3 text-yellow-400" />}
            </div>
            <p className="text-xs leading-none text-slate-400">{user.email}</p>
            <Badge variant="outline" className={`text-xs w-fit ${getRankColor(user.rank)}`}>
              {user.rank}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        <Link href="/settings">
          <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-slate-200 cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings?tab=account">
          <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-slate-200 cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

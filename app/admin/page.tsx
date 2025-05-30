"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem("aurora_admin_token")
    if (adminToken) {
      // Verify token validity (in production, verify with server)
      try {
        const tokenData = JSON.parse(atob(adminToken))
        if (tokenData.email === "smokyapplemc@gmail.com" && tokenData.expires > Date.now()) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("aurora_admin_token")
        }
      } catch (error) {
        localStorage.removeItem("aurora_admin_token")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("aurora_admin_token")
    setIsAuthenticated(false)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative">
      <WebGLBackground />
      <FloatingParticles />

      {!isAuthenticated ? <AdminLogin onSuccess={handleLoginSuccess} /> : <AdminDashboard onLogout={handleLogout} />}
    </div>
  )
}

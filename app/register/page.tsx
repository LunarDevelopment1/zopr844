"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"
import { WebGLBackground } from "@/components/webgl-background"
import { FloatingParticles } from "@/components/floating-particles"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user is already logged in
    const user = localStorage.getItem("aurora_user")
    if (user) {
      router.push("/")
    }
  }, [router])

  const handleRegisterSuccess = () => {
    router.push("/")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <WebGLBackground />
      <FloatingParticles />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Aurora MC
            </span>
          </Link>
        </div>

        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  )
}

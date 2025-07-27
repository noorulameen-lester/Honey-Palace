"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check for admin credentials
      if (formData.email === "nooru36124@gmail.com" && formData.password === "12345") {
        // Admin login
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            name: "Admin",
            email: formData.email,
            role: "admin",
          }),
        )
        router.push("/admin")
        return
      }

      // Regular user login logic would go here
      // For now, we'll simulate a successful login
      if (formData.email && formData.password) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "User",
            email: formData.email,
            role: "customer",
          }),
        )
        router.push("/")
      } else {
        setError("Please fill in all fields")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">🍯</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to your Honey Palace account</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Admin Credentials Display */}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-950/20 p-2 rounded">{error}</div>
              )}

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-amber-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-amber-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Quick Login Options */}
            {/* <div className="space-y-2">
              <p className="text-xs text-center text-gray-500">Quick Login Options:</p>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-transparent"
                  onClick={() => {
                    setFormData({ email: "shaz80170@gmail.com", password: "871459" })
                  }}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-transparent"
                  onClick={() => {
                    setFormData({ email: "customer@example.com", password: "password" })
                  }}
                >
                  <User className="h-3 w-3 mr-1" />
                  Customer
                </Button>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

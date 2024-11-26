"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { Palette, User, Mail, Lock, Github } from 'lucide-react'
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    userRole: ""
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userRole) {
      toast.error("Please select your role in the art world")
      return
    }
  
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
  
      if (res.ok) {
        toast.success("Welcome to the world of art auctions!")
        router.push("/auth/login")
      } else {
        const errorData = await res.json()
        const errorMessage = errorData?.error || "Registration failed"
        toast.error(errorMessage)
      }
    } catch (err) {
      toast.error("An error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">Join the Art World</CardTitle>
        <CardDescription className="text-center">
          Create your account and start your artistic journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="sr-only">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Username"
                type="text"
                disabled={isLoading}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="sr-only">First Name</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                type="text"
                disabled={isLoading}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="sr-only">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                type="text"
                disabled={isLoading}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole" className="sr-only">Your Role</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, userRole: value }))}>
              <SelectTrigger className="w-full">
                <Palette className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your Role in the Art World</SelectLabel>
                  <SelectItem value="BUYER">Art Enthusiast</SelectItem>
                  <SelectItem value="ARTIST">Artist</SelectItem>
                  <SelectItem value="MUSEUM">Gallery / Museum</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                placeholder="Password"
                type="password"
                disabled={isLoading}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Palette className="mr-2 h-4 w-4" />
            )}
            Begin Your Artistic Journey
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </CardContent>
    </Card>
  )
}


"use client"

import React, { Suspense } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Palette, User, Lock, Github } from 'lucide-react'
import { useSession } from "@/context/SessionContext"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const Main = React.memo(function SignInForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { login } = useSession()
  const searchParams = useSearchParams()
  const [formData, setFormData] = React.useState({
    identifier: "", 
    password: "",
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await login(formData.identifier, formData.password)
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">Welcome Back, Artist</CardTitle>
        <CardDescription className="text-center">
          Sign in to continue your artistic journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="sr-only">Email or Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="identifier"
                placeholder="Email or Username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={isLoading}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:text-primary/90"
              >
                Forgot your masterpiece key?
              </Link>
            </div>
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
            Enter the Gallery
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

        <p className="mt-4 text-center text-sm text-muted-foreground">
          New to our art community?{' '}
          <Link 
            href="/register" 
            className="text-primary hover:text-primary/90 font-medium"
          >
            Create your artistic profile
          </Link>
        </p>
      </CardContent>
    </Card>
  )
})

export default function SignInForm(props: UserAuthFormProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main {...props} />
    </Suspense>
  )
}


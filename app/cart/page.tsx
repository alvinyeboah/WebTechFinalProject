"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from "next/link"

interface CartItem {
  id: string
  title: string
  artist: string
  price: number
  image: string
}

const cartItems: CartItem[] = [
  {
    id: "1",
    title: "Starry Night",
    artist: "Vincent van Gogh",
    price: 100000,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    price: 200000,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function CartPage() {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4">
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.artist}</p>
                    </div>
                    <p className="font-semibold">${item.price.toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between py-2 font-semibold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Continue Shopping</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <img src={`/placeholder.svg?height=200&width=300`} alt={`Featured artwork ${i}`} className="w-full h-48 object-cover rounded mb-4" />
                  <h3 className="font-semibold">Featured Artwork {i}</h3>
                  <p className="text-sm text-gray-500">Artist Name</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


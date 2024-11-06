import { z } from "zod"

export const userValidation = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  userRole: z.enum(["ADMIN", "BUYER", "MUSEUM", "ARTIST"]),
})

export const artworkValidation = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.enum([
    "PAINTING",
    "SCULPTURE", 
    "PHOTOGRAPHY",
    "PRINT",
    "DIGITAL",
    "MIXED_MEDIA",
    "OTHER"
  ])
})

export const bidValidation = z.object({
  amount: z.number().positive(),
  artworkId: z.string().uuid(),
  userId: z.string().uuid()
})
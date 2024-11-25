import { z } from "zod";

// lib/validation.ts
export const userRoles = ['ADMIN', 'BUYER', 'MUSEUM', 'ARTIST'] as const;
export type UserRole = typeof userRoles[number];

export const artworkCategories = [
  'PAINTING',
  'SCULPTURE',
  'PHOTOGRAPHY',
  'PRINT',
  'DIGITAL',
  'MIXED_MEDIA',
  'OTHER'
] as const;
export type ArtworkCategory = typeof artworkCategories[number];

export const userValidation = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
  userRole: z.enum(userRoles)
});
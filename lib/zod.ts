import { object, string } from "zod"

export const signInSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(3, "Password must be more than 3 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = object({
  name: string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  phone: string().optional(),
  password: string()
    .min(1, "Password is required")
    .min(3, "Password must be more than 3 characters")
    .max(32, "Password must be less than 32 characters"),
})

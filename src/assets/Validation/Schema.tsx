import { z } from "zod";
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(12, { message: "Password must be not more than 12 characters" })
    .trim(),
  rememberMe: z.boolean().optional(),
});
export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
});
export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(15, { message: "Password must not be more than 15 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          "Password must include uppercase, lowercase, number, and symbol",
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // show error under confirmPassword field
    message: "Password do not match",
  });

export const citySchema = z.object({
  cityId: z
    .string()
    .min(1, { message: "City ID is required" })
    .min(3, { message: "City ID must be at least 3 characters" })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "City ID can only contain letters, numbers, underscores, or hyphens",
    })
    .trim(),
  cityName: z
    .string()
    .min(1, { message: "City Name is required" })
    .min(3, { message: "City Name must be at least 3 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "City Name can only contain letters and spaces",
    })
    .trim(),
});

export const locationSchema = z.object({
  locationId: z
    .string()
    .min(1, { message: "Location ID is required" })
    .min(3, { message: "Location ID must be at least 3 characters" })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "Location ID can only contain letters, numbers, underscores, or hyphens",
    })
    .trim(),
  locationName: z
    .string()
    .min(1, { message: "Location Name is required" })
    .min(3, { message: "Location Name must be at least 3 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Location Name can only contain letters and spaces",
    })
    .trim(),
  cityName: z
    .string()
    .min(1, { message: "City Name is required" })
    .min(3, { message: "City Name must be at least 3 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "City Name can only contain letters and spaces",
    })
    .trim(),
});

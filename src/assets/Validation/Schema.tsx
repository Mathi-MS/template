import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().min(1, { message: "UserId is required" }).trim(),
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
  id: z.string().optional(),
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
  city: z.string().min(1, { message: "City Name is required" }).trim(),
});

export const vendorSchema = z.object({
  vendorId: z.string().min(1, "Vendor ID is required"),
  vendorName: z.string().min(1, "Vendor Name is required"),
  city: z.string().min(1, { message: "City Name is required" }).trim(),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .min(10, "Mobile must be at least 10 digits")
    .max(15, "Mobile number too long"),
});

export const transportSchema = z.object({
  transportId: z.string().min(1, "Transport ID is required"),
  vehicleNo: z.string().min(1, "Vehicle Number is required"),
  ownerDetails: z.string().min(1, "Owner Details is required"),
  contact: z.string().min(1, "Contact is required"),
  type: z.string().min(1, "Type is required"),
  seater: z.coerce
    .number()
    .min(1, "Seater is required")
    .max(20, "Seater must be less than 20"),
  vendor: z.string().min(1, "Vendor is required"),
  vendorName: z.string().optional(),
  city: z.string().min(1, { message: "City Name is required" }),
  cityName: z.string().optional(),
});

export const userSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  mobileNo: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(15, { message: "Mobile number is too long" })
    .regex(/^[0-9]+$/, { message: "Mobile number must contain only digits" }),
  pickupLocation: z.string().min(1, { message: "Pickup Location is required" }),
  cityId: z.string().min(1, { message: "City is required" }),
  transport: z.string().min(1, { message: "Transport is required" }),
  pickupDate: z
    .custom<Dayjs>((val) => dayjs.isDayjs(val), {
      message: "Pickup date is required",
    })
    .refine((date) => date && date.isValid(), {
      message: "Invalid date format",
    })
    .refine((date) => date && !date.isBefore(dayjs().startOf("day")), {
      message: "Pickup Date cannot be in the past",
    }),
  noOfPerson: z.string().min(1, { message: "At least 1 person is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

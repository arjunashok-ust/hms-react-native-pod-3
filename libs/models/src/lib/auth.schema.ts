import { z } from "zod";
import { BloodGroupSchema, GenderSchema, RoleSchema, UserStatusSchema } from "./user.schema";

export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  isClientApp: z.boolean()
});

export const SignUpRequestSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).describe('User full name'),
  email: z.email({ message: 'Invalid email address' }).describe('User email address'),
  role: RoleSchema.describe('User role'),
  status: UserStatusSchema.describe('Account status'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .describe('Account password'),
  phone: z.string().nullable().optional().describe('User phone number'),
  gender: GenderSchema.describe('User gender'),
  address: z.string().min(1, { message: 'Address is required' }).describe('User residential address'),
  bloodGroup: BloodGroupSchema.describe('User blood group'),
  allergies: z.string().optional().describe('Known allergies'),
  dob: z.coerce.date().describe('User date of birth'),
  emergencyContact: z.string().nullable().optional().describe('Emergency contact phone number')
});

export type SignUpRequestModel = z.infer<typeof SignUpRequestSchema>
export type LoginRequestModel = z.infer<typeof LoginRequestSchema>

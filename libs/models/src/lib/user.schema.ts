import { z } from "zod";

export const RoleSchema = z.enum([
  'Owner',
  'Super Admin',
  'Admin',
  'Doctor',
  'Receptionist',
  'Cashier',
  'Nurse',
  'Lab_Tech',
  'Pharmacist',
  'Patient'
]);

export const UserStatusSchema = z.enum(['Active', 'Inactive', 'Pending']);

export const GenderSchema = z.enum(['Male', 'Female']);

export const BloodGroupSchema = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

export const DepartmentSchema = z.enum(['OPD', 'IPD', 'Lab', 'Pharmacy', 'Administration', 'ICU']);

export const UserSchema = z.object({
  name: z.string().describe('Employee full name'),
  email: z.email({ message: 'Invalid email address' }).describe('Employee email address'),
  status: UserStatusSchema.describe('Account status'),
  role: RoleSchema.describe('User role'),
  employeeCode: z.string().describe('Generated employee code, e.g. EMP-000001'),
  isVerified: z.boolean().describe('Whether the email is verified'),
  firstLogin: z.boolean().describe('Whether the user has not logged in yet'),
  department: DepartmentSchema.describe('Employee department'),
  designation: z.string().describe('Employee designation'),
  joiningDate: z.coerce.date().describe('Employee joining date'),
  medicalRegistrationNo: z.string().optional().describe('Medical registration number'),
  specialization: z.string().optional().describe('Doctor specialization'),
  qualification: z.string().optional().describe('Employee qualification'),
  consultationFee: z.number().optional().describe('Doctor consultation fee'),
  availabilitySlots: z.array(z.string()).describe('Doctor availability time slots')
});

export const PatientSchema = z.object({
  name: z.string().describe('Patient full name'),
  uhid: z.string().describe('Generated patient id, e.g. PAT-000001'),
  dob: z.string().describe('Patient date of birth'),
  gender: GenderSchema.describe('Patient gender'),
  email: z.email({ message: 'Invalid email address' }).describe('Patient email address'),
  address: z.string().describe('Patient residential address'),
  phone: z.string().nullable().optional().describe('Patient phone number'),
  emergencyContact: z.string().nullable().optional().describe('Emergency contact phone number'),
  bloodGroup: BloodGroupSchema.describe('Patient blood group'),
  allergies: z.string().optional().describe('Known allergies'),
  status: UserStatusSchema.describe('Account status'),
  role: RoleSchema.describe('User role'),
  isVerified: z.boolean().describe('Whether the email is verified')
});

export type Role = z.infer<typeof RoleSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type BloodGroup = z.infer<typeof BloodGroupSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type UserModel = z.infer<typeof UserSchema>;
export type PatientModel = z.infer<typeof PatientSchema>;

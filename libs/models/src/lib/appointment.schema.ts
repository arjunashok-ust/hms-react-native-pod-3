import { z } from "zod";

export const AppointmentStatusSchema = z.enum(['Booked', 'Cancelled', 'Completed', 'Pending']);

export const AppointmentSchema = z.object({
  appointmentId: z.string().describe('Generated appointment id, e.g. APT-000001'),
  patientId: z.string().min(1, { message: 'Patient is required' }).describe('Patient UHID'),
  doctorEmployeeId: z.string().min(1, { message: 'Doctor is required' }).describe('Doctor employee id'),
  date: z.coerce.date().describe('Appointment date'),
  status: AppointmentStatusSchema.describe('Appointment status'),
  timeSlot: z.string().min(1, { message: 'Time slot is required' }).describe('Appointment time slot'),
  createdByEmployeeId: z.string().min(1).describe('Employee who created the appointment')
});

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type AppointmentModel = z.infer<typeof AppointmentSchema>;

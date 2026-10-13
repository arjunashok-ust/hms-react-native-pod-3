import { z } from 'zod';
import { APPOINTMENT_STATUS, VALIDATION_MESSAGES as V } from './constants';
import { requiredString, dateSchema, paginationInput, paginated, messageOutput } from './common.schema';
import { appointmentSchema, employeeSchema } from './entities.schema';

const statusSchema = z.enum(['Booked', 'Cancelled', 'Completed', 'Pending'], { error: V.STATUS_INVALID });

// Inputs
// createdBy / deletedBy are taken from the access token, never from the client.

export const createAppointmentInput = z.object({
  patientId: requiredString(V.PATIENT_ID_REQUIRED),
  doctorEmployeeId: requiredString(V.DOCTOR_ID_REQUIRED),
  date: dateSchema(V.APPOINTMENT_DATE_REQUIRED),
  timeSlot: requiredString(V.TIME_SLOT_REQUIRED),
  status: statusSchema.default(APPOINTMENT_STATUS.BOOKED),
});

export const getAllAppointmentsInput = paginationInput;

export const getAppointmentsByPatientIdInput = paginationInput.extend({
  patientId: requiredString(V.PATIENT_ID_REQUIRED),
});

export const appointmentIdInput = z.object({ appointmentId: requiredString(V.APPOINTMENT_ID_REQUIRED) });

export const employeeIdInput = z.object({ employeeId: requiredString(V.EMPLOYEE_ID_REQUIRED) });

export const editAppointmentInput = z.object({
  appointmentId: requiredString(V.APPOINTMENT_ID_REQUIRED),
  patientId: requiredString(V.PATIENT_ID_REQUIRED),
  doctorEmployeeId: requiredString(V.DOCTOR_ID_REQUIRED),
  date: dateSchema(V.APPOINTMENT_DATE_REQUIRED),
  timeSlot: requiredString(V.TIME_SLOT_REQUIRED),
  status: statusSchema.optional(),
});

export const editAppointmentStatusInput = z.object({
  appointmentId: requiredString(V.APPOINTMENT_ID_REQUIRED),
  status: statusSchema,
});

export const getAppointmentByDoctorIdOrPatientIdInput = z.object({
  doctorId: z.string().trim().optional(),
  patientId: z.string().trim().optional(),
  appointmentId: z.string().trim().optional(),
});

// Outputs

export const createAppointmentOutput = z.object({
  message: z.string(),
  appointmentId: z.string(),
  date: z.coerce.date(),
  status: z.string(),
});

export const appointmentStatsOutput = z.object({
  appointmentCount: z.number(),
  bookedCount: z.number(),
  cancelledCount: z.number(),
  completedCount: z.number(),
});

export const appointmentListOutput = paginated(appointmentSchema);
export const appointmentsOutput = z.array(appointmentSchema);
export const doctorsOutput = z.array(employeeSchema);
export const doctorOutput = employeeSchema;

export { messageOutput };

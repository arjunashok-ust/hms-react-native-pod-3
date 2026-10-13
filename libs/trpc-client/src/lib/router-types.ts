import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './app-router';

// Type-only: nothing from @trpc/server is bundled into the app.
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Date fields are declared as Date by the schemas but travel as ISO strings (no transformer),
// so always wrap them in new Date(...) before using Date methods.
export type Doctor = RouterOutputs['appointment']['getDoctors'][number];
export type PatientProfile = RouterOutputs['user']['getPatientProfile'];
export type AppointmentItem = RouterOutputs['appointment']['getAppointmentsByPatientId']['data'][number];
export type MedicalRecord = RouterOutputs['medicalRecord']['getMedicalRecords']['data'][number];
export type Specialization = RouterOutputs['ui']['getSpecializations'][number];

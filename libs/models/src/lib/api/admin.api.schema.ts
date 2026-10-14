import { z } from 'zod';
import { DEPARTMENTS, VALIDATION_MESSAGES as V } from './constants';
import { requiredString, dateSchema, optionalNumber, paginationInput, paginated } from './common.schema';
import { employeeSchema, employeeProfileSchema, userAccountSchema, roleSchema } from './entities.schema';

// Inputs

export const employeeIdInput = z.object({ employeeId: requiredString(V.EMPLOYEE_ID_REQUIRED) });

export const getAllUsersInput = paginationInput.extend({
  selectedDepartment: z.enum(DEPARTMENTS, { error: V.DEPARTMENT_INVALID }).optional(),
});

export const getUserEmployeeInput = paginationInput;

// email and role are intentionally not editable here.
export const updateUserProfileInput = z.object({
  employeeId: requiredString(V.EMPLOYEE_ID_REQUIRED),
  data: z.object({
    name: requiredString(V.NAME_REQUIRED).regex(/^[a-zA-Z\s]+$/, V.NAME_INVALID),
    department: z.enum(DEPARTMENTS, { error: V.DEPARTMENT_INVALID }),
    designation: requiredString(V.DESIGNATION_REQUIRED),
    joiningDate: dateSchema(V.JOINING_DATE_REQUIRED),
    medicalRegistrationNo: z.string().trim().optional(),
    specialization: z.string().trim().optional(),
    qualification: z.string().trim().optional(),
    consultationFee: optionalNumber(V.CONSULTATION_FEE_NUMERIC),
    availabilitySlots: z.array(z.string()).optional(),
  }),
});

export const updateRoleInput = z.object({
  roleName: requiredString(V.ROLE_NAME_REQUIRED),
  data: z.object({
    role_permissions: z.array(z.string().regex(/^[a-z]+:[a-z-]+$/, V.PERMISSION_INVALID)),
  }),
});

// Outputs

export const dashboardOutput = z.object({
  employeeCount: z.number(),
  activeCount: z.number(),
  inactiveCount: z.number(),
  verifiedCount: z.number(),
  pendingApprovalCount: z.number(),
  pendingVerifyCount: z.number(),
  pendingFirstLoginCount: z.number(),
  patientCount: z.number(),
  departmentCount: z.number(),
  appointmentCount: z.number(),
});

export const employeeIdMessageOutput = z.object({ message: z.string(), employeeId: z.string() });

export const employeeListOutput = paginated(employeeSchema);
export const employeeProfileListOutput = paginated(employeeProfileSchema);
export const usersOutput = z.array(userAccountSchema);
export const rolesOutput = z.array(roleSchema);
export const roleOutput = roleSchema;

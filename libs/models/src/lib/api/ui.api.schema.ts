import { z } from 'zod';
import { objectIdSchema } from './common.schema';

const roleOptionSchema = z.object({ _id: objectIdSchema, role_name: z.string() });

const departmentOptionSchema = z.object({ _id: objectIdSchema, department_name: z.string() });

const specializationOptionSchema = z.object({
  _id: objectIdSchema,
  specialization_id: z.number().nullish(),
  specialization_name: z.string(),
});

export const rolesOutput = z.array(roleOptionSchema);
export const departmentsOutput = z.array(departmentOptionSchema);
export const specializationsOutput = z.array(specializationOptionSchema);

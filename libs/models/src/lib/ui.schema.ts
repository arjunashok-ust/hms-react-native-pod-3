import { z } from "zod";

export const SpecializationSchema = z.object({
  specialization_id: z.coerce.string().describe('Specialization id'),
  specialization_name: z.string().describe('Specialization name')
});

export type SpecializationModel = z.infer<typeof SpecializationSchema>;

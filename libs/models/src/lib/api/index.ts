// Zod contracts mirrored from hms-backend src/trpc/schemas.
// Shared pieces are exported flat; per-router schemas are namespaced (e.g. authApiSchema.loginInput)
// because several routers reuse the same names (messageOutput, employeeIdInput, doctorsOutput...).

export * from './constants';
export * from './common.schema';
export * from './entities.schema';
export { employeeRoleIssues } from './employee-rules';

export * as authApiSchema from './auth.api.schema';
export * as userApiSchema from './user.api.schema';
export * as adminApiSchema from './admin.api.schema';
export * as appointmentApiSchema from './appointment.api.schema';
export * as medicalRecordApiSchema from './medical-record.api.schema';
export * as nodeApiSchema from './node.api.schema';
export * as uiApiSchema from './ui.api.schema';

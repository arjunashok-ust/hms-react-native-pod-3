import { initTRPC } from '@trpc/server';
import {
  adminApiSchema as admin,
  appointmentApiSchema as appointment,
  authApiSchema as auth,
  medicalRecordApiSchema as medicalRecord,
  nodeApiSchema as node,
  uiApiSchema as ui,
  userApiSchema as user,
} from '@hms/models';

// Contract only: mirrors hms-backend src/trpc/routers (same namespaces, procedures, inputs, outputs).
const t = initTRPC.create();
const contract = () => {
  throw new Error('contract only, never called');
};

export const appRouter = t.router({
  auth: t.router({
    signUp: t.procedure.input(auth.signUpInput).output(auth.signUpOutput).mutation(contract),
    patientSignUp: t.procedure.input(auth.patientSignUpInput).output(auth.signUpOutput).mutation(contract),
    login: t.procedure.input(auth.loginInput).output(auth.loginOutput).mutation(contract),
    refreshToken: t.procedure.output(auth.refreshTokenOutput).mutation(contract),
    logout: t.procedure.output(auth.messageOutput).mutation(contract),
    setPassword: t.procedure.input(auth.setPasswordInput).output(auth.messageOutput).mutation(contract),
    verifyEmail: t.procedure.input(auth.verifyEmailInput).output(auth.messageOutput).mutation(contract),
    getPermissions: t.procedure.input(auth.getPermissionsInput).output(auth.permissionsOutput).query(contract),
    resetPassword: t.procedure.input(auth.resetPasswordInput).output(auth.messageOutput).mutation(contract),
    verifyResetPassword: t.procedure
      .input(auth.verifyResetPasswordInput)
      .output(auth.messageOutput)
      .mutation(contract),
  }),

  user: t.router({
    getUserProfile: t.procedure.input(user.emailInput).output(user.employeeProfileOutput).query(contract),
    getSingleUser: t.procedure.input(user.emailInput).output(user.employeeProfileOutput).query(contract),
    getPatients: t.procedure.input(user.getPatientsInput).output(user.patientListOutput).query(contract),
    deletePatient: t.procedure.input(user.patientIdInput).output(user.messageOutput).mutation(contract),
    getPatientProfile: t.procedure.input(user.emailInput).output(user.patientProfileOutput).query(contract),
    getPatientId: t.procedure.input(user.emailInput).output(user.patientIdOutput).query(contract),
    getAvailableTimeSlots: t.procedure
      .input(user.getAvailableTimeSlotsInput)
      .output(user.availableSlotsOutput)
      .query(contract),
    updatePatientProfile: t.procedure
      .input(user.updatePatientProfileInput)
      .output(user.messageOutput)
      .mutation(contract),
    getPatientsBySearch: t.procedure.input(user.searchInput).output(user.patientsOutput).query(contract),
    getDoctorsBySearch: t.procedure.input(user.searchInput).output(user.doctorsOutput).query(contract),
    getPatientById: t.procedure.input(user.patientIdInput).output(user.patientOutput).query(contract),
    getDoctorById: t.procedure.input(user.doctorIdInput).output(user.doctorOutput).query(contract),
  }),

  admin: t.router({
    getDashboardData: t.procedure.output(admin.dashboardOutput).query(contract),
    getAllUsers: t.procedure.input(admin.getAllUsersInput).output(admin.employeeListOutput).query(contract),
    getUsers: t.procedure.output(admin.usersOutput).query(contract),
    getUserEmployee: t.procedure
      .input(admin.getUserEmployeeInput)
      .output(admin.employeeProfileListOutput)
      .query(contract),
    approveUser: t.procedure.input(admin.employeeIdInput).output(admin.employeeIdMessageOutput).mutation(contract),
    rejectUser: t.procedure.input(admin.employeeIdInput).output(admin.employeeIdMessageOutput).mutation(contract),
    deleteUserProfile: t.procedure
      .input(admin.employeeIdInput)
      .output(admin.employeeIdMessageOutput)
      .mutation(contract),
    updateUserProfile: t.procedure
      .input(admin.updateUserProfileInput)
      .output(auth.messageOutput)
      .mutation(contract),
    getRolesData: t.procedure.output(admin.rolesOutput).query(contract),
    updateRole: t.procedure.input(admin.updateRoleInput).output(admin.roleOutput).mutation(contract),
  }),

  appointment: t.router({
    createAppointment: t.procedure
      .input(appointment.createAppointmentInput)
      .output(appointment.createAppointmentOutput)
      .mutation(contract),
    getAllAppointments: t.procedure
      .input(appointment.getAllAppointmentsInput)
      .output(appointment.appointmentListOutput)
      .query(contract),
    getDoctors: t.procedure.output(appointment.doctorsOutput).query(contract),
    getAppointmentUiData: t.procedure.output(appointment.appointmentStatsOutput).query(contract),
    getAppointmentsByPatientId: t.procedure
      .input(appointment.getAppointmentsByPatientIdInput)
      .output(appointment.appointmentListOutput)
      .query(contract),
    getDoctorByEmployeeId: t.procedure
      .input(appointment.employeeIdInput)
      .output(appointment.doctorOutput)
      .query(contract),
    getAppointmentByDoctorIdOrPatientId: t.procedure
      .input(appointment.getAppointmentByDoctorIdOrPatientIdInput)
      .output(appointment.appointmentsOutput)
      .query(contract),
    editAppointment: t.procedure
      .input(appointment.editAppointmentInput)
      .output(appointment.messageOutput)
      .mutation(contract),
    editAppointmentStatus: t.procedure
      .input(appointment.editAppointmentStatusInput)
      .output(appointment.messageOutput)
      .mutation(contract),
    deleteAppointment: t.procedure
      .input(appointment.appointmentIdInput)
      .output(appointment.messageOutput)
      .mutation(contract),
  }),

  medicalRecord: t.router({
    createMedicalRecord: t.procedure
      .input(medicalRecord.createMedicalRecordInput)
      .output(medicalRecord.createMedicalRecordOutput)
      .mutation(contract),
    updateMedicalRecord: t.procedure
      .input(medicalRecord.updateMedicalRecordInput)
      .output(medicalRecord.messageOutput)
      .mutation(contract),
    getMedicalRecordStats: t.procedure.output(medicalRecord.medicalRecordStatsOutput).query(contract),
    getMedicalRecords: t.procedure
      .input(medicalRecord.getMedicalRecordsInput)
      .output(medicalRecord.getMedicalRecordsOutput)
      .query(contract),
    getMedicalRecordById: t.procedure
      .input(medicalRecord.getMedicalRecordByIdInput)
      .output(medicalRecord.medicalRecordSchema)
      .query(contract),
    deleteMedicalRecord: t.procedure
      .input(medicalRecord.deleteMedicalRecordInput)
      .output(medicalRecord.messageOutput)
      .mutation(contract),
  }),

  node: t.router({
    getNodes: t.procedure.input(node.getNodesInput).output(node.nodesOutput).query(contract),
    createNode: t.procedure.input(node.createNodeInput).output(node.nodeOutput).mutation(contract),
    editNode: t.procedure.input(node.editNodeInput).output(node.nodeOutput).mutation(contract),
    deleteNode: t.procedure.input(node.deleteNodeInput).output(node.messageOutput).mutation(contract),
  }),

  ui: t.router({
    getRoles: t.procedure.output(ui.rolesOutput).query(contract),
    getDepartments: t.procedure.output(ui.departmentsOutput).query(contract),
    getSpecializations: t.procedure.output(ui.specializationsOutput).query(contract),
  }),
});

export type AppRouter = typeof appRouter;

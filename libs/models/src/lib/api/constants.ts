// Mirrors hms-backend src/constants (app, roles, messages). Keep in sync with the backend.

export const USER_STATUS = { ACTIVE: 'Active', INACTIVE: 'Inactive', PENDING: 'Pending' } as const;

export const APPOINTMENT_STATUS = {
  BOOKED: 'Booked',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  PENDING: 'Pending',
} as const;

export const MEDICAL_RECORD_STATUS = { DRAFT: 'Draft', COMPLETED: 'Completed' } as const;

export const DEPARTMENTS = ['OPD', 'IPD', 'ICU', 'Pharmacy', 'Administration', 'Front Office'] as const;
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export const GENDERS = ['Male', 'Female'] as const;

export const PAGINATION = { DEFAULT_PAGE: 1, DEFAULT_LIMIT: 5, MAX_LIMIT: 100 } as const;

export const ROLES = {
  OWNER: 'Owner',
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  RECEPTIONIST: 'Receptionist',
  CASHIER: 'Cashier',
  NURSE: 'Nurse',
  LAB_TECH: 'LabTech',
  PHARMACIST: 'Pharmacist',
  PATIENT: 'Patient',
} as const;

// roles accepted by the employee sign up form
export const SIGNUP_ROLES = [
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.RECEPTIONIST,
  ROLES.CASHIER,
  ROLES.NURSE,
  ROLES.PHARMACIST,
  ROLES.LAB_TECH,
] as const;

// roles that must provide a medical registration number
export const MEDICAL_ROLES: readonly string[] = [ROLES.DOCTOR, ROLES.NURSE, ROLES.PHARMACIST, ROLES.LAB_TECH];

export const VALIDATION_MESSAGES = {
  // generic
  PAGE_INVALID: 'Page must be a positive integer',
  LIMIT_INVALID: 'Limit must be between 1 and 100',
  SEARCH_TEXT_REQUIRED: 'Search text is required',
  DATE_INVALID: 'Invalid date format',

  // identity / credentials
  NAME_REQUIRED: 'Name is required.',
  NAME_INVALID: 'Name must contain only letters and spaces',
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Invalid email format',
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_MIN_LENGTH: 'Password must contain atleast 8 characters.',
  PASSWORD_UPPERCASE: 'Password must contain a uppercase character',
  PASSWORD_DIGIT: 'Password must contain a digit',
  ROLE_REQUIRED: 'Role is required.',
  ROLE_INVALID: 'Invalid role.',
  ROLE_NAME_REQUIRED: 'Role name is required!',
  PERMISSION_INVALID: 'Invalid permission format',
  VERIFICATION_TOKEN_REQUIRED: 'Verification Token Is Required',
  RESET_TOKEN_REQUIRED: 'Reset token is required',

  // employee
  DEPARTMENT_REQUIRED: 'Department is required.',
  DEPARTMENT_INVALID: 'Invalid department.',
  DESIGNATION_REQUIRED: 'Designation is required',
  JOINING_DATE_REQUIRED: 'Joining date is required.',
  EMPLOYEE_ID_REQUIRED: 'Employee Id is Required',
  CONSULTATION_FEE_REQUIRED: 'Consultation fee is required for doctors.',
  CONSULTATION_FEE_NUMERIC: 'Consultation fee must be numeric.',
  CONSULTATION_FEE_DOCTOR_ONLY: 'Consultation fee is only for doctors',
  AVAILABILITY_SLOTS_REQUIRED: 'Availability slots are required for doctors.',
  AVAILABILITY_SLOTS_DOCTOR_ONLY: 'Availability slots are only for doctors.',
  MED_REG_NO_REQUIRED: 'Medical registration no is required for this role',
  SPECIALIZATION_REQUIRED: 'Specialization is required for this role',

  // patient
  PATIENT_ID_REQUIRED: 'Patient Id is Required',
  GENDER_REQUIRED: 'Gender is required',
  GENDER_INVALID: 'Invalid gender',
  PHONE_REQUIRED: 'Phone Number Invalid',
  DOB_REQUIRED: 'DOB is required',
  ADDRESS_REQUIRED: 'Address is required',
  BLOOD_GROUP_REQUIRED: 'Blood group is required',
  BLOOD_GROUP_INVALID: 'Invalid blood group',
  DOCTOR_ID_REQUIRED: 'Doctor Id is Required',

  // appointment
  APPOINTMENT_ID_REQUIRED: 'Appointment Id is Required',
  APPOINTMENT_DATE_REQUIRED: 'Date is Required',
  TIME_SLOT_REQUIRED: 'Time Slot is Required',
  STATUS_REQUIRED: 'Status is required',
  STATUS_INVALID: 'Invalid status',

  // medical record
  MEDICAL_RECORD_ID_REQUIRED: 'Medical Record Id is required.',
  COMPLAINT_REQUIRED: 'complaint is required',
  SYMPTOMS_REQUIRED: 'symptoms are required',
  DIAGNOSIS_REQUIRED: 'diagnosis is required',
  DOCTOR_ID_FIELD_REQUIRED: 'doctorId is required',
  PATIENT_ID_FIELD_REQUIRED: 'patientId is required',
  APPOINTMENT_ID_FIELD_REQUIRED: 'appointmentId is required',

  // node
  NODE_NAME_REQUIRED: 'Node name is required',
  NODE_PATH_REQUIRED: 'Node path is required',
  NODE_ICON_REQUIRED: 'Node icon is required',
  NODE_ORDER_INVALID: 'Node order must be a number',
  NODE_ROLE_REQUIRED: 'At least one role is required',
} as const;

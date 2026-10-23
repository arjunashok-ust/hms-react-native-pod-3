export interface AppointmentFormErrors {
  date: string;
  doctorEmployeeId: string;
  timeSlot: string;
}

export interface AppointmentFormValues {
  date: Date;
  doctorEmployeeId: string;
  timeSlot: string;
}

export const EMPTY_ERRORS: AppointmentFormErrors = {
  date: "",
  doctorEmployeeId: "",
  timeSlot: "",
};

export function validateDate(d: Date): string {
  const input = new Date(d);
  const today = new Date();
  input.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return input <= today
    ? "Appointments cannot be booked for today or past dates."
    : "";
}

export function validateDoctorEmployeeId(id: string): string {
  return id ? "" : "Please select a doctor";
}

export function validateTimeSlot(slot: string): string {
  return slot ? "" : "Time slot is required";
}

export function validateAppointment(
  values: AppointmentFormValues,
): AppointmentFormErrors {
  return {
    date: validateDate(values.date),
    doctorEmployeeId: validateDoctorEmployeeId(values.doctorEmployeeId),
    timeSlot: validateTimeSlot(values.timeSlot),
  };
}

export function hasErrors(errors: AppointmentFormErrors): boolean {
  return Object.values(errors).some((e) => e !== "");
}

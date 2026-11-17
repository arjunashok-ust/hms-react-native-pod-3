import {
  EMPTY_ERRORS,
  hasErrors,
  validateAppointment,
  validateDate,
  validateDoctorEmployeeId,
  validateTimeSlot,
} from "./appointmentFormValidation";

const daysFromToday = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

describe("validateDate", () => {
  const message = "Appointments cannot be booked for today or past dates.";

  it("rejects a past date", () => {
    expect(validateDate(daysFromToday(-1))).toBe(message);
  });

  it("rejects today, whatever the time of day", () => {
    const lateToday = new Date();
    lateToday.setHours(23, 59, 59, 999);
    expect(validateDate(lateToday)).toBe(message);
  });

  it("accepts tomorrow", () => {
    expect(validateDate(daysFromToday(1))).toBe("");
  });

  it("accepts a date far in the future", () => {
    expect(validateDate(daysFromToday(365))).toBe("");
  });
});

describe("validateDoctorEmployeeId", () => {
  it("requires a doctor", () => {
    expect(validateDoctorEmployeeId("")).toBe("Please select a doctor");
  });

  it("accepts a selected doctor", () => {
    expect(validateDoctorEmployeeId("EMP-1")).toBe("");
  });
});

describe("validateTimeSlot", () => {
  it("requires a slot", () => {
    expect(validateTimeSlot("")).toBe("Time slot is required");
  });

  it("accepts a chosen slot", () => {
    expect(validateTimeSlot("09:00")).toBe("");
  });
});

describe("validateAppointment", () => {
  it("returns no errors for a complete, future booking", () => {
    expect(
      validateAppointment({
        date: daysFromToday(2),
        doctorEmployeeId: "EMP-1",
        timeSlot: "09:00",
      }),
    ).toEqual(EMPTY_ERRORS);
  });

  it("reports every invalid field at once", () => {
    const errors = validateAppointment({
      date: daysFromToday(-3),
      doctorEmployeeId: "",
      timeSlot: "",
    });
    expect(errors.date).not.toBe("");
    expect(errors.doctorEmployeeId).toBe("Please select a doctor");
    expect(errors.timeSlot).toBe("Time slot is required");
  });

  it("reports only the failing field", () => {
    const errors = validateAppointment({
      date: daysFromToday(2),
      doctorEmployeeId: "EMP-1",
      timeSlot: "",
    });
    expect(errors).toEqual({ ...EMPTY_ERRORS, timeSlot: "Time slot is required" });
  });
});

describe("hasErrors", () => {
  it("is false when every field is empty", () => {
    expect(hasErrors(EMPTY_ERRORS)).toBe(false);
  });

  it("is true when any field has an error", () => {
    expect(hasErrors({ ...EMPTY_ERRORS, date: "x" })).toBe(true);
    expect(hasErrors({ ...EMPTY_ERRORS, doctorEmployeeId: "x" })).toBe(true);
    expect(hasErrors({ ...EMPTY_ERRORS, timeSlot: "x" })).toBe(true);
  });
});

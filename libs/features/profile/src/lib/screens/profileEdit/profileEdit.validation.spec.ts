import {
  EMPTY_ERRORS,
  hasErrors,
  ProfileFormValues,
  validateProfile,
} from "./profileEdit.validation";

const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

const VALID: ProfileFormValues = {
  name: "John Doe",
  gender: "Male",
  dob: new Date(1990, 0, 15),
  email: "john@example.com",
  address: "12 Main St",
  phone: "9876543210",
  emergencyContact: "9123456780",
};

describe("validateProfile", () => {
  it("returns no errors for a valid profile", () => {
    expect(validateProfile(VALID)).toEqual(EMPTY_ERRORS);
  });

  it("flags an empty name and a name with digits", () => {
    expect(validateProfile({ ...VALID, name: "" }).name).toBe("Name is required.");
    expect(validateProfile({ ...VALID, name: "J0hn" }).name).toBe(
      "Only characters are allowed.",
    );
  });

  it("requires a gender", () => {
    expect(validateProfile({ ...VALID, gender: "" }).gender).toBe(
      "Gender is required.",
    );
  });

  it("requires a date of birth that is not today or in the future", () => {
    expect(validateProfile({ ...VALID, dob: new Date() }).dob).toBe(
      "DOB is required.",
    );
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(validateProfile({ ...VALID, dob: tomorrow }).dob).toBe(
      "Future dates are not allowed.",
    );
    expect(validateProfile({ ...VALID, dob: yesterday() }).dob).toBe("");
  });

  it("validates the email", () => {
    expect(validateProfile({ ...VALID, email: "" }).email).toBe("Email is required.");
    expect(validateProfile({ ...VALID, email: "nope" }).email).toBe(
      "Email is invalid.",
    );
  });

  it("validates the address", () => {
    expect(validateProfile({ ...VALID, address: "" }).address).toBe(
      "Address is required.",
    );
    expect(validateProfile({ ...VALID, address: "bad@@" }).address).toBe(
      "Address field is invalid.",
    );
  });

  it("validates the primary phone", () => {
    expect(validateProfile({ ...VALID, phone: "" }).phone).toBe("Phone is required.");
    expect(validateProfile({ ...VALID, phone: "123" }).phone).toBe(
      "Invalid phone format.",
    );
  });

  it("treats the emergency contact as optional but checks format and uniqueness", () => {
    expect(validateProfile({ ...VALID, emergencyContact: "" }).emergencyContact).toBe("");
    expect(validateProfile({ ...VALID, emergencyContact: "123" }).emergencyContact).toBe(
      "Invalid phone format.",
    );
    expect(
      validateProfile({ ...VALID, emergencyContact: VALID.phone }).emergencyContact,
    ).toBe(
      "Emergency contact must be different from the primary contact number.",
    );
  });

  it("reports every invalid field at once", () => {
    const errors = validateProfile({
      name: "",
      gender: "",
      dob: new Date(),
      email: "",
      address: "",
      phone: "",
      emergencyContact: "",
    });
    expect(Object.values(errors).filter(Boolean)).toHaveLength(6);
  });
});

describe("hasErrors", () => {
  it("is false for empty errors and true when any field has one", () => {
    expect(hasErrors(EMPTY_ERRORS)).toBe(false);
    expect(hasErrors({ ...EMPTY_ERRORS, phone: "x" })).toBe(true);
  });
});

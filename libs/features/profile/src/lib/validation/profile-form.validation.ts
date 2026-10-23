import {
  validateAddress,
  validateDob,
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
} from "@hms/shared-util";

export interface ProfileFormValues {
  name: string;
  gender: string;
  dob: Date;
  email: string;
  address: string;
  phone: string;
  emergencyContact: string;
}

export type ProfileFormErrors = Record<keyof ProfileFormValues, string>;

export const EMPTY_ERRORS: ProfileFormErrors = {
  name: "",
  gender: "",
  dob: "",
  email: "",
  address: "",
  phone: "",
  emergencyContact: "",
};

export function validateProfile(values: ProfileFormValues): ProfileFormErrors {
  return {
    name: validateName(values.name),
    gender: validateRequired(values.gender, "Gender"),
    dob: validateDob(values.dob),
    email: validateEmail(values.email),
    address: validateAddress(values.address),
    phone: validatePhone(values.phone),
    emergencyContact: validatePhone(values.emergencyContact, values.phone),
  };
}

export function hasErrors(errors: ProfileFormErrors): boolean {
  return Object.values(errors).some((e) => e !== "");
}

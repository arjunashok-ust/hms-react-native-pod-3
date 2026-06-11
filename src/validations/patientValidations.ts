import * as Yup from "yup";

const nameRegex = /^[A-Za-z\s.\-']+$/;
const stateRegex = /^[A-Za-z\s]+$/;
const indianPhoneRegex = /^(?:\+91)?\s*[6-9]\d{9}$/;

export const getPatientValidationSchema = (isEditMode: boolean) => {
    const baseSchema = {
        name: Yup.string()
            .trim()
            .required("Full name is required")
            .min(2, "Name must be at least 2 characters long")
            .max(50, "Name cannot exceed 50 characters")
            .matches(nameRegex, "Name can only contain alphabets, spaces, dots, hyphens, and apostrophes"),

        email: Yup.string()
            .trim()
            .lowercase()
            .email("Please enter a valid email address")
            .required("Email is required"),

        phone: Yup.string()
            .required("Phone number is required")
            .matches(indianPhoneRegex, "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"),

        gender: Yup.string()
            .oneOf(["Male", "Female", "Other"], "Please select a valid gender option")
            .required("Gender is required"),

        dob: Yup.date()
            .required("Date of Birth is required")
            .min(new Date("1926-01-01"), "Date of Birth cannot be earlier than 1926")
            .max(new Date(), "Date of Birth cannot be in the future"),

        bloodGroup: Yup.string().oneOf(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], "Invalid Blood Group").optional().nullable(),
        allergies: Yup.string().trim().max(200, "Allergies descriptions cannot exceed 200 characters").optional().nullable(),
        emergencyContact: Yup.string()
            .trim()
            .optional()
            .nullable()
            .transform((value) => (value === "" ? null : value))
            .test("is-valid-emergency", "Enter a valid 10-digit emergency number starting with 6-9", (value) => !value || indianPhoneRegex.test(value)),

        line1: Yup.string().trim().required("Address Line 1 is required").min(5, "Address must be descriptive (min 5 characters)"),
        line2: Yup.string().trim().optional().nullable(),
        state: Yup.string().trim().required("State is required").matches(stateRegex, "State field cannot contain numbers or special characters"),
        pincode: Yup.string().trim().matches(/^\d{6}$/, "Pincode must be exactly 6 numeric digits").required("Pincode is required"),
    };

    if (!isEditMode) {
        Object.assign(baseSchema, {
            password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters long")
                .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                .matches(/[a-z]/, "Password must contain at least one lowercase letter")
                .matches(/\d/, "Password must contain at least one digit")
                .matches(/[\W_]/, "Password must contain at least one special character"),
            confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Please confirm your password"),
        });
    }

    return Yup.object().shape(baseSchema);
};
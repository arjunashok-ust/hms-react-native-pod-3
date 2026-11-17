import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import { renderWithProviders } from "../../../test-utils/testProviders";
import { PICKED_DOB } from "../../../test-utils/sharedUiMock";
import SignUpContent from "./signupContent";

const mockMutateAsync = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@hms/shared-ui", () => require("../../../test-utils/sharedUiMock"));
jest.mock("@hms/trpc-client", () => ({
  trpc: {
    auth: {
      patientSignUp: { useMutation: () => ({ mutateAsync: mockMutateAsync }) },
    },
  },
}));
jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const id = (suffix: string) => `authentication.signup.${suffix}`;
const byId = (suffix: string) => screen.getByTestId(id(suffix));
const queryById = (suffix: string) => screen.queryByTestId(id(suffix));

type Form = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: string;
  pickDob: boolean;
};

const VALID: Form = {
  name: "John Doe",
  email: "john@example.com",
  password: "Secret123",
  confirmPassword: "Secret123",
  phone: "9876543210",
  gender: "Male",
  address: "12 Main St",
  bloodGroup: "O+",
  allergies: "Peanuts",
  emergencyContact: "9123456780",
  pickDob: true,
};

const TEXT_FIELDS = [
  "name",
  "email",
  "password",
  "confirmPassword",
  "phone",
  "address",
  "allergies",
  "emergencyContact",
] as const;

// Fills the form from VALID with overrides applied, then presses submit.
const fillAndSubmit = (overrides: Partial<Form> = {}) => {
  const form = { ...VALID, ...overrides };
  TEXT_FIELDS.forEach((field) => {
    if (form[field]) fireEvent.changeText(byId(field), form[field]);
  });
  if (form.gender) fireEvent(byId("gender"), "valueChange", form.gender);
  if (form.bloodGroup)
    fireEvent(byId("bloodGroup"), "valueChange", form.bloodGroup);
  if (form.pickDob) fireEvent.press(screen.getByTestId("dob-picker"));
  fireEvent.press(byId("submit"));
};

const ERROR_FIELDS = [
  "name",
  "email",
  "password",
  "confirmPassword",
  "phone",
  "gender",
  "address",
  "bloodGroup",
  "dob",
] as const;

describe("signup screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockResolvedValue(undefined);
    renderWithProviders(<SignUpContent />);
  });

  describe("rendering", () => {
    it("renders the screen, every input, both pickers and the submit button", () => {
      expect(byId("screen")).toBeTruthy();
      [...TEXT_FIELDS, "gender", "bloodGroup", "dob", "submit"].forEach((s) =>
        expect(byId(s)).toBeTruthy(),
      );
    });

    it("shows no errors before the user submits", () => {
      [...ERROR_FIELDS, "emergencyContact"].forEach((f) =>
        expect(queryById(`${f}Error`)).toBeNull(),
      );
    });
  });

  describe("validation", () => {
    it("shows an error for every required field when the form is empty", () => {
      fillAndSubmit({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
        address: "",
        bloodGroup: "",
        allergies: "",
        emergencyContact: "",
        pickDob: false,
      });

      expect(byId("nameError")).toHaveTextContent("Name is required.");
      expect(byId("emailError")).toHaveTextContent("Email is required.");
      expect(byId("passwordError")).toHaveTextContent("Password is required.");
      expect(byId("confirmPasswordError")).toHaveTextContent(
        "Confirm Password is required.",
      );
      expect(byId("phoneError")).toHaveTextContent("Phone is required.");
      expect(byId("genderError")).toHaveTextContent("Gender is required.");
      expect(byId("addressError")).toHaveTextContent("Address is required.");
      expect(byId("bloodGroupError")).toHaveTextContent(
        "Blood group is required.",
      );
      expect(byId("dobError")).toHaveTextContent("DOB is required.");
      expect(queryById("emergencyContactError")).toBeNull();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" }),
      );
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("rejects a name with digits or symbols", () => {
      fillAndSubmit({ name: "John123" });
      expect(byId("nameError")).toHaveTextContent("Only characters are allowed.");
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("rejects a malformed email", () => {
      fillAndSubmit({ email: "not-an-email" });
      expect(byId("emailError")).toHaveTextContent("Email is invalid.");
    });

    it("rejects a password shorter than 8 characters", () => {
      fillAndSubmit({ password: "Ab1", confirmPassword: "Ab1" });
      expect(byId("passwordError")).toHaveTextContent(
        "Minimum 8 characters are required.",
      );
    });

    it("rejects a password without a digit and a capital letter", () => {
      fillAndSubmit({ password: "alllowercase", confirmPassword: "alllowercase" });
      expect(byId("passwordError")).toHaveTextContent(
        "At least one digit and one capital letter is required.",
      );
    });

    it("rejects a confirm password that does not match", () => {
      fillAndSubmit({ confirmPassword: "Different123" });
      expect(byId("confirmPasswordError")).toHaveTextContent(
        "Passwords don't match.",
      );
      expect(queryById("passwordError")).toBeNull();
    });

    it("rejects an invalid phone number", () => {
      fillAndSubmit({ phone: "12345" });
      expect(byId("phoneError")).toHaveTextContent("Invalid phone format.");
    });

    it("rejects an emergency contact equal to the primary phone", () => {
      fillAndSubmit({ emergencyContact: VALID.phone });
      expect(byId("emergencyContactError")).toHaveTextContent(
        "Emergency contact must be different from the primary contact number.",
      );
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("rejects an emergency contact with an invalid format", () => {
      fillAndSubmit({ emergencyContact: "12345" });
      expect(byId("emergencyContactError")).toHaveTextContent(
        "Invalid phone format.",
      );
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("rejects a submit when no date of birth was chosen", () => {
      fillAndSubmit({ pickDob: false });
      expect(byId("dobError")).toHaveTextContent("DOB is required.");
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("clears errors on a later valid submit", async () => {
      fillAndSubmit({ email: "bad" });
      expect(byId("emailError")).toBeTruthy();

      fireEvent.changeText(byId("email"), VALID.email);
      fireEvent.press(byId("submit"));

      await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
      expect(queryById("emailError")).toBeNull();
    });

    it("treats the emergency contact and allergies as optional", async () => {
      fillAndSubmit({ emergencyContact: "", allergies: "" });
      await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
      expect(queryById("emergencyContactError")).toBeNull();
    });
  });

  describe("submission", () => {
    it("sends the typed values, toasts success and navigates to login", async () => {
      fillAndSubmit();

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("login"));
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: VALID.name,
        email: VALID.email,
        status: "Active",
        password: VALID.password,
        phone: VALID.phone,
        gender: "Male",
        address: VALID.address,
        bloodGroup: "O+",
        allergies: VALID.allergies,
        dob: PICKED_DOB,
        emergencyContact: VALID.emergencyContact,
      });
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" }),
      );
    });

    it("stays on the screen and does not toast success when the API rejects", async () => {
      mockMutateAsync.mockRejectedValue(new Error("email already used"));
      fillAndSubmit();

      await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(Toast.show).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" }),
      );
      expect(await screen.findByText("Signup")).toBeTruthy();
    });

    it("shows the loading label while the request is in flight", async () => {
      let resolveSignUp: () => void = () => {};
      mockMutateAsync.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveSignUp = resolve;
        }),
      );
      fillAndSubmit();

      expect(await screen.findByText("Signing In...")).toBeTruthy();

      await act(async () => {
        resolveSignUp();
      });
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("login"));
    });
  });

  describe("navigation", () => {
    it("navigates to login from the footer link", () => {
      fireEvent.press(byId("loginLink"));
      expect(mockNavigate).toHaveBeenCalledWith("login");
    });
  });
});

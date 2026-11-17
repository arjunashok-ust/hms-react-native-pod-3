import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import {
  createNavigation,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import ProfileEditContent from "./profileEditContent";

let mockProfile: unknown;
let mockIsPending = false;
let mockMutationOutcome: "success" | "error" = "success";
const mockMutate = jest.fn();
const mockInvalidate = jest.fn().mockResolvedValue(undefined);

jest.mock("@hms/trpc-client", () => ({
  trpc: {
    useUtils: () => ({
      user: { getPatientProfile: { invalidate: mockInvalidate } },
    }),
    user: {
      getPatientProfile: { useQuery: () => ({ data: mockProfile }) },
      updatePatientProfile: {
        useMutation: (options: { onSuccess?: () => Promise<void> }) => ({
          mutate: (variables: unknown) => {
            mockMutate(variables);
            if (mockMutationOutcome === "success") void options.onSuccess?.();
          },
          isPending: mockIsPending,
        }),
      },
    },
  },
}));
jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

// The date the shared-ui stub's DatePicker returns when pressed.
const PICKED_DOB = new Date(1990, 0, 15);

const id = (suffix: string) => `profile.profileEdit.${suffix}`;
const byId = (suffix: string) => screen.getByTestId(id(suffix));
const queryById = (suffix: string) => screen.queryByTestId(id(suffix));

const PROFILE = {
  uhid: "UH-1001",
  name: "John Doe",
  gender: "Male",
  dob: "1990-01-15T12:00:00",
  phone: "9876543210",
  email: "john@example.com",
  address: "12 Main St",
  emergencyContact: "9123456780",
};

const renderEdit = () => {
  const navigation = createNavigation();
  renderWithProviders(<ProfileEditContent navigation={navigation} />);
  return navigation;
};

describe("profile edit screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfile = PROFILE;
    mockIsPending = false;
    mockMutationOutcome = "success";
  });

  describe("rendering", () => {
    it("renders the screen, every field and the action buttons", () => {
      renderEdit();
      [
        "screen",
        "goBack",
        "name",
        "gender",
        "dob",
        "email",
        "address",
        "phone",
        "emergencyContact",
        "updateProfile",
        "cancel",
      ].forEach((suffix) => expect(byId(suffix)).toBeTruthy());
    });

    it("shows no errors before the user submits", () => {
      renderEdit();
      [
        "name",
        "gender",
        "dob",
        "email",
        "address",
        "phone",
        "emergencyContact",
      ].forEach((f) => expect(queryById(`${f}Error`)).toBeNull());
    });

    it("seeds the form from the loaded profile", () => {
      renderEdit();
      expect(byId("email").props.value).toBe("john@example.com");
      expect(byId("address").props.value).toBe("12 Main St");
      expect(byId("phone").props.value).toBe("9876543210");
      expect(byId("emergencyContact").props.value).toBe("9123456780");
    });

    it("seeds the name field from the loaded profile", () => {
      renderEdit();
      expect(byId("name").props.value).toBe("John Doe");
    });

    it("keeps email and phone read-only", () => {
      renderEdit();
      expect(byId("email").props.editable).toBe(false);
      expect(byId("phone").props.editable).toBe(false);
      expect(byId("name").props.editable).toBe(true);
      expect(byId("address").props.editable).toBe(true);
      expect(byId("emergencyContact").props.editable).toBe(true);
    });

    it("shows the update label, and the loading label while saving", () => {
      renderEdit();
      expect(screen.getByText("UPDATE PROFILE")).toBeTruthy();
    });

    it("shows the loading label while the update is in flight", () => {
      mockIsPending = true;
      renderEdit();
      expect(screen.getByText("UPDATING...")).toBeTruthy();
      expect(screen.queryByText("UPDATE PROFILE")).toBeNull();
    });
  });

  describe("validation", () => {
    it("rejects an empty name", () => {
      renderEdit();
      fireEvent.changeText(byId("name"), "");
      fireEvent.press(byId("updateProfile"));
      expect(byId("nameError")).toHaveTextContent("Name is required.");
      expect(mockMutate).not.toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" }),
      );
    });

    it("rejects a name with digits", () => {
      renderEdit();
      fireEvent.changeText(byId("name"), "John123");
      fireEvent.press(byId("updateProfile"));
      expect(byId("nameError")).toHaveTextContent("Only characters are allowed.");
    });

    it("rejects an empty address", () => {
      renderEdit();
      fireEvent.changeText(byId("address"), "");
      fireEvent.press(byId("updateProfile"));
      expect(byId("addressError")).toHaveTextContent("Address is required.");
    });

    it("rejects an address with invalid characters", () => {
      renderEdit();
      fireEvent.changeText(byId("address"), "12 Main St @@");
      fireEvent.press(byId("updateProfile"));
      expect(byId("addressError")).toHaveTextContent("Address field is invalid.");
    });

    it("rejects a cleared gender", () => {
      renderEdit();
      fireEvent(byId("gender"), "valueChange", "");
      fireEvent.press(byId("updateProfile"));
      expect(byId("genderError")).toHaveTextContent("Gender is required.");
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("rejects an emergency contact with an invalid format", () => {
      renderEdit();
      fireEvent.changeText(byId("emergencyContact"), "12345");
      fireEvent.press(byId("updateProfile"));
      expect(byId("emergencyContactError")).toHaveTextContent(
        "Invalid phone format.",
      );
    });

    it("rejects an emergency contact equal to the primary phone", () => {
      renderEdit();
      fireEvent.changeText(byId("emergencyContact"), "9876543210");
      fireEvent.press(byId("updateProfile"));
      expect(byId("emergencyContactError")).toHaveTextContent(
        "Emergency contact must be different from the primary contact number.",
      );
    });

    it("accepts an empty emergency contact", () => {
      renderEdit();
      fireEvent.changeText(byId("emergencyContact"), "");
      fireEvent.press(byId("updateProfile"));
      expect(queryById("emergencyContactError")).toBeNull();
      expect(mockMutate).toHaveBeenCalled();
    });

    it("asks for a date of birth when the profile has none", () => {
      mockProfile = { ...PROFILE, dob: null };
      renderEdit();
      fireEvent.press(byId("updateProfile"));
      expect(byId("dobError")).toHaveTextContent("DOB is required.");
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("accepts a date of birth chosen in the picker", () => {
      mockProfile = { ...PROFILE, dob: null };
      renderEdit();
      fireEvent.press(screen.getByTestId("date-picker"));
      fireEvent.press(byId("updateProfile"));
      expect(queryById("dobError")).toBeNull();
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({ dob: PICKED_DOB }),
      );
    });

    it("clears errors once the form is valid", () => {
      renderEdit();
      fireEvent.changeText(byId("name"), "");
      fireEvent.press(byId("updateProfile"));
      expect(byId("nameError")).toBeTruthy();

      fireEvent.changeText(byId("name"), "Jane Doe");
      fireEvent.press(byId("updateProfile"));
      expect(queryById("nameError")).toBeNull();
    });

    it("blocks submit and shows errors while the profile has not loaded", () => {
      mockProfile = undefined;
      renderEdit();
      fireEvent.press(byId("updateProfile"));
      expect(byId("nameError")).toBeTruthy();
      expect(byId("addressError")).toBeTruthy();
      expect(byId("genderError")).toBeTruthy();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("submission", () => {
    it("sends the edited values with the patient's UHID", () => {
      renderEdit();
      fireEvent.changeText(byId("name"), "Jane Doe");
      fireEvent.changeText(byId("address"), "99 Park Ave");
      fireEvent.changeText(byId("emergencyContact"), "9000000001");
      fireEvent(byId("gender"), "valueChange", "Female");
      fireEvent.press(byId("updateProfile"));

      expect(mockMutate).toHaveBeenCalledWith({
        patientId: "UH-1001",
        name: "Jane Doe",
        gender: "Female",
        dob: new Date("1990-01-15T12:00:00"),
        address: "99 Park Ave",
        emergencyContact: "9000000001",
      });
    });

    it("keeps the seeded gender and date of birth when they are not edited", () => {
      renderEdit();
      fireEvent.press(byId("updateProfile"));
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          gender: "Male",
          dob: new Date("1990-01-15T12:00:00"),
        }),
      );
    });

    it("refreshes the profile, toasts success and returns to the profile view", async () => {
      const navigation = renderEdit();
      fireEvent.press(byId("updateProfile"));

      await waitFor(() =>
        expect(navigation.navigate).toHaveBeenCalledWith("profileView"),
      );
      expect(mockInvalidate).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" }),
      );
    });

    it("stays on the screen and does not toast success when the update fails", async () => {
      mockMutationOutcome = "error";
      const navigation = renderEdit();
      fireEvent.press(byId("updateProfile"));

      await act(async () => {});
      expect(mockMutate).toHaveBeenCalled();
      expect(navigation.navigate).not.toHaveBeenCalled();
      expect(mockInvalidate).not.toHaveBeenCalled();
      expect(Toast.show).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" }),
      );
    });
  });

  describe("navigation", () => {
    it("goes back to the profile view from the go-back button", () => {
      const navigation = renderEdit();
      fireEvent.press(byId("goBack"));
      expect(navigation.navigate).toHaveBeenCalledWith("profileView");
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("goes back to the profile view from cancel without saving", () => {
      const navigation = renderEdit();
      fireEvent.changeText(byId("name"), "Changed");
      fireEvent.press(byId("cancel"));
      expect(navigation.navigate).toHaveBeenCalledWith("profileView");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});

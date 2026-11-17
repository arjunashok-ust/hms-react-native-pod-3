import Toast from "react-native-toast-message";
import {
  act,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import {
  createHost,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import { AppointmentFormContent } from "./appointmentFormContent";

const mockCreateMutate = jest.fn();
const mockSlotsInvalidate = jest.fn().mockResolvedValue(undefined);
const mockSlotsQuery = jest.fn();
let mockCreateOptions: { onSuccess?: (r: { message: string }) => unknown } = {};
let mockCreatePending = false;
let mockSlots: string[] = [];

jest.mock("@hms/trpc-client", () => ({
  trpc: {
    useUtils: () => ({
      user: { getAvailableTimeSlots: { invalidate: mockSlotsInvalidate } },
    }),
    appointment: {
      getDoctors: {
        useQuery: () => ({
          data: [
            { employeeCode: "D1", name: "Asha Rao", specialization: "Cardiology" },
            { employeeCode: "D2", name: "Ben Carter", specialization: "Neurology" },
          ],
        }),
      },
      createAppointment: {
        useMutation: (options: typeof mockCreateOptions) => {
          mockCreateOptions = options;
          return { mutate: mockCreateMutate, isPending: mockCreatePending };
        },
      },
    },
    user: {
      getAvailableTimeSlots: {
        useQuery: (input: unknown, options: { enabled?: boolean }) => {
          mockSlotsQuery(input, options);
          return { data: options?.enabled ? { slots: mockSlots } : undefined };
        },
      },
    },
  },
}));
jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

const id = (suffix: string) => `appointments.appointmentForm.${suffix}`;
const body = (suffix: string) => `appointments.appointmentFormBody.${suffix}`;
const holder = (suffix: string) => `appointments.doctorHolder.${suffix}`;
const slotId = (slot: string) => `appointments.timeSlot.slot.${slot}`;

// The Picker's own props (not the native host element's) carry `selectedValue`.
const selectedDoctor = () =>
  screen.UNSAFE_getAllByProps({ testID: holder("doctor") })[0].props
    .selectedValue;

const navigation = {
  navigate: jest.fn(),
  popToTop: jest.fn(),
  getState: jest.fn(),
};

const renderForm = (
  props: { initialDoctorId?: string } = {},
  host = createHost(),
) =>
  renderWithProviders(
    <AppointmentFormContent navigation={navigation as never} {...props} />,
    host,
  );

describe("appointment form screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreatePending = false;
    mockSlots = ["09:00", "10:00"];
    navigation.getState.mockReturnValue({ routes: [{ name: "appointmentForm" }] });
  });

  describe("initial state", () => {
    it("renders the screen, header, patient id, date field and footer button", () => {
      renderForm();
      expect(screen.getByTestId(id("screen"))).toBeTruthy();
      expect(screen.getByText("Book Appointment")).toBeTruthy();
      expect(screen.getByTestId(body("patientId"))).toBeTruthy();
      expect(screen.getByTestId(body("date"))).toBeTruthy();
      expect(screen.getByTestId(id("viewAppointments"))).toBeTruthy();
    });

    it("shows the host's patient id in the disabled field", () => {
      renderForm();
      expect(screen.getByTestId(body("patientId")).props.value).toBe("patient-1");
      expect(screen.getByTestId(body("patientId")).props.editable).toBe(false);
    });

    it("hides the doctor, slot and action sections until a date is chosen", () => {
      renderForm();
      expect(screen.queryByTestId(holder("doctor"))).toBeNull();
      expect(screen.queryByTestId(body("primary"))).toBeNull();
      expect(screen.queryByTestId(body("secondary"))).toBeNull();
    });

    it("does not look up time slots before a date and doctor are chosen", () => {
      renderForm();
      expect(mockSlotsQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ enabled: false }),
      );
    });

    it("renders with an empty patient id while the host is still loading", () => {
      renderForm({}, createHost({ patientId: null }));
      expect(screen.getByTestId(body("patientId")).props.value).toBe("");
    });
  });

  describe("choosing a date", () => {
    it("rejects a past date and keeps the rest of the form hidden", () => {
      renderForm();
      fireEvent.press(screen.getByTestId("date-picker"));
      expect(screen.getByTestId(body("dateError"))).toHaveTextContent(
        "Appointments cannot be booked for today or past dates.",
      );
      expect(screen.queryByTestId(holder("doctor"))).toBeNull();
    });
  });

  describe("launched from a doctor on the home screen", () => {
    it("reveals the form with that doctor preselected", async () => {
      renderForm({ initialDoctorId: "D1" });
      expect(await screen.findByTestId(holder("doctor"))).toBeTruthy();
      expect(selectedDoctor()).toBe("D1");
      expect(screen.getByTestId(body("primary"))).toBeTruthy();
      expect(screen.getByTestId(body("secondary"))).toBeTruthy();
    });

    it("asks for that doctor's slots on a future date", async () => {
      renderForm({ initialDoctorId: "D1" });
      await screen.findByTestId(holder("doctor"));
      const [input, options] = mockSlotsQuery.mock.calls.at(-1);
      expect(input.employeeId).toBe("D1");
      expect(input.date.getTime()).toBeGreaterThan(Date.now());
      expect(options.enabled).toBe(true);
    });

    it("lists the available slots", async () => {
      renderForm({ initialDoctorId: "D1" });
      expect(await screen.findByTestId(slotId("09:00"))).toBeTruthy();
      expect(screen.getByTestId(slotId("10:00"))).toBeTruthy();
    });

    it("tells the user when no slot is available", async () => {
      mockSlots = [];
      renderForm({ initialDoctorId: "D1" });
      expect(
        await screen.findByTestId("appointments.timeSlot.noSlots"),
      ).toHaveTextContent("No slot available at this moment");
    });

    it("asks for the new doctor's slots when the doctor changes", async () => {
      renderForm({ initialDoctorId: "D1" });
      fireEvent(await screen.findByTestId(holder("doctor")), "valueChange", "D2");
      expect(mockSlotsQuery.mock.calls.at(-1)[0].employeeId).toBe("D2");
    });
  });

  describe("validation", () => {
    it("reports a missing time slot and toasts the failure", async () => {
      renderForm({ initialDoctorId: "D1" });
      await screen.findByTestId(body("primary"));
      fireEvent.press(screen.getByTestId(body("primary")));

      expect(screen.getByTestId(body("timeSlotError"))).toHaveTextContent(
        "Time slot is required",
      );
      expect(screen.queryByTestId(body("doctorError"))).toBeNull();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error", text1: "Validation Failed" }),
      );
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    it("reports a missing doctor and a missing slot together", async () => {
      renderForm({ initialDoctorId: "D1" });
      fireEvent(await screen.findByTestId(holder("doctor")), "valueChange", "");
      fireEvent.press(screen.getByTestId(body("primary")));

      expect(screen.getByTestId(body("doctorError"))).toHaveTextContent(
        "Please select a doctor",
      );
      expect(screen.getByTestId(body("timeSlotError"))).toBeTruthy();
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });
  });

  describe("booking", () => {
    const pickSlotAndSubmit = async (slot = "09:00") => {
      renderForm({ initialDoctorId: "D1" });
      fireEvent.press(await screen.findByTestId(slotId(slot)));
      fireEvent.press(screen.getByTestId(body("primary")));
    };

    it("creates a pending appointment with the chosen doctor, slot and date", async () => {
      await pickSlotAndSubmit("10:00");
      expect(mockCreateMutate).toHaveBeenCalledWith({
        patientId: "patient-1",
        doctorEmployeeId: "D1",
        timeSlot: "10:00",
        date: expect.any(Date),
        status: "Pending",
      });
      expect(Toast.show).not.toHaveBeenCalled();
    });

    it("sends no validation errors when the booking is valid", async () => {
      await pickSlotAndSubmit();
      expect(screen.queryByTestId(body("timeSlotError"))).toBeNull();
      expect(screen.queryByTestId(body("doctorError"))).toBeNull();
    });

    it("shows the 'CREATE' label normally and 'CREATING...' while pending", async () => {
      renderForm({ initialDoctorId: "D1" });
      await screen.findByTestId(body("primary"));
      expect(screen.getByText("CREATE")).toBeTruthy();
    });

    it("shows the pending label while the booking is being created", async () => {
      mockCreatePending = true;
      renderForm({ initialDoctorId: "D1" });
      await screen.findByTestId(body("primary"));
      expect(screen.getByText("CREATING...")).toBeTruthy();
    });

    it("toasts success, refreshes slots and clears the form once booked", async () => {
      await pickSlotAndSubmit();
      await act(async () => {
        await mockCreateOptions.onSuccess?.({ message: "Booked!" });
      });

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Success",
        text2: "Booked!",
      });
      expect(mockSlotsInvalidate).toHaveBeenCalled();
      await waitFor(() =>
        expect(screen.queryByTestId(holder("doctor"))).toBeNull(),
      );
    });
  });

  describe("clearing the form", () => {
    it("resets the form back to the date field", async () => {
      renderForm({ initialDoctorId: "D1" });
      fireEvent.press(await screen.findByTestId(slotId("09:00")));
      fireEvent.press(screen.getByTestId(body("secondary")));

      expect(screen.queryByTestId(holder("doctor"))).toBeNull();
      expect(screen.queryByTestId(body("primary"))).toBeNull();
      expect(screen.getByTestId(body("date"))).toBeTruthy();
    });
  });

  describe("navigation", () => {
    it("opens the appointment list from the footer button", () => {
      renderForm();
      fireEvent.press(screen.getByTestId(id("viewAppointments")));
      expect(navigation.navigate).toHaveBeenCalledWith("appointmentList");
    });

    it("drops screens stacked above the form when it mounts", () => {
      navigation.getState.mockReturnValue({
        routes: [{ name: "appointmentForm" }, { name: "appointmentList" }],
      });
      renderForm();
      expect(navigation.popToTop).toHaveBeenCalledTimes(1);
    });

    it("leaves the stack alone when the form is the only screen", () => {
      renderForm();
      expect(navigation.popToTop).not.toHaveBeenCalled();
    });
  });
});

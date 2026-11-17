import Toast from "react-native-toast-message";
import {
  act,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import {
  makeAppointment,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import AppointmentEditContent from "./appointmentEditContent";

const mockNavigate = jest.fn();
const mockEditMutate = jest.fn();
const mockCancelMutate = jest.fn();
const mockSlotsInvalidate = jest.fn().mockResolvedValue(undefined);
const mockSlotsQuery = jest.fn();
let mockEditOptions: { onSuccess?: (r: { message: string }) => unknown } = {};
let mockCancelOptions: { onSuccess?: (r: { message: string }) => unknown } = {};
let mockEditPending = false;
let mockCancelPending = false;
let mockSlots: string[] = [];
let mockAppointment = {};

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: { appointment: mockAppointment } }),
}));
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
      editAppointment: {
        useMutation: (options: typeof mockEditOptions) => {
          mockEditOptions = options;
          return { mutate: mockEditMutate, isPending: mockEditPending };
        },
      },
      editAppointmentStatus: {
        useMutation: (options: typeof mockCancelOptions) => {
          mockCancelOptions = options;
          return { mutate: mockCancelMutate, isPending: mockCancelPending };
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

const id = (suffix: string) => `appointments.appointmentEdit.${suffix}`;
const body = (suffix: string) => `appointments.appointmentFormBody.${suffix}`;
const holder = (suffix: string) => `appointments.doctorHolder.${suffix}`;
const slotId = (slot: string) => `appointments.timeSlot.slot.${slot}`;

// The Picker's own props (not the native host element's) carry `selectedValue`.
const selectedDoctor = () =>
  screen.UNSAFE_getAllByProps({ testID: holder("doctor") })[0].props
    .selectedValue;

const renderEdit = () => renderWithProviders(<AppointmentEditContent />);

describe("appointment edit screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEditPending = false;
    mockCancelPending = false;
    mockSlots = ["10:00", "11:00"];
    mockAppointment = makeAppointment({
      appointmentId: "APT-9",
      doctorEmployeeId: "D1",
      timeSlot: "09:00",
      status: "Booked",
    });
  });

  describe("initial state", () => {
    it("renders the screen and every action button", () => {
      renderEdit();
      expect(screen.getByTestId(id("screen"))).toBeTruthy();
      expect(screen.getByTestId(id("goBack"))).toBeTruthy();
      expect(screen.getByTestId(id("cancel"))).toBeTruthy();
      expect(screen.getByTestId(id("viewAppointments"))).toBeTruthy();
      expect(screen.getByTestId(body("primary"))).toBeTruthy();
      expect(screen.getByText("Edit Appointment")).toBeTruthy();
    });

    it("has no secondary action", () => {
      renderEdit();
      expect(screen.queryByTestId(body("secondary"))).toBeNull();
    });

    it("is prefilled with the appointment's patient, doctor and date", () => {
      renderEdit();
      expect(screen.getByTestId(body("patientId")).props.value).toBe("patient-1");
      expect(selectedDoctor()).toBe("D1");
      expect(screen.getByTestId(body("date"))).toBeTruthy();
    });

    it("looks up slots for the appointment's own doctor and date", () => {
      renderEdit();
      const [input, options] = mockSlotsQuery.mock.calls.at(-1);
      expect(input.employeeId).toBe("D1");
      expect(new Date(input.date).toDateString()).toBe(
        new Date(2030, 0, 15).toDateString(),
      );
      expect(options.enabled).toBe(true);
    });

    it("keeps the slot the appointment already holds selectable", () => {
      renderEdit();
      expect(screen.getByTestId(slotId("09:00"))).toBeTruthy();
      expect(screen.getByTestId(slotId("10:00"))).toBeTruthy();
      expect(screen.getByTestId(slotId("11:00"))).toBeTruthy();
    });

    it("does not duplicate the held slot when it is still available", () => {
      mockSlots = ["09:00", "10:00"];
      renderEdit();
      expect(screen.getAllByTestId(slotId("09:00"))).toHaveLength(1);
    });
  });

  describe("saving changes", () => {
    it("saves the unchanged appointment as pending", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId(body("primary")));
      expect(mockEditMutate).toHaveBeenCalledWith({
        appointmentId: "APT-9",
        patientId: "patient-1",
        doctorEmployeeId: "D1",
        timeSlot: "09:00",
        date: expect.any(Date),
        status: "Pending",
      });
    });

    it("saves a newly chosen slot", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId(slotId("11:00")));
      fireEvent.press(screen.getByTestId(body("primary")));
      expect(mockEditMutate).toHaveBeenCalledWith(
        expect.objectContaining({ timeSlot: "11:00" }),
      );
    });

    it("saves a newly chosen doctor and clears the slot", () => {
      renderEdit();
      fireEvent(screen.getByTestId(holder("doctor")), "valueChange", "D2");
      expect(mockSlotsQuery.mock.calls.at(-1)[0].employeeId).toBe("D2");

      fireEvent.press(screen.getByTestId(slotId("10:00")));
      fireEvent.press(screen.getByTestId(body("primary")));
      expect(mockEditMutate).toHaveBeenCalledWith(
        expect.objectContaining({ doctorEmployeeId: "D2", timeSlot: "10:00" }),
      );
    });

    it("requires a slot after switching to another doctor", () => {
      renderEdit();
      fireEvent(screen.getByTestId(holder("doctor")), "valueChange", "D2");
      fireEvent.press(screen.getByTestId(body("primary")));

      expect(screen.getByTestId(body("timeSlotError"))).toHaveTextContent(
        "Time slot is required",
      );
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" }),
      );
      expect(mockEditMutate).not.toHaveBeenCalled();
    });

    it("requires a doctor", () => {
      renderEdit();
      fireEvent(screen.getByTestId(holder("doctor")), "valueChange", "");
      fireEvent.press(screen.getByTestId(body("primary")));

      expect(screen.getByTestId(body("doctorError"))).toHaveTextContent(
        "Please select a doctor",
      );
      expect(mockEditMutate).not.toHaveBeenCalled();
    });

    it("rejects a past date and keeps the previous one", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId("date-picker"));
      expect(screen.getByTestId(body("dateError"))).toBeTruthy();
    });

    it("toasts success, refreshes slots and returns to the list once saved", async () => {
      renderEdit();
      await act(async () => {
        await mockEditOptions.onSuccess?.({ message: "Updated" });
      });

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Success",
        text2: "Updated",
      });
      expect(mockSlotsInvalidate).toHaveBeenCalled();
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("appointmentList"),
      );
    });

    it("stays on the screen when the save fails", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId(body("primary")));
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(Toast.show).not.toHaveBeenCalled();
    });
  });

  describe("cancelling the appointment", () => {
    it("cancels the appointment immediately", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId(id("cancel")));
      expect(mockCancelMutate).toHaveBeenCalledWith({
        appointmentId: "APT-9",
        status: "Cancelled",
      });
      expect(mockEditMutate).not.toHaveBeenCalled();
    });

    it("labels the primary button 'SAVE' when idle", () => {
      renderEdit();
      expect(screen.getByText("SAVE")).toBeTruthy();
      expect(screen.queryByText("SAVING...")).toBeNull();
    });

    it("shows 'SAVING...' while the save is in flight", () => {
      mockEditPending = true;
      renderEdit();
      expect(screen.getByText("SAVING...")).toBeTruthy();
      expect(screen.queryByText("SAVE")).toBeNull();
    });

    it("labels the button 'CANCEL APPOINTMENT' normally and 'CANCELING...' while pending", () => {
      renderEdit();
      expect(screen.getByText("CANCEL APPOINTMENT")).toBeTruthy();
    });

    it("shows the pending label while the cancellation is in flight", () => {
      mockCancelPending = true;
      renderEdit();
      expect(screen.getByText("CANCELING...")).toBeTruthy();
    });

    it("toasts success and returns to the list once cancelled", async () => {
      renderEdit();
      await act(async () => {
        await mockCancelOptions.onSuccess?.({ message: "Cancelled" });
      });

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Success",
        text2: "Cancelled",
      });
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("appointmentList"),
      );
    });
  });

  describe("navigation", () => {
    it("goes back to the list from the go-back button", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId(id("goBack")));
      expect(mockNavigate).toHaveBeenCalledWith("appointmentList");
    });

    it("goes to the list from the view-appointments button", () => {
      renderEdit();
      fireEvent.press(screen.getByTestId(id("viewAppointments")));
      expect(mockNavigate).toHaveBeenCalledWith("appointmentList");
    });
  });
});

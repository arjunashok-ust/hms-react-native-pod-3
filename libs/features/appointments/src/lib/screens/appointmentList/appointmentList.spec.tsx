import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import {
  act,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import {
  createHost,
  makeAppointment,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import AppointmentListContent from "./appointmentListContent";

const mockListQuery = jest.fn();
const mockCancelMutate = jest.fn();
let mockCancelOptions: { onSuccess?: (r: { message: string }) => unknown } = {};

jest.mock("@hms/trpc-client", () => ({
  trpc: {
    useUtils: () => ({
      client: {
        appointment: { getAppointmentsByPatientId: { query: mockListQuery } },
      },
    }),
    appointment: {
      getDoctorByEmployeeId: {
        useQuery: () => ({
          data: { name: "Asha Rao", specialization: "Cardiology" },
        }),
      },
      editAppointmentStatus: {
        useMutation: (options: typeof mockCancelOptions) => {
          mockCancelOptions = options;
          return { mutate: mockCancelMutate, isPending: false };
        },
      },
    },
  },
}));
jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

const id = (suffix: string) => `appointments.appointmentList.${suffix}`;
const cardId = (appointmentId: string, suffix: string) =>
  `appointments.appointmentCard.${appointmentId}.${suffix}`;

const navigation = { navigate: jest.fn() };

const page = (data: unknown[], pageNo = 1, totalPages = 1) => ({
  data,
  page: pageNo,
  totalPages,
});

const renderList = (host = createHost()) =>
  renderWithProviders(
    <AppointmentListContent navigation={navigation as never} />,
    host,
  );

describe("appointment list screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListQuery.mockResolvedValue(page([]));
  });

  it("renders the screen, go-back button, search box and list", async () => {
    renderList();
    expect(screen.getByTestId(id("screen"))).toBeTruthy();
    expect(screen.getByTestId(id("goBack"))).toBeTruthy();
    expect(screen.getByTestId(id("search"))).toBeTruthy();
    expect(screen.getByTestId(id("list"))).toBeTruthy();
    await waitFor(() => expect(mockListQuery).toHaveBeenCalled());
  });

  it("shows the welcome text and header", async () => {
    renderList();
    expect(screen.getByText("APPOINTMENT")).toBeTruthy();
    expect(screen.getByText("Your Appointments")).toBeTruthy();
    await waitFor(() => expect(mockListQuery).toHaveBeenCalled());
  });

  it("fetches the first page for the host's patient", async () => {
    renderList();
    await waitFor(() =>
      expect(mockListQuery).toHaveBeenCalledWith({
        patientId: "patient-1",
        selectedText: "",
        page: 1,
        limit: 5,
      }),
    );
  });

  it("does not fetch before the host has a patient id", async () => {
    renderList(createHost({ patientId: null }));
    expect(screen.getByTestId(id("screen"))).toBeTruthy();
    await act(async () => {});
    expect(mockListQuery).not.toHaveBeenCalled();
  });

  it("shows the loading indicator and hides the empty text while fetching", async () => {
    mockListQuery.mockReturnValue(new Promise(() => {}));
    renderList();
    expect(await screen.findByTestId(id("loading"))).toBeTruthy();
    expect(screen.queryByTestId(id("noAppointments"))).toBeNull();
  });

  it("shows the empty message when the patient has no appointments", async () => {
    renderList();
    expect(await screen.findByTestId(id("noAppointments"))).toHaveTextContent(
      "No appointments schedules.",
    );
    expect(screen.queryByTestId(id("loading"))).toBeNull();
  });

  // The list renders one row first (initialNumToRender={1}), so each status gets its own render.
  it("shows the appointment's doctor and status and no empty message", async () => {
    mockListQuery.mockResolvedValue(
      page([makeAppointment({ appointmentId: "APT-1", status: "Pending" })]),
    );
    renderList();

    expect(await screen.findByTestId(cardId("APT-1", "card"))).toBeTruthy();
    expect(screen.getByTestId(cardId("APT-1", "doctor"))).toHaveTextContent(
      "Asha Rao",
    );
    expect(screen.getByTestId(cardId("APT-1", "status"))).toHaveTextContent(
      "Pending",
    );
    expect(screen.queryByTestId(id("noAppointments"))).toBeNull();
  });

  it.each([
    ["Pending", "cancel", "edit"],
    ["Booked", "edit", "cancel"],
    ["Completed", null, "edit"],
    ["Completed", null, "cancel"],
    ["Cancelled", null, "edit"],
    ["Cancelled", null, "cancel"],
  ])(
    "for a %s appointment shows %p and hides %p",
    async (status, shown, hidden) => {
      mockListQuery.mockResolvedValue(
        page([makeAppointment({ appointmentId: "APT-1", status })]),
      );
      renderList();
      await screen.findByTestId(cardId("APT-1", "card"));

      if (shown) {
        expect(screen.getByTestId(cardId("APT-1", shown))).toBeTruthy();
      }
      expect(screen.queryByTestId(cardId("APT-1", hidden as string))).toBeNull();
    },
  );

  it("navigates to the edit screen with the pressed appointment", async () => {
    const booked = makeAppointment({ appointmentId: "APT-2", status: "Booked" });
    mockListQuery.mockResolvedValue(page([booked]));
    renderList();

    fireEvent.press(await screen.findByTestId(cardId("APT-2", "edit")));
    expect(navigation.navigate).toHaveBeenCalledWith("appointmentEdit", {
      appointment: booked,
    });
  });

  it("navigates to the booking form from the go-back button", async () => {
    renderList();
    fireEvent.press(screen.getByTestId(id("goBack")));
    expect(navigation.navigate).toHaveBeenCalledWith("appointmentForm");
    await waitFor(() => expect(mockListQuery).toHaveBeenCalled());
  });

  it("searches after the user stops typing", async () => {
    renderList();
    await waitFor(() => expect(mockListQuery).toHaveBeenCalledTimes(1));

    fireEvent.changeText(screen.getByTestId(id("search")), "asha");
    await waitFor(
      () =>
        expect(mockListQuery).toHaveBeenLastCalledWith(
          expect.objectContaining({ selectedText: "asha", page: 1 }),
        ),
      { timeout: 2000 },
    );
  });

  it("loads the next page when the list end is reached", async () => {
    mockListQuery
      .mockResolvedValueOnce(
        page([makeAppointment({ appointmentId: "APT-1" })], 1, 2),
      )
      .mockResolvedValueOnce(
        page([makeAppointment({ appointmentId: "APT-2" })], 2, 2),
      );
    renderList();
    await screen.findByTestId(cardId("APT-1", "card"));

    fireEvent(screen.getByTestId(id("list")), "endReached");

    // The list only renders one row first, so check the data rather than the card.
    await waitFor(() =>
      expect(mockListQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
      ),
    );
    await waitFor(() =>
      expect(screen.getByTestId(id("list")).props.data).toHaveLength(2),
    );
  });

  it("does not request another page when on the last page", async () => {
    mockListQuery.mockResolvedValue(
      page([makeAppointment({ appointmentId: "APT-1" })], 1, 1),
    );
    renderList();
    await screen.findByTestId(cardId("APT-1", "card"));

    fireEvent(screen.getByTestId(id("list")), "endReached");
    await act(async () => {});
    expect(mockListQuery).toHaveBeenCalledTimes(1);
  });

  describe("cancelling a pending appointment", () => {
    const pressCancel = async () => {
      mockListQuery.mockResolvedValue(
        page([makeAppointment({ appointmentId: "APT-1", status: "Pending" })]),
      );
      jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
      renderList();
      fireEvent.press(await screen.findByTestId(cardId("APT-1", "cancel")));
      return (Alert.alert as jest.Mock).mock.calls[0][2] as {
        text: string;
        onPress?: () => void;
      }[];
    };

    it("asks for confirmation before cancelling", async () => {
      const buttons = await pressCancel();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Cancel Appointment",
        expect.any(String),
        expect.any(Array),
      );
      expect(buttons.map((b) => b.text)).toEqual(["No", "Yes"]);
      expect(mockCancelMutate).not.toHaveBeenCalled();
    });

    it("cancels the appointment when the user confirms", async () => {
      const buttons = await pressCancel();
      buttons.find((b) => b.text === "Yes")?.onPress?.();
      expect(mockCancelMutate).toHaveBeenCalledWith({
        appointmentId: "APT-1",
        status: "Cancelled",
      });
    });

    it("does nothing when the user declines", async () => {
      const buttons = await pressCancel();
      buttons.find((b) => b.text === "No")?.onPress?.();
      expect(mockCancelMutate).not.toHaveBeenCalled();
    });

    it("refreshes the list and toasts success once cancelled", async () => {
      await pressCancel();
      await waitFor(() => expect(mockListQuery).toHaveBeenCalledTimes(1));

      await act(async () => {
        await mockCancelOptions.onSuccess?.({ message: "Cancelled" });
      });

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Success",
        text2: "Cancelled",
      });
      await waitFor(() => expect(mockListQuery).toHaveBeenCalledTimes(2));
    });
  });
});

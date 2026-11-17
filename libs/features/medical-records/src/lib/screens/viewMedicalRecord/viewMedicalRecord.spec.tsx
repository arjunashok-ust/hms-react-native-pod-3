import { act, fireEvent, screen } from "@testing-library/react-native";
import {
  createRecord,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import { ViewMedicalRecordContent } from "./viewMedicalRecordContent";

const mockFetchNextPage = jest.fn();
const mockUseMedicalRecords = jest.fn();
let mockPatientId: string | null = "P1";

jest.mock("@hms/data-access", () => ({
  useStoredPatientId: () => mockPatientId,
}));
jest.mock("@hms/trpc-client", () => ({ trpc: {} }));
jest.mock("../../hooks/useMedicalRecords", () => ({
  useMedicalRecords: (patientId: string | null) =>
    mockUseMedicalRecords(patientId),
}));

const id = (suffix: string) => `medical-records.viewMedicalRecord.${suffix}`;
const card = (suffix: string) => `medical-records.medicalRecordCard.${suffix}`;
const DETAILS = "medical-records.recordDetails.details";

const R1 = createRecord({ medicalRecordId: "REC-1", diagnosis: "Migraine" });
const R2 = createRecord({ medicalRecordId: "REC-2", diagnosis: "Asthma" });

const queryResult = (
  pages: unknown[][],
  overrides: Record<string, unknown> = {},
) => ({
  data: { pages: pages.map((data) => ({ data })) },
  isFetching: false,
  hasNextPage: false,
  fetchNextPage: mockFetchNextPage,
  ...overrides,
});

describe("view medical record screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPatientId = "P1";
    mockUseMedicalRecords.mockReturnValue(queryResult([[R1, R2]]));
  });

  describe("layout", () => {
    it("renders the screen, header and list", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByTestId(id("screen"))).toBeTruthy();
      expect(screen.getByTestId(id("header"))).toBeTruthy();
      expect(screen.getByTestId(id("list"))).toBeTruthy();
    });

    it("shows the welcome text and header title", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByText("MEDICAL")).toBeTruthy();
      expect(screen.getByText("HISTORY")).toBeTruthy();
      expect(screen.getByText("Your Medical Records")).toBeTruthy();
    });

    it("queries records for the stored patient", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(mockUseMedicalRecords).toHaveBeenCalledWith("P1");
    });

    it("passes a missing patient id through to the query", () => {
      mockPatientId = null;
      mockUseMedicalRecords.mockReturnValue(queryResult([[]]));
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(mockUseMedicalRecords).toHaveBeenCalledWith(null);
    });
  });

  describe("records list", () => {
    it("lists a card for every record", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByTestId(card("card.REC-1"))).toBeTruthy();
      expect(screen.getByTestId(card("card.REC-2"))).toBeTruthy();
      expect(screen.getByText("Migraine")).toBeTruthy();
      expect(screen.getByText("Asthma")).toBeTruthy();
    });

    it("flattens records from several pages", () => {
      const R3 = createRecord({ medicalRecordId: "REC-3", diagnosis: "Flu" });
      mockUseMedicalRecords.mockReturnValue(queryResult([[R1], [R2, R3]]));
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByTestId(card("card.REC-1"))).toBeTruthy();
      expect(screen.getByTestId(card("card.REC-2"))).toBeTruthy();
      expect(screen.getByTestId(card("card.REC-3"))).toBeTruthy();
    });

    it("does not show the empty message when there are records", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.queryByTestId(id("noRecords"))).toBeNull();
    });

    it("starts with every card collapsed", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.queryByTestId(DETAILS)).toBeNull();
    });
  });

  describe("empty and loading states", () => {
    it("shows 'No records found.' when the list is empty", () => {
      mockUseMedicalRecords.mockReturnValue(queryResult([[]]));
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByTestId(id("noRecords"))).toHaveTextContent(
        "No records found.",
      );
    });

    it("shows 'No records found.' when the query has no data yet and is idle", () => {
      mockUseMedicalRecords.mockReturnValue(
        queryResult([[]], { data: undefined }),
      );
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByTestId(id("noRecords"))).toBeTruthy();
    });

    it("shows the loading footer, not the empty message, while fetching", () => {
      mockUseMedicalRecords.mockReturnValue(
        queryResult([[]], { isFetching: true }),
      );
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.queryByTestId(id("noRecords"))).toBeNull();
      expect(screen.getByTestId(id("loading"))).toHaveTextContent("Loading...");
    });

    it("shows the loading footer under existing records while fetching more", () => {
      mockUseMedicalRecords.mockReturnValue(
        queryResult([[R1]], { isFetching: true, hasNextPage: true }),
      );
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.getByTestId(card("card.REC-1"))).toBeTruthy();
      expect(screen.getByTestId(id("loading"))).toBeTruthy();
    });

    it("hides the loading footer when not fetching", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      expect(screen.queryByTestId(id("loading"))).toBeNull();
    });
  });

  describe("expanding a record", () => {
    it("expands a card to show its details when its header is pressed", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      fireEvent.press(screen.getByTestId(card("toggle.REC-1")));
      expect(screen.getByTestId(DETAILS)).toBeTruthy();
      expect(
        screen.getByTestId(card("toggle.REC-1")).props.accessibilityState,
      ).toEqual({ expanded: true });
    });

    it("collapses an expanded card when pressed again", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      fireEvent.press(screen.getByTestId(card("toggle.REC-1")));
      fireEvent.press(screen.getByTestId(card("toggle.REC-1")));
      expect(screen.queryByTestId(DETAILS)).toBeNull();
    });

    it("keeps only one card expanded at a time", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      fireEvent.press(screen.getByTestId(card("toggle.REC-1")));
      fireEvent.press(screen.getByTestId(card("toggle.REC-2")));
      expect(screen.getAllByTestId(DETAILS)).toHaveLength(1);
      expect(
        screen.getByTestId(card("toggle.REC-1")).props.accessibilityState,
      ).toEqual({ expanded: false });
      expect(
        screen.getByTestId(card("toggle.REC-2")).props.accessibilityState,
      ).toEqual({ expanded: true });
    });

    it("shows the expanded record's clinical details", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      fireEvent.press(screen.getByTestId(card("toggle.REC-1")));
      expect(
        screen.getByTestId("medical-records.clinicalRow.value.Complaint"),
      ).toHaveTextContent("Headache");
    });
  });

  describe("pagination", () => {
    const endReached = () =>
      act(() => {
        fireEvent(screen.getByTestId(id("list")), "endReached");
      });

    it("loads the next page when the end is reached", () => {
      mockUseMedicalRecords.mockReturnValue(
        queryResult([[R1]], { hasNextPage: true }),
      );
      renderWithProviders(<ViewMedicalRecordContent />);
      endReached();
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it("does not load more when there is no next page", () => {
      renderWithProviders(<ViewMedicalRecordContent />);
      endReached();
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it("does not load more while a fetch is already running", () => {
      mockUseMedicalRecords.mockReturnValue(
        queryResult([[R1]], { hasNextPage: true, isFetching: true }),
      );
      renderWithProviders(<ViewMedicalRecordContent />);
      endReached();
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });
});

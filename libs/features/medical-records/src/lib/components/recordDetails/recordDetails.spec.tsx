import { screen } from "@testing-library/react-native";
import {
  createRecord,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import { RecordDetails } from "./recordDetails";

jest.mock("@hms/data-access", () => ({ useStoredPatientId: () => "P1" }));
jest.mock("@hms/trpc-client", () => ({ trpc: {} }));

const id = (suffix: string) => `medical-records.recordDetails.${suffix}`;
const rowId = (suffix: string) => `medical-records.clinicalRow.${suffix}`;

describe("RecordDetails", () => {
  it("shows the record id, created date, doctor and creator", () => {
    renderWithProviders(<RecordDetails record={createRecord()} />);
    expect(screen.getByTestId(id("details"))).toBeTruthy();
    expect(screen.getByTestId(id("recordId"))).toHaveTextContent("REC-000001");
    expect(screen.getByTestId(id("createdAt"))).toHaveTextContent(
      "Mon Jan 15 2024",
    );
    expect(screen.getByTestId(id("doctor"))).toHaveTextContent("doc-42");
    expect(screen.getByText("DOC")).toBeTruthy();
    expect(screen.getByTestId(id("createdBy"))).toHaveTextContent(
      "Created by EMP-7",
    );
  });

  it("shows the clinical rows with their values", () => {
    renderWithProviders(<RecordDetails record={createRecord()} />);
    expect(screen.getByTestId(rowId("value.Complaint"))).toHaveTextContent(
      "Headache",
    );
    expect(screen.getByTestId(rowId("value.Symptoms"))).toHaveTextContent(
      "Nausea",
    );
    expect(screen.getByTestId(rowId("value.Diagnosis"))).toHaveTextContent(
      "Migraine",
    );
  });

  it("shows an em dash for clinical values that are missing", () => {
    renderWithProviders(
      <RecordDetails
        record={createRecord({
          complaint: undefined,
          symptoms: "",
          diagnosis: undefined,
        })}
      />,
    );
    expect(screen.getByTestId(rowId("value.Complaint"))).toHaveTextContent("—");
    expect(screen.getByTestId(rowId("value.Symptoms"))).toHaveTextContent("—");
    expect(screen.getByTestId(rowId("value.Diagnosis"))).toHaveTextContent("—");
  });

  it("hides medications, observations and notes when there are none", () => {
    renderWithProviders(<RecordDetails record={createRecord()} />);
    expect(screen.queryByText(/Medications/)).toBeNull();
    expect(screen.queryByText(/Observations/)).toBeNull();
    expect(screen.queryByTestId(id("notes"))).toBeNull();
  });

  it("lists medications with a count and every column", () => {
    renderWithProviders(
      <RecordDetails
        record={createRecord({
          medications: [
            {
              name: "Ibuprofen",
              dosage: "200mg",
              frequency: "Twice daily",
              duration: "5 days",
            },
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Daily",
              duration: "3 days",
            },
          ],
        })}
      />,
    );
    expect(screen.getByText("Medications (2)")).toBeTruthy();
    expect(screen.getByTestId(id("medication.0"))).toBeTruthy();
    expect(screen.getByTestId(id("medication.1"))).toBeTruthy();
    expect(screen.getByText("Ibuprofen")).toBeTruthy();
    expect(screen.getByText("200mg")).toBeTruthy();
    expect(screen.getByText("Twice daily")).toBeTruthy();
    expect(screen.getByText("5 days")).toBeTruthy();
    expect(screen.getByText("Paracetamol")).toBeTruthy();
  });

  it("lists observations with the recorded date in en-GB", () => {
    renderWithProviders(
      <RecordDetails
        record={createRecord({
          medicalObservations: [
            {
              metricName: "Blood pressure",
              metricValue: "120/80",
              recordedTime: new Date(2024, 1, 3),
            },
          ],
        })}
      />,
    );
    expect(screen.getByText(/Observations/)).toBeTruthy();
    expect(screen.getByTestId(id("observation.0"))).toBeTruthy();
    expect(screen.getByText("Blood pressure")).toBeTruthy();
    expect(screen.getByText("120/80")).toBeTruthy();
    expect(screen.getByText("03 Feb 2024")).toBeTruthy();
  });

  it("shows notes only when the record has them", () => {
    renderWithProviders(
      <RecordDetails record={createRecord({ notes: "Rest and fluids" })} />,
    );
    expect(screen.getByTestId(id("notes"))).toHaveTextContent("Rest and fluids");
  });
});

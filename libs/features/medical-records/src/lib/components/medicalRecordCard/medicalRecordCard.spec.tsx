import { fireEvent, screen } from "@testing-library/react-native";
import {
  createRecord,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import { MedicalRecordCardComponent } from "./medicalRecordCard";

jest.mock("@hms/data-access", () => ({ useStoredPatientId: () => "P1" }));
jest.mock("@hms/trpc-client", () => ({ trpc: {} }));

const id = (suffix: string) => `medical-records.medicalRecordCard.${suffix}`;

describe("MedicalRecordCard", () => {
  it("shows the diagnosis, its initials and the created date", () => {
    renderWithProviders(
      <MedicalRecordCardComponent
        record={createRecord({ diagnosis: "Migraine" })}
        isExpanded={false}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByTestId(id("card.REC-000001"))).toBeTruthy();
    expect(screen.getByText("Migraine")).toBeTruthy();
    expect(screen.getByText("MI")).toBeTruthy();
    expect(screen.getByText("Mon Jan 15 2024")).toBeTruthy();
  });

  it("calls onToggle when the header is pressed", () => {
    const onToggle = jest.fn();
    renderWithProviders(
      <MedicalRecordCardComponent
        record={createRecord()}
        isExpanded={false}
        onToggle={onToggle}
      />,
    );
    fireEvent.press(screen.getByTestId(id("toggle.REC-000001")));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("hides the details while collapsed", () => {
    renderWithProviders(
      <MedicalRecordCardComponent
        record={createRecord()}
        isExpanded={false}
        onToggle={jest.fn()}
      />,
    );
    expect(
      screen.queryByTestId("medical-records.recordDetails.details"),
    ).toBeNull();
    expect(
      screen.getByTestId(id("toggle.REC-000001")).props.accessibilityState,
    ).toEqual({ expanded: false });
  });

  it("shows the details while expanded", () => {
    renderWithProviders(
      <MedicalRecordCardComponent
        record={createRecord()}
        isExpanded={true}
        onToggle={jest.fn()}
      />,
    );
    expect(
      screen.getByTestId("medical-records.recordDetails.details"),
    ).toBeTruthy();
    expect(
      screen.getByTestId(id("toggle.REC-000001")).props.accessibilityState,
    ).toEqual({ expanded: true });
  });

  it("copes with a record that has no diagnosis", () => {
    renderWithProviders(
      <MedicalRecordCardComponent
        record={createRecord({ diagnosis: undefined })}
        isExpanded={false}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByTestId(id("card.REC-000001"))).toBeTruthy();
  });
});

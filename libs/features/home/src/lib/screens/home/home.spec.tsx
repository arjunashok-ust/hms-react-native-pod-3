import { fireEvent, screen } from "@testing-library/react-native";
import {
  createHost,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import { HomeContent } from "./homeContent";

let mockDoctors: unknown[] = [];
let mockSpecializations: unknown[] = [];

jest.mock("@hms/trpc-client", () => ({
  trpc: {
    appointment: {
      getDoctors: { useQuery: () => ({ data: mockDoctors }) },
    },
    ui: {
      getSpecializations: { useQuery: () => ({ data: mockSpecializations }) },
    },
  },
}));

const id = (suffix: string) => `home.home.${suffix}`;

const DOCTORS = [
  {
    employeeCode: "D1",
    name: "Asha Rao",
    designation: "Consultant",
    specialization: "Cardiology",
  },
  {
    employeeCode: "D2",
    name: "Ben Carter",
    designation: "Senior Consultant",
    specialization: "Neurology",
  },
  {
    employeeCode: "D3",
    name: "Chitra Menon",
    designation: null,
    specialization: null,
  },
];

const SPECIALIZATIONS = [
  { _id: "s1", specialization_name: "Cardiology" },
  { _id: "s2", specialization_name: "Neurology" },
];

const chip = (name: string) => screen.getByTestId(id(`specialization.${name}`));

describe("home screen", () => {
  beforeEach(() => {
    mockDoctors = DOCTORS;
    mockSpecializations = SPECIALIZATIONS;
  });

  it("renders the screen, search box and both lists", () => {
    renderWithProviders(<HomeContent />);
    expect(screen.getByTestId(id("screen"))).toBeTruthy();
    expect(screen.getByTestId(id("search"))).toBeTruthy();
    expect(screen.getByTestId(id("specializationList"))).toBeTruthy();
    expect(screen.getByTestId(id("doctorList"))).toBeTruthy();
  });

  it("shows the welcome text and section titles", () => {
    renderWithProviders(<HomeContent />);
    expect(screen.getByText("DOCTORS")).toBeTruthy();
    expect(screen.getByText("Specialization")).toBeTruthy();
    expect(screen.getByText("Available Doctors")).toBeTruthy();
  });

  it("lists every doctor and specialization", () => {
    renderWithProviders(<HomeContent />);
    expect(screen.getByTestId(id("doctor.D1"))).toBeTruthy();
    expect(screen.getByTestId(id("doctor.D2"))).toBeTruthy();
    expect(screen.getByTestId(id("doctor.D3"))).toBeTruthy();
    expect(chip("Cardiology")).toBeTruthy();
    expect(chip("Neurology")).toBeTruthy();
  });

  it("shows each doctor's initials, name and designation", () => {
    renderWithProviders(<HomeContent />);
    expect(screen.getByText("AS")).toBeTruthy();
    expect(screen.getByText("Asha Rao")).toBeTruthy();
    expect(screen.getByText("Consultant")).toBeTruthy();
  });

  it("filters doctors by name as the user types", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.changeText(screen.getByTestId(id("search")), "ben");
    expect(screen.queryByTestId(id("doctor.D1"))).toBeNull();
    expect(screen.getByTestId(id("doctor.D2"))).toBeTruthy();
    expect(screen.queryByTestId(id("doctor.D3"))).toBeNull();
  });

  it("filters doctors by specialization text", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.changeText(screen.getByTestId(id("search")), "cardio");
    expect(screen.getByTestId(id("doctor.D1"))).toBeTruthy();
    expect(screen.queryByTestId(id("doctor.D2"))).toBeNull();
  });

  it("shows no doctors when nothing matches", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.changeText(screen.getByTestId(id("search")), "zzz");
    DOCTORS.forEach((d) =>
      expect(screen.queryByTestId(id(`doctor.${d.employeeCode}`))).toBeNull(),
    );
  });

  it("shows every doctor again when the search is cleared", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.changeText(screen.getByTestId(id("search")), "ben");
    fireEvent.changeText(screen.getByTestId(id("search")), "");
    expect(screen.getByTestId(id("doctor.D1"))).toBeTruthy();
    expect(screen.getByTestId(id("doctor.D2"))).toBeTruthy();
    expect(screen.getByTestId(id("doctor.D3"))).toBeTruthy();
  });

  it("filters by a specialization chip and marks it selected", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.press(chip("Neurology"));
    expect(screen.getByTestId(id("doctor.D2"))).toBeTruthy();
    expect(screen.queryByTestId(id("doctor.D1"))).toBeNull();
    expect(chip("Neurology").props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it("clears the filter when the selected chip is pressed again", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.press(chip("Neurology"));
    fireEvent.press(chip("Neurology"));
    expect(screen.getByTestId(id("doctor.D1"))).toBeTruthy();
    expect(screen.getByTestId(id("doctor.D2"))).toBeTruthy();
    expect(chip("Neurology").props.accessibilityState).toEqual({
      selected: false,
    });
  });

  it("switches the filter when another chip is pressed", () => {
    renderWithProviders(<HomeContent />);
    fireEvent.press(chip("Neurology"));
    fireEvent.press(chip("Cardiology"));
    expect(screen.getByTestId(id("doctor.D1"))).toBeTruthy();
    expect(screen.queryByTestId(id("doctor.D2"))).toBeNull();
  });

  it("asks the host to book an appointment with the pressed doctor", () => {
    const host = createHost();
    renderWithProviders(<HomeContent />, host);
    fireEvent.press(screen.getByTestId(id("doctor.D2")));
    expect(host.actions.bookAppointment).toHaveBeenCalledWith("D2");
    expect(host.actions.bookAppointment).toHaveBeenCalledTimes(1);
  });

  it("renders without doctors or specializations", () => {
    mockDoctors = [];
    mockSpecializations = [];
    renderWithProviders(<HomeContent />);
    expect(screen.getByTestId(id("screen"))).toBeTruthy();
    expect(screen.queryByTestId(id("doctor.D1"))).toBeNull();
  });
});

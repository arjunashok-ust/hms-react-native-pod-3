import { fireEvent, screen } from "@testing-library/react-native";
import {
  createHost,
  createNavigation,
  renderWithProviders,
} from "../../../test-utils/testProviders";
import ProfileViewContent from "./profileViewContent";

let mockProfile: unknown;
const mockUseQuery = jest.fn();

jest.mock("@hms/trpc-client", () => ({
  trpc: {
    user: {
      getPatientProfile: {
        useQuery: (...args: unknown[]) => {
          mockUseQuery(...args);
          return { data: mockProfile };
        },
      },
    },
  },
}));

const id = (suffix: string) => `profile.profileView.${suffix}`;

const PROFILE = {
  uhid: "UH-1001",
  name: "John Doe",
  role: "Patient",
  gender: "Male",
  dob: "1990-01-15T12:00:00",
  phone: "9876543210",
  email: "john@example.com",
  address: "12 Main St",
  emergencyContact: "9123456780",
};

describe("profile view screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfile = PROFILE;
  });

  it("renders the screen, profile card, buttons and every info card", () => {
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    [
      "screen",
      "profileCard",
      "name",
      "gender",
      "dob",
      "phone",
      "email",
      "address",
      "emergencyContact",
      "editProfile",
      "logout",
    ].forEach((suffix) => expect(screen.getByTestId(id(suffix))).toBeTruthy());
  });

  it("shows the patient's initials, name, role and UHID on the card", () => {
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(screen.getByText("JO")).toBeTruthy();
    expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);
    expect(screen.getByText("Patient")).toBeTruthy();
    expect(screen.getByText("UH-1001")).toBeTruthy();
  });

  it("shows personal and contact details with a formatted date of birth", () => {
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(screen.getByText("Male")).toBeTruthy();
    expect(screen.getByText("Jan 15, 1990")).toBeTruthy();
    expect(screen.getByText("9876543210")).toBeTruthy();
    expect(screen.getByText("john@example.com")).toBeTruthy();
    expect(screen.getByText("12 Main St")).toBeTruthy();
    expect(screen.getByText("9123456780")).toBeTruthy();
  });

  it("shows the section dividers", () => {
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(screen.getByText("PERSONAL INFO")).toBeTruthy();
    expect(screen.getByText("CONTACT INFO")).toBeTruthy();
    expect(screen.getByText("ACCOUNT SETTINGS")).toBeTruthy();
  });

  it("falls back to a label when there is no emergency contact", () => {
    mockProfile = { ...PROFILE, emergencyContact: "" };
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(screen.getByText("No Emergency Contact")).toBeTruthy();
  });

  it("shows empty values for optional fields the patient never set", () => {
    mockProfile = {
      ...PROFILE,
      gender: null,
      phone: null,
      address: null,
      dob: null,
      emergencyContact: null,
    };
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(screen.queryByText("Jan 15, 1990")).toBeNull();
    expect(screen.getByText("No Emergency Contact")).toBeTruthy();
  });

  it("renders without crashing while the profile has not loaded", () => {
    mockProfile = undefined;
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(screen.getByTestId(id("screen"))).toBeTruthy();
    expect(screen.queryByText("John Doe")).toBeNull();
  });

  it("queries the profile for the host's email", () => {
    renderWithProviders(<ProfileViewContent navigation={createNavigation()} />);
    expect(mockUseQuery).toHaveBeenCalledWith(
      { email: "patient@example.com" },
      { enabled: true },
    );
  });

  it("does not run the query when the host has no email", () => {
    renderWithProviders(
      <ProfileViewContent navigation={createNavigation()} />,
      createHost({ email: null }),
    );
    expect(mockUseQuery).toHaveBeenCalledWith({ email: "" }, { enabled: false });
  });

  it("navigates to the edit screen from the edit button", () => {
    const navigation = createNavigation();
    renderWithProviders(<ProfileViewContent navigation={navigation} />);
    fireEvent.press(screen.getByTestId(id("editProfile")));
    expect(navigation.navigate).toHaveBeenCalledWith("profileEdit");
  });

  it("signs out through the host from the logout button", () => {
    const host = createHost();
    renderWithProviders(
      <ProfileViewContent navigation={createNavigation()} />,
      host,
    );
    fireEvent.press(screen.getByTestId(id("logout")));
    expect(host.actions.signOut).toHaveBeenCalledTimes(1);
  });
});

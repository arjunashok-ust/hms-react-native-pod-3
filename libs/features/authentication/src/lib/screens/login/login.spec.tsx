import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import { renderWithProviders } from "../../../test-utils/testProviders";
import LoginContent from "./loginContent";

const mockMutateAsync = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@hms/shared-ui", () => require("../../../test-utils/sharedUiMock"));
jest.mock("@hms/trpc-client", () => ({
  trpc: {
    auth: { login: { useMutation: () => ({ mutateAsync: mockMutateAsync }) } },
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

const id = (suffix: string) => `authentication.login.${suffix}`;

const fillAndSubmit = (email: string, password: string) => {
  if (email) fireEvent.changeText(screen.getByTestId(id("email")), email);
  if (password)
    fireEvent.changeText(screen.getByTestId(id("password")), password);
  fireEvent.press(screen.getByTestId(id("submit")));
};

describe("login screen", () => {
  const onSignedIn = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    onSignedIn.mockResolvedValue(undefined);
    renderWithProviders(<LoginContent onSignedIn={onSignedIn} />);
  });

  it("renders the screen, both inputs and the submit button", () => {
    expect(screen.getByTestId(id("screen"))).toBeTruthy();
    expect(screen.getByTestId(id("email"))).toBeTruthy();
    expect(screen.getByTestId(id("password"))).toBeTruthy();
    expect(screen.getByTestId(id("submit"))).toBeTruthy();
  });

  it("shows no errors before the user submits", () => {
    expect(screen.queryByTestId(id("emailError"))).toBeNull();
    expect(screen.queryByTestId(id("passwordError"))).toBeNull();
  });

  it("shows both errors and a toast when submitting empty fields", () => {
    fillAndSubmit("", "");
    expect(screen.getByTestId(id("emailError"))).toHaveTextContent(
      "Email is required.",
    );
    expect(screen.getByTestId(id("passwordError"))).toHaveTextContent(
      "Password is required.",
    );
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("shows only the password error when the email is valid", () => {
    fillAndSubmit("user@example.com", "");
    expect(screen.queryByTestId(id("emailError"))).toBeNull();
    expect(screen.getByTestId(id("passwordError"))).toBeTruthy();
  });

  it("shows an invalid-email error for a malformed email", () => {
    fillAndSubmit("not-an-email", "Secret123");
    expect(screen.getByTestId(id("emailError"))).toHaveTextContent(
      "Email is invalid.",
    );
    expect(screen.queryByTestId(id("passwordError"))).toBeNull();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("logs in with the typed credentials and calls onSignedIn", async () => {
    mockMutateAsync.mockResolvedValue({
      token: "tok",
      email: "user@example.com",
    });
    fillAndSubmit("user@example.com", "Secret123");

    await waitFor(() =>
      expect(onSignedIn).toHaveBeenCalledWith({
        token: "tok",
        email: "user@example.com",
      }),
    );
    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "Secret123",
      isClientApp: true,
    });
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
  });

  it("does not call onSignedIn or toast success when the API rejects", async () => {
    mockMutateAsync.mockRejectedValue(new Error("bad credentials"));
    fillAndSubmit("user@example.com", "Secret123");

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
    expect(onSignedIn).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
  });

  it("shows the loading label while the request is in flight", async () => {
    let resolveLogin: (v: { token: string; email: string }) => void = () => {};
    mockMutateAsync.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    fillAndSubmit("user@example.com", "Secret123");

    expect(await screen.findByText("Logging In...")).toBeTruthy();

    await act(async () => {
      resolveLogin({ token: "t", email: "user@example.com" });
    });
    expect(screen.getByText("Login")).toBeTruthy();
  });

  it("navigates to signup from the footer link", () => {
    fireEvent.press(screen.getByTestId(id("signupLink")));
    expect(mockNavigate).toHaveBeenCalledWith("signup");
  });
});

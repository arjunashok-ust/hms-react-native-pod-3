import { validateEmail } from "@hms/shared-util";

export type LoginFormErrors = { emailError: string; passwordError: string };

export const EMPTY_LOGIN_ERRORS: LoginFormErrors = {
  emailError: "",
  passwordError: "",
};

export const validateLoginForm = (email: string, password: string) => ({
  emailError: validateEmail(email),
  passwordError: password ? "" : "Password is required.",
});

export const hasLoginErrors = (e: LoginFormErrors) =>
  Boolean(e.emailError || e.passwordError);

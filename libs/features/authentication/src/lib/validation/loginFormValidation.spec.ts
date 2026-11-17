import {
  EMPTY_LOGIN_ERRORS,
  hasLoginErrors,
  validateLoginForm,
} from "./loginFormValidation";

describe("validateLoginForm", () => {
  it("flags both fields when empty", () => {
    const e = validateLoginForm("", "");
    expect(e.emailError).not.toBe("");
    expect(e.passwordError).toBe("Password is required.");
  });

  it("passes a valid email and password", () => {
    expect(validateLoginForm("a@b.com", "secret")).toEqual(EMPTY_LOGIN_ERRORS);
  });
});

describe("hasLoginErrors", () => {
  it("is falsy for empty errors,true if either is set", () => {
    expect(hasLoginErrors(EMPTY_LOGIN_ERRORS)).toBe(false);
    expect(hasLoginErrors({ emailError: "x", passwordError: "" })).toBe(true);
    expect(hasLoginErrors({ emailError: "", passwordError: "y" })).toBe(true);
  });
});

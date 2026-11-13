import { authInputTextStyles } from "../components/authInputText/authInputText.styles";
import { authSubmitTextStyles } from "../components/authSubmitText/authSubmitText.styles";
import { loginStyles } from "../screens/login/login.styles";
import { signUpStyles } from "../screens/signup/signup.styles";

export const AuthenticationStyles = {
  // components
  authInputTextContent: authInputTextStyles,
  authSubmitTextContent: authSubmitTextStyles,
  // screens
  loginContent: loginStyles,
  signupContent: signUpStyles,
};

export type AuthenticationStylesType = typeof AuthenticationStyles;

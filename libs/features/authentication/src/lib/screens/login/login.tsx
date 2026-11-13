import { AuthenticationMicroAppProps } from "../../microAppTypes";
import LoginContent from "./loginContent";

export function Login({ onSignedIn }: AuthenticationMicroAppProps) {
  return <LoginContent onSignedIn={onSignedIn} />;
}

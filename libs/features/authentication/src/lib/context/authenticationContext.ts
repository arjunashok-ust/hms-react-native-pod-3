import { createContext } from "react";
import { AuthenticationContent } from "../content/content";
import { AuthenticationStylesType } from "./authenticationStyles";

export interface AuthenticationContextValues {
  styles: AuthenticationStylesType;
  content: AuthenticationContent;
}

export const AuthenticationContext = createContext<
  AuthenticationContextValues | undefined
>(undefined);

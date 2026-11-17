import { createContext } from "react";
import { AuthenticationContent } from "../content/content";
import { AuthenticationStylesType } from "./authenticationStyles";
import { TestIdTag } from "@hms/shared-util";

export interface AuthenticationContextValues {
  styles: AuthenticationStylesType;
  content: AuthenticationContent;
  testId: (component: string) => TestIdTag;
}

export const AuthenticationContext = createContext<
  AuthenticationContextValues | undefined
>(undefined);

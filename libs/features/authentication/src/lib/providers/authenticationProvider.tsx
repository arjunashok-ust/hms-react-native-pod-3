import { ReactNode, useContext, useMemo } from "react";
import { AuthenticationContext } from "../context/authenticationContext";
import { AuthenticationLanguage, defaultContent } from "../content/content";
import { AuthenticationStyles } from "../context/authenticationStyles";
import { createTestId } from "@hms/shared-util";

export interface AuthenticationProviderTypes {
  language?: AuthenticationLanguage;
  children: ReactNode;
}

const testId = createTestId("authentication");

export function AuthenticationProvider({
  language = "en",
  children,
}: AuthenticationProviderTypes) {
  const value = useMemo(
    () => ({
      styles: AuthenticationStyles,
      content: defaultContent[language](),
      testId,
    }),
    [language],
  );
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

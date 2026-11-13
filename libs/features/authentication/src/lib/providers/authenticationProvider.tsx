import { ReactNode, useContext, useMemo } from "react";
import { AuthenticationContext } from "../context/authenticationContext";
import { AuthenticationLanguage, defaultContent } from "../content/content";
import { AuthenticationStyles } from "../context/authenticationStyles";

export interface AuthenticationProviderTypes {
  language?: AuthenticationLanguage;
  children: ReactNode;
}

export function AuthenticationProvider({
  language = "en",
  children,
}: AuthenticationProviderTypes) {
  const value = useMemo(
    () => ({
      styles: AuthenticationStyles,
      content: defaultContent[language](),
    }),
    [language],
  );
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

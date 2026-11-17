import { ReactNode, useMemo } from "react";
import { HomeStyles } from "../context/homeStyles";
import { defaultContent, HomeLanguage } from "../content/content";
import { HomeContext } from "../context/homeContext";
import { createTestId } from "@hms/shared-util";

const testId = createTestId("home");

export interface HomeProviderProps {
  language?: HomeLanguage;
  children: ReactNode;
}
export function HomeProvider({ language = "en", children }: HomeProviderProps) {
  const value = useMemo(
    () => ({
      styles: HomeStyles,
      content: defaultContent[language](),
      testId,
    }),
    [language],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

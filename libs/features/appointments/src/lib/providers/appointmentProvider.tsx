import { ReactNode, useMemo } from "react";
import { AppointmentLanguage, defaultContent } from "../content/content";
import { AppointmentContext } from "../context/appointmentContext";
import { AppointmentStyles } from "../context/appointmentStyles";
import { createTestId } from "@hms/shared-util";

const testId = createTestId("appointments");

export interface AppointmentProviderProps {
  language?: AppointmentLanguage;
  children: ReactNode;
}

export function AppointmentProvider({
  language = "en",
  children,
}: AppointmentProviderProps) {
  const value = useMemo(
    () => ({ styles: AppointmentStyles, content: defaultContent[language](), testId }),
    [language],
  );
  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

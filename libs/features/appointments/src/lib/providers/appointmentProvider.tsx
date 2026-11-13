import { ReactNode, useMemo } from "react";
import { AppointmentLanguage, defaultContent } from "../content/content";
import { AppointmentContext } from "../context/appointmentContext";
import { AppointmentStyles } from "../context/appointmentStyles";

export interface AppointmentProviderProps {
  language?: AppointmentLanguage;
  children: ReactNode;
}

export function AppointmentProvider({
  language = "en",
  children,
}: AppointmentProviderProps) {
  const value = useMemo(
    () => ({ styles: AppointmentStyles, content: defaultContent[language]() }),
    [language],
  );
  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

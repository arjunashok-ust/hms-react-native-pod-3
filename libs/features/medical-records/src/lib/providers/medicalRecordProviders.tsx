import { ReactNode, useMemo } from "react";
import { defaultContent, MedicalRecordLanguage } from "../content/content";
import { medicalRecordStyles } from "../context/medicalRecordStyles";
import { MedicalRecordContext } from "../context/medicalRecordContext";

export interface MedicalRecordProviderProps {
  language?: MedicalRecordLanguage;
  children: ReactNode;
}

export function MedicalRecordProvider({
  language = "en",
  children,
}: MedicalRecordProviderProps) {
  const value = useMemo(
    () => ({
      styles: medicalRecordStyles,
      content: defaultContent[language](),
    }),
    [language],
  );

  return (
    <MedicalRecordContext.Provider value={value}>
      {children}
    </MedicalRecordContext.Provider>
  );
}

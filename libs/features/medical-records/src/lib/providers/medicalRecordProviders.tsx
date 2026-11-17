import { ReactNode, useMemo } from "react";
import { defaultContent, MedicalRecordLanguage } from "../content/content";
import { medicalRecordStyles } from "../context/medicalRecordStyles";
import { MedicalRecordContext } from "../context/medicalRecordContext";
import { createTestId } from "@hms/shared-util";

const testId = createTestId("medical-records");

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
      testId,
    }),
    [language],
  );

  return (
    <MedicalRecordContext.Provider value={value}>
      {children}
    </MedicalRecordContext.Provider>
  );
}

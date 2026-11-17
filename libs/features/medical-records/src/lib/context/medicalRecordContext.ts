import { createContext } from "react";
import type { TestIdTag } from "@hms/shared-util";
import { MedicalRecordContent } from "../content/content";
import { MedicalRecordStyles } from "./medicalRecordStyles";

export interface MedicalRecordContextValues {
  styles: MedicalRecordStyles;
  content: MedicalRecordContent;
  testId: (component: string) => TestIdTag;
}

export const MedicalRecordContext = createContext<
  MedicalRecordContextValues | undefined
>(undefined);

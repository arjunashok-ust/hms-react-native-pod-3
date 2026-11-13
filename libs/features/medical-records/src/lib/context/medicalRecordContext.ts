import { createContext } from "react";
import { MedicalRecordContent } from "../content/content";
import { MedicalRecordStyles } from "./medicalRecordStyles";

export interface MedicalRecordContextValues {
  styles: MedicalRecordStyles;
  content: MedicalRecordContent;
}

export const MedicalRecordContext = createContext<
  MedicalRecordContextValues | undefined
>(undefined);

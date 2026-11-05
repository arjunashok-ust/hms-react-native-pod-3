import { clinicalRowStyles } from "../components/clinicalRows/clinicalRow.styles";
import { medicalRecordCardStyles } from "../components/medicalRecordCard/medicalRecordCard.styles";
import { recordDetailsStyles } from "../components/recordDetails/recordDetails.styles";
import { viewMedicalRecordContentStyles } from "../screens/viewMedicalRecord/viewMedicalRecordContent.styles";

export const medicalRecordStyles = {
  viewMedicalRecordContent: viewMedicalRecordContentStyles,
  clinicalRowContent: clinicalRowStyles,
  recordDetailsContent: recordDetailsStyles,
  medicalRecordCardContent: medicalRecordCardStyles,
};

export type MedicalRecordStyles = typeof medicalRecordStyles;

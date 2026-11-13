const buildEnglishContent = () => ({
  // components
  clinicalRowContent: {
    // to do
  },
  recordDetailsContent: {
    sectionLabel: {
      medications: "Medications",
      observations: "Observations",
      notes: "Notes",
    },
    peopleRow: {
      sectionLabel: {
        doctor: "Doctor",
      },
    },
    clinicalData: {
      label: {
        complaint: "Complaint",
        symptoms: "Symptoms",
        diagnosis: "Diagnosis",
      },
    },
    medicationsData: {
      title: {
        name: "Name",
        dosage: "Dosage",
        frequency: "Freq.",
        duration: "Dur.",
      },
    },
    observationsData: {
      title: {
        metric: "Metric",
        value: "Value",
        recordedAt: "Recorded At",
      },
    },
    footerText: {
      createdBy: "Created by",
    }
  },
  medicalRecordCardContent: {
    // to do
  },
  // screens
  viewMedicalRecordContent: {
    welcome: {
      text1: "View your,",
      text2: "MEDICAL",
      text3: "records here.",
    },
    header: {
      title: "HISTORY",
      value: "Your Medical Records",
    },
    errors: {
      noRecordsFound: "No records found.",
    },
    loaders: {
      loading: "Loading...",
    },
  },
});

export type MedicalRecordContent = ReturnType<typeof buildEnglishContent>;
export type MedicalRecordLanguage = "en";

export const defaultContent: Record<
  MedicalRecordLanguage,
  () => MedicalRecordContent
> = {
  en: buildEnglishContent,
};

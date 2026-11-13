import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type MedicalRecordStackParamList = {
  viewMedicalRecord: undefined;
};

export type MedicalRecordScreenProps<
  T extends keyof MedicalRecordStackParamList,
> = NativeStackScreenProps<MedicalRecordStackParamList, T>;

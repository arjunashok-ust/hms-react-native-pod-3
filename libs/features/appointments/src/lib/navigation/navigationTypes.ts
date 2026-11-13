import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppointmentItem } from "@hms/trpc-client";

export type AppointmentStackParamList = {
  appointmentForm: { doctorId?: string } | undefined;
  appointmentList: undefined;
  appointmentEdit: { appointment: AppointmentItem };
};

export type AppointmentScreenProps<T extends keyof AppointmentStackParamList> =
  NativeStackScreenProps<AppointmentStackParamList, T>;

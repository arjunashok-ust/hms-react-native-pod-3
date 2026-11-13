import {
  AppointmentFormContent,
  AppointmentFormProps,
} from "./appointmentFormContent";

export function AppointmentForm({
  navigation,
  initialDoctorId,
}: AppointmentFormProps) {
  return(
  <AppointmentFormContent
    navigation={navigation}
    initialDoctorId={initialDoctorId}
  />
);
;
}

import { coverImage } from "@hms/shared-ui";
import { View, ImageBackground, StyleSheet, ScrollView } from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { ProfileButton } from "@hms/shared-ui";
import { AppointmentFormBody } from "../../components/appointmentFormBody/appointmentFormBody";
import { AppointmentScreenProps } from "../../navigation/navigationTypes";
import { useAppointmentsForm } from "./useAppointmentsForm";

export type AppointmentFormProps = Pick<AppointmentScreenProps<"appointmentForm">,"navigation"> & {
  initialDoctorId?: string;
};

export function AppointmentFormContent({
  navigation,
  initialDoctorId,
}: AppointmentFormProps) {
  const {
    styles,
    content,
    patientId,
    date,
    isDateSet,
    onDateChange,
    doctors,
    doctorId,
    setDoctor,
    availableSlots,
    timeSlot,
    setTimeSlot,
    errors,
    createAppointment,
    sendAppointment,
    clearFields,
    goToAppointments,
  } = useAppointmentsForm({ navigation, initialDoctorId });
  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1={content.welcome.text1}
          text2={content.welcome.text2}
          text3={content.welcome.text3}
          isHome={true}
        />

        <ScrollView style={styles.scrollView}>
          <AppointmentFormBody
            formTitle={content.appointmentFormBodyProps.title}
            formSubtitle={content.appointmentFormBodyProps.formSubtitle}
            patientId={patientId ?? ""}
            date={date}
            isDateSet={isDateSet}
            onDateChange={onDateChange}
            doctors={doctors}
            doctorId={doctorId}
            setDoctor={setDoctor}
            availableSlots={availableSlots}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
            errors={errors}
            primaryLabel={
              createAppointment.isPending ? content.appointmentFormBodyProps.primaryLabel.creating : content.appointmentFormBodyProps.primaryLabel.create
            }
            onPrimaryAction={sendAppointment}
            secondaryLabel={content.appointmentFormBodyProps.secondaryLabel.clear}
            secondaryIcon="close-outline"
            onSecondaryAction={clearFields}
          />
        </ScrollView>

        <ProfileButton
          title={content.profileButton.title.viewAppointments}
          iconName="eye-outline"
          onAction={goToAppointments}
        />
      </View>
    </ImageBackground>
  );
}

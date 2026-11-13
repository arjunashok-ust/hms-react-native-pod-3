import { coverImage } from "@hms/shared-ui";
import { View, ImageBackground, ScrollView } from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { ProfileButton } from "@hms/shared-ui";
import {AppointmentFormBody} from "../../components/appointmentFormBody/appointmentFormBody"; 
import { useAppointmentEdit } from "./useAppointmentEdit";

export default function appointmentEditContent() {
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
    editAppointment,
    saveAppointment,
    cancelAppointment,
    cancel,
    goToAppointments,
  } = useAppointmentEdit();
  
  return (
    <ImageBackground source={coverImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer text1={content.welcome.text1} text2={content.welcome.text2} text3={content.welcome.text3} />

        <ProfileButton title={content.profileButton.title.goBack} iconName="arrow-back-outline" onAction={goToAppointments} />

        <ScrollView style={styles.scrollView}>
          <AppointmentFormBody
            formTitle={content.appointmentFormBodyProps.title}
            formSubtitle={content.appointmentFormBodyProps.formSubtitle}
            patientId={patientId}
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
            primaryLabel={editAppointment.isPending ? content.appointmentFormBodyProps.primaryLabel.save : content.appointmentFormBodyProps.primaryLabel.saving}
            primaryIcon="save-outline"
            onPrimaryAction={saveAppointment}
          />
        </ScrollView>

        <ProfileButton
          title={cancelAppointment.isPending ? content.profileButton.title.canceling : content.profileButton.title.cancelAppointment}
          iconName="close-outline"
          onAction={cancel}
        />
        <ProfileButton title={content.profileButton.title.viewAppointments} iconName="eye-outline" onAction={goToAppointments} />
      </View>
    </ImageBackground>
  );
}

import { coverImage } from "@hms/shared-ui";
import { View, ImageBackground, StyleSheet, ScrollView } from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { ProfileButton } from "@hms/shared-ui";
import Toast from "react-native-toast-message";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppointmentStackParamList } from "../../navigation/navigation-types"; 
import { trpc } from "@hms/trpc-client";
import { useAppointmentForm } from "../../hooks/use-appointment-form";
import { useInvalidateAppointments } from "../../hooks/use-appointments";
import {AppointmentFormBody} from "../../components/appointment-form-body.component"; 

export default function EditAppointmentScreen() {
  const route = useRoute<RouteProp<AppointmentStackParamList, "appointmentEdit">>();
  const { appointment } = route.params;
  const navigator = useNavigation<NativeStackNavigationProp<AppointmentStackParamList>>();

  const {
    doctors, isDateSet,
    patientId, doctorId, date, availableSlots, timeSlot, setTimeSlot, errors,
    onDateChange, setDoctor, validate, showValidationError,
  } = useAppointmentForm({ initialAppointment: appointment });

  const goToAppointments = () => navigator.navigate("appointmentList");

  const utils = trpc.useUtils();
  const invalidateAppointments = useInvalidateAppointments();

  const onMutationSuccess = async (message: string) => {
    Toast.show({ type: "success", text1: "Success", text2: message });
    // slots free up or get taken, and the list shows the new state
    await Promise.all([
      utils.user.getAvailableTimeSlots.invalidate(),
      invalidateAppointments(),
    ]);
    navigator.navigate("appointmentList");
  };

  const editAppointment = trpc.appointment.editAppointment.useMutation({
    onSuccess: ({ message }) => onMutationSuccess(message),
  });

  const cancelAppointment = trpc.appointment.editAppointmentStatus.useMutation({
    onSuccess: ({ message }) => onMutationSuccess(message),
  });

  const saveAppointment = () => {
    if (!validate()) {
      showValidationError();
      return;
    }
    editAppointment.mutate({
      appointmentId: appointment.appointmentId,
      patientId,
      doctorEmployeeId: doctorId,
      timeSlot,
      date,
      status: "Pending",
    });
  };

  const cancel = () =>
    cancelAppointment.mutate({
      appointmentId: appointment.appointmentId,
      status: "Cancelled",
    });

  return (
    <ImageBackground source={coverImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer text1="Edit your," text2="APPOINTMENT" text3="here." />

        <ProfileButton title="GO BACK" iconName="arrow-back-outline" onAction={goToAppointments} />

        <ScrollView style={styles.scrollView}>
          <AppointmentFormBody
            formTitle="MODIFY ENTRY"
            formSubtitle="Edit Appointment"
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
            primaryLabel={editAppointment.isPending ? "SAVING..." : "SAVE"}
            primaryIcon="save-outline"
            onPrimaryAction={saveAppointment}
          />
        </ScrollView>

        <ProfileButton
          title={cancelAppointment.isPending ? "CANCELING..." : "CANCEL APPOINTMENT"}
          iconName="close-outline"
          onAction={cancel}
        />
        <ProfileButton title="VIEW APPOINTMENTS" iconName="eye-outline" onAction={goToAppointments} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.8)" },
  scrollView: { height: 450 },
});

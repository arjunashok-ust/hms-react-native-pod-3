import { coverImage } from "@hms/shared-ui";
import { View, ImageBackground, StyleSheet, ScrollView } from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ProfileButton } from "@hms/shared-ui";
import Toast from "react-native-toast-message";
import { trpc } from "@hms/trpc-client";
import { useAppointmentForm } from "../hooks/useAppointmentForm";
import { useInvalidateAppointments } from "../hooks/useAppointments";
import { AppointmentFormBody } from "../components/appointment/appointment-form-body-component";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TabParamList } from "@hms/models";

type AppointmentRouteProp = RouteProp<TabParamList, "appointment">;

export default function AppointmentScreen() {
  const router = useRoute<AppointmentRouteProp>();
  const initialDoctorId = router.params?.doctorId;

  const {
    doctors,
    isShow,
    setIsShow,
    isDateSet,
    patientId,
    doctorId,
    date,
    availableSlots,
    timeSlot,
    setTimeSlot,
    errors,
    onDateChange,
    setDoctor,
    clearFields,
    validateAppointment,
    showValidationError,
    maxDateLimit,
    goToAppointments,
  } = useAppointmentForm({
    initialDoctorId,
  });

  const utils = trpc.useUtils();
  const invalidateAppointments = useInvalidateAppointments();

  const createAppointment = trpc.appointment.createAppointment.useMutation({
    onSuccess: async ({ message }) => {
      Toast.show({ type: "success", text1: "Success", text2: message });
      clearFields();
      // the booked slot is gone and the patient's list has a new entry
      await Promise.all([
        utils.user.getAvailableTimeSlots.invalidate(),
        invalidateAppointments(),
      ]);
    },
  });

  const sendAppointment = () => {
    if (!validateAppointment()) {
      showValidationError();
      return;
    }
    createAppointment.mutate({
      patientId,
      doctorEmployeeId: doctorId,
      timeSlot,
      date,
      status: "Pending",
    });
  };

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="Create your,"
          text2="APPOINTMENT"
          text3="here."
          isHome={true}
        />

        <ScrollView style={styles.scrollView}>
          <AppointmentFormBody
            formTitle="NEW ENTRY"
            formSubtitle="Book Appointment"
            patientId={patientId}
            date={date}
            isDateSet={isDateSet}
            setIsShow={setIsShow}
            doctors={doctors}
            doctorId={doctorId}
            setDoctor={setDoctor}
            availableSlots={availableSlots}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
            errors={errors}
            primaryLabel={
              createAppointment.isPending ? "CREATING..." : "CREATE"
            }
            onPrimaryAction={sendAppointment}
            secondaryLabel="CLEAR"
            secondaryIcon="close-outline"
            onSecondaryAction={clearFields}
          />
        </ScrollView>

        <ProfileButton
          title="VIEW APPOINTMENTS"
          iconName="eye-outline"
          onAction={goToAppointments}
        />

        {isShow && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()}
            maximumDate={maxDateLimit()}
            onChange={(_, value) => {
              if (value) onDateChange(value);
            }}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.8)" },
  scrollView: { height: 450 },
});

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AppointmentStackParamList } from "../../navigation/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppointmentForm } from "../../hooks/useAppointmentForm";
import { trpc } from "@hms/trpc-client";
import { useInvalidateAppointments } from "../../hooks/useAppointments";
import Toast from "react-native-toast-message";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";

export function useAppointmentEdit() {
  const { styles, content } = useAppointmentContext("appointmentEditContent");
  const route =
    useRoute<RouteProp<AppointmentStackParamList, "appointmentEdit">>();
  const { appointment } = route.params;
  const navigator =
    useNavigation<NativeStackNavigationProp<AppointmentStackParamList>>();

  const {
    doctors,
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
    validate,
    showValidationError,
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

  return {
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
  };
}

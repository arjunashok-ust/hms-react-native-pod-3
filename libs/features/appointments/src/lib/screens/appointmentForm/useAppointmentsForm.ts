import { useEffect } from "react";
import { useAppointmentForm } from "../../hooks/useAppointmentForm";
import { trpc } from "@hms/trpc-client";
import { useInvalidateAppointments } from "../../hooks/useAppointments";
import Toast from "react-native-toast-message";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";
import { AppointmentFormProps } from "./appointmentForm";

type UseAppointmentsFormProps = Pick<
  AppointmentFormProps,
  "navigation" | "initialDoctorId"
>;

export function useAppointmentsForm({
  initialDoctorId,
  navigation,
}: UseAppointmentsFormProps) {
  const { styles, content } = useAppointmentContext("appointmentFormContent");
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
    clearFields,
    validate,
    showValidationError,
  } = useAppointmentForm({
    initialDoctorId,
  });

  // The host remounts the micro app for every new launch (key = launchId), but React Navigation
  // restores the stack from the tab route's saved state, so the list or edit screen can still sit on top.
  // This screen mounts below them: drop anything above it so a launch always shows the form.
  useEffect(() => {
    if (navigation.getState().routes.length > 1) navigation.popToTop();
  }, [navigation]);

  const goToAppointments = () => navigation.navigate("appointmentList");

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
    if (!validate()) {
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
    createAppointment,
    sendAppointment,
    clearFields,
    goToAppointments,
  };
}

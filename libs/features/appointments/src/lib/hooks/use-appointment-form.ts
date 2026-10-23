import { useCallback, useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { useHost } from "@hms/shared-util";
import { AppointmentItem, Doctor, trpc } from "@hms/trpc-client";
import {
  AppointmentFormErrors,
  EMPTY_ERRORS,
  hasErrors,
  validateAppointment,
  validateDate,
} from "../validation/appointment-form.validation";

export interface UseAppointmentFormOptions {
  initialAppointment?: AppointmentItem;
  initialDoctorId?: string;
}

const NO_DOCTORS: Doctor[] = [];
const NO_SLOTS: string[] = [];

export const maxDateLimit = (): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d;
};

export function useAppointmentForm({
  initialAppointment,
  initialDoctorId,
}: UseAppointmentFormOptions = {}) {
  const [isShow, setIsShow] = useState(false);
  const [isDateSet, setIsDateSet] = useState(Boolean(initialAppointment));
  const [doctorId, setDoctorId] = useState(
    initialAppointment?.doctorEmployeeId ?? initialDoctorId ?? "",
  );
  const [date, setDate] = useState(() =>
    initialAppointment ? new Date(initialAppointment.date) : new Date(),
  );
  const [timeSlot, setTimeSlot] = useState(initialAppointment?.timeSlot ?? "");
  const [errors, setErrors] = useState<AppointmentFormErrors>(EMPTY_ERRORS);

  // null until the host has loaded the session; forms render empty and submit stays blocked by validation
  const patientId = useHost().patientId ?? "";

  const { data: doctors = NO_DOCTORS } = trpc.appointment.getDoctors.useQuery();

  const { data: slotsData } = trpc.user.getAvailableTimeSlots.useQuery(
    { employeeId: doctorId, date },
    { enabled: !!doctorId && isDateSet },
  );

  // When editing, the slot the appointment already holds stays selectable for its own doctor and date.
  const initialSlotFor = useCallback(
    (employeeId: string, day: Date): string => {
      if (!initialAppointment) return "";
      const isSameDoctor = initialAppointment.doctorEmployeeId === employeeId;
      const isSameDate =
        new Date(initialAppointment.date).toDateString() === day.toDateString();
      return isSameDoctor && isSameDate ? (initialAppointment.timeSlot ?? "") : "";
    },
    [initialAppointment],
  );

  const availableSlots = useMemo(() => {
    const slots = slotsData?.slots ?? NO_SLOTS;
    const heldSlot = initialSlotFor(doctorId, date);
    return heldSlot && !slots.includes(heldSlot) ? [...slots, heldSlot] : slots;
  }, [slotsData, doctorId, date, initialSlotFor]);

  // The tab screen stays mounted, so a doctor picked on Home arrives as a changed route param.
  useEffect(() => {
    if (!initialAppointment && initialDoctorId) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      setDoctor(initialDoctorId);
      setDate(tomorrow);
      setIsDateSet(true);
    }
  }, [initialDoctorId]);

  const onDateChange = (newDate: Date) => {
    const errorMessage = validateDate(newDate);
    setIsShow(false);
    if (errorMessage === "") {
      setDate(newDate);
      setIsDateSet(true);
      setTimeSlot(initialSlotFor(doctorId, newDate));
      setErrors((prev) => ({ ...prev, date: "" }));
    } else {
      setErrors((prev) => ({ ...prev, date: errorMessage }));
    }
  };

  const setDoctor = (employeeId: string) => {
    setDoctorId(employeeId);
    setTimeSlot(initialSlotFor(employeeId, date));
  };

  const validate = (): boolean => {
    const next = validateAppointment({
      date,
      doctorEmployeeId: doctorId,
      timeSlot,
    });
    setErrors(next);
    return !hasErrors(next);
  };

  const clearFields = () => {
    setTimeSlot("");
    setErrors(EMPTY_ERRORS);
    setIsDateSet(false);
    setDoctorId("");
    setDate(new Date());
  };

  const showValidationError = () =>
    Toast.show({
      type: "error",
      text1: "Validation Failed",
      text2: "Please check the input fields",
    });

  return {
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
    validate,
    showValidationError,
  };
}

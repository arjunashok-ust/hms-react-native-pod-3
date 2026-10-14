import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import { useStoredPatientId } from "@hms/data-access";
import { Doctor, trpc } from "@hms/trpc-client";
import { AppointmentModel, NavigationModel } from "@hms/models";

export interface AppointmentFormErrors {
  date: string;
  doctorEmployeeId: string;
  timeSlot: string;
}

export interface UseAppointmentFormOptions {
  initialAppointment?: AppointmentModel;
  initialDoctorId?: string;
}

const NO_DOCTORS: Doctor[] = [];
const NO_SLOTS: string[] = [];

const EMPTY_ERRORS: AppointmentFormErrors = {
  date: "",
  doctorEmployeeId: "",
  timeSlot: "",
};

const validateDate = (d: Date): string => {
  const input = new Date(d);
  const today = new Date();
  input.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return input <= today
    ? "Appointments cannot be booked for today or past dates."
    : "";
};

const validateDoctorEmployeeId = (id: string): string =>
  id ? "" : "Please select a doctor";

const validateTimeSlot = (slot: string): string =>
  slot ? "" : "Time slot is required";

const maxDateLimit = (): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d;
};

export function useAppointmentForm({
  initialAppointment,
  initialDoctorId,
}: UseAppointmentFormOptions = {}) {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [isShow, setIsShow] = useState(false);
  const [isDateSet, setIsDateSet] = useState(Boolean(initialAppointment));
  const [doctorId, setDoctorId] = useState(
    initialAppointment?.doctorEmployeeId ?? initialDoctorId ?? "",
  );
  const [date, setDate] = useState(
    () =>
      initialAppointment ? new Date(initialAppointment.date) : new Date(),
  );
  const [timeSlot, setTimeSlot] = useState(initialAppointment?.timeSlot ?? "");
  const [errors, setErrors] = useState<AppointmentFormErrors>(EMPTY_ERRORS);

  const storedPatientId = useStoredPatientId();
  const patientId = storedPatientId ?? "";

  const { data: doctors = NO_DOCTORS } = trpc.appointment.getDoctors.useQuery();

  const { data: slotsData } = trpc.user.getAvailableTimeSlots.useQuery(
    { employeeId: doctorId, date },
    { enabled: !!doctorId && isDateSet },
  );

  // When editing, the slot the appointment already holds stays selectable for its own doctor and date.
  const initialSlotFor = (employeeId: string, day: Date): string => {
    if (!initialAppointment) return "";
    const isSameDoctor = initialAppointment.doctorEmployeeId === employeeId;
    const isSameDate =
      new Date(initialAppointment.date).toDateString() === day.toDateString();
    return isSameDoctor && isSameDate ? initialAppointment.timeSlot : "";
  };

  const availableSlots = useMemo(() => {
    const slots = slotsData?.slots ?? NO_SLOTS;
    const heldSlot = initialSlotFor(doctorId, date);
    return heldSlot && !slots.includes(heldSlot) ? [...slots, heldSlot] : slots;
  }, [slotsData, doctorId, date, initialAppointment]);

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

  const validateAppointment = (): boolean => {
    const newErrors: AppointmentFormErrors = {
      doctorEmployeeId: validateDoctorEmployeeId(doctorId),
      date: validateDate(date),
      timeSlot: validateTimeSlot(timeSlot),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

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

  const goToAppointments = () => navigator.navigate("viewAppointment");

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
    validateAppointment,
    showValidationError,
    maxDateLimit,
    goToAppointments,
  };
}

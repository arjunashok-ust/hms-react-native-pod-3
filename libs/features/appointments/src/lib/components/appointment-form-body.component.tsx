import { Text, View, StyleSheet } from "react-native";
import {
  AppointmentInputCard,
  SectionDivider,
  ProfileButton,
  FormHeader,
  DatePicker,
} from "@hms/shared-ui";
import { DoctorHolder } from "./doctor-holder.component";
import { TimeSlotComponent } from "./time-slot.component";
import { Doctor } from "@hms/trpc-client";
import { maxDateLimit } from "../hooks/use-appointment-form";
import type { AppointmentFormErrors } from "../validation/appointment-form.validation";

interface AppointmentFormBodyProps {
  formTitle: string;
  formSubtitle: string;

  patientId: string;
  date: Date;
  isDateSet: boolean;
  onDateChange: (date: Date) => void;
  doctors: Doctor[];
  doctorId: string;
  setDoctor: (id: string) => void;
  availableSlots: string[];
  timeSlot: string;
  setTimeSlot: (slot: string) => void;
  errors: AppointmentFormErrors;

  primaryLabel: string;
  primaryIcon?: string;
  onPrimaryAction: () => void;

  secondaryLabel?: string;
  secondaryIcon?: string;
  onSecondaryAction?: () => void;
}

export function AppointmentFormBody({
  formTitle,
  formSubtitle,
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
  primaryLabel,
  primaryIcon = "add-outline",
  onPrimaryAction,
  secondaryLabel,
  secondaryIcon,
  onSecondaryAction,
}: Readonly<AppointmentFormBodyProps>) {
  return (
    <View style={styles.container}>
      <FormHeader title={formTitle} value={formSubtitle} />

      <AppointmentInputCard
        iconName="card-outline"
        title="PATIENT ID"
        value={patientId}
        getData={() => {
          /* noop */
        }}
        isDisabled
      />

      <SectionDivider title="SCHEDULE" iconName="calendar-outline" />

      <DatePicker
        value={isDateSet ? date : null}
        onChange={onDateChange}
        placeholder="Date"
        iconName="alarm-outline"
        minimumDate={new Date()}
        maximumDate={maxDateLimit()}
      />
      {!!errors.date && (
        <Text style={[styles.text, styles.errorText]}>{errors.date}</Text>
      )}

      {isDateSet && (
        <View>
          <SectionDivider title="DOCTOR" iconName="heart-outline" />

          <DoctorHolder
            doctors={doctors}
            setDoctor={setDoctor}
            selectedDoctor={doctorId}
          />
          {!!errors.doctorEmployeeId && (
            <Text style={[styles.text, styles.errorText]}>
              {errors.doctorEmployeeId}
            </Text>
          )}

          <SectionDivider iconName="flash-outline" title="TIME SLOT" />

          <TimeSlotComponent
            availableSlots={availableSlots}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
          />
          {!!errors.timeSlot && (
            <Text style={[styles.text, styles.errorText]}>
              {errors.timeSlot}
            </Text>
          )}

          <ProfileButton
            title={primaryLabel}
            iconName={primaryIcon}
            onAction={onPrimaryAction}
          />

          {secondaryLabel && onSecondaryAction && (
            <ProfileButton
              title={secondaryLabel}
              iconName={secondaryIcon ?? "close-outline"}
              onAction={onSecondaryAction}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 35,
    margin: 20,
    backgroundColor: "#f2f2f2",
    borderColor: "rgba(207, 75, 255, 0.2)",
    borderWidth: 1,
    paddingBottom: 20,
  },
  text: {
    fontFamily: "Sans",
  },
  errorText: {
    color: "#ef2121",
    fontSize: 13,
    width: "80%",
    borderLeftWidth: 4,
    borderColor: "#cd1717",
    borderRadius: 4,
    marginTop: 5,
    paddingHorizontal: 10,
  },
});

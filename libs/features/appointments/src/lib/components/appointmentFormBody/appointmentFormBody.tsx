import { Text, View, StyleSheet } from "react-native";
import {
  AppointmentInputCard,
  SectionDivider,
  ProfileButton,
  FormHeader,
  DatePicker,
} from "@hms/shared-ui";
import { DoctorHolder } from "../doctorHolder/doctorHolder";
import { TimeSlotComponent } from "../timeSlot/timeSlot";
import { Doctor } from "@hms/trpc-client";
import { maxDateLimit } from "../../hooks/useAppointmentForm";
import type { AppointmentFormErrors } from "../../validation/appointmentFormValidation";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";

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
  const { styles, testId } = useAppointmentContext(
    "appointmentFormBodyContent",
  );
  return (
    <View style={styles.container}>
      <FormHeader title={formTitle} value={formSubtitle} />

      <AppointmentInputCard
        iconName="card-outline"
        title="PATIENT ID"
        value={patientId}
        testID={testId`patientId`}
        getData={() => {
          /* noop */
        }}
        isDisabled
      />

      <SectionDivider title="SCHEDULE" iconName="calendar-outline" />

      <View testID={testId`date`}>
      <DatePicker
        value={isDateSet ? date : null}
        onChange={onDateChange}
        placeholder="Date"
        iconName="alarm-outline"
        minimumDate={new Date()}
        maximumDate={maxDateLimit()}
      />
      </View>
      {!!errors.date && (
        <Text
          style={[styles.text, styles.errorText]}
          testID={testId`dateError`}
        >
          {errors.date}
        </Text>
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
            <Text
              style={[styles.text, styles.errorText]}
              testID={testId`doctorError`}
            >
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
            <Text
              style={[styles.text, styles.errorText]}
              testID={testId`timeSlotError`}
            >
              {errors.timeSlot}
            </Text>
          )}

          <ProfileButton
            title={primaryLabel}
            iconName={primaryIcon}
            onAction={onPrimaryAction}
            testID={testId`primary`}
          />

          {secondaryLabel && onSecondaryAction && (
            <ProfileButton
              title={secondaryLabel}
              iconName={secondaryIcon ?? "close-outline"}
              onAction={onSecondaryAction}
              testID={testId`secondary`}
            />
          )}
        </View>
      )}
    </View>
  );
}

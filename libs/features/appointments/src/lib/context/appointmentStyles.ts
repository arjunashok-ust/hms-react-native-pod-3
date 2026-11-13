import { appointmentCardStyles } from "../components/appointmentCard/appointmentCard.styles";
import { appointmentFormBodyStyles } from "../components/appointmentFormBody/appointmentFormBody.styles";
import { doctorHolderStyles } from "../components/doctorHolder/doctorHolder.styles";
import { timeSlotStyles } from "../components/timeSlot/timeSlot.styles";
import { appointmentEditStyles } from "../screens/appointmentEdit/appointmentEdit.styles";
import { appointmentFormStyles } from "../screens/appointmentForm/appointmentForm.styles";
import { appointmentListStyles } from "../screens/appointmentList/appointmentList.styles";

export const AppointmentStyles = {
  // components
  appointmentCardContent: appointmentCardStyles,
  appointmentFormBodyContent: appointmentFormBodyStyles,
  doctorHolderContent: doctorHolderStyles,
  timeSlotContent: timeSlotStyles,
  // screens
  appointmentEditContent: appointmentEditStyles,
  appointmentFormContent: appointmentFormStyles,
  appointmentListContent: appointmentListStyles,
};

export type AppointmentStyles = typeof AppointmentStyles;

import { View, StyleSheet, Text, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { ProfileButton } from "@hms/shared-ui";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { AppointmentItem, trpc } from "@hms/trpc-client";
import { useInvalidateAppointments } from "../../hooks/useAppointments";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";

interface AppointmentCardProps {
  appointment: AppointmentItem;
  onEdit: (appointment: AppointmentItem) => void;
}

export const AppointmentCardComponent = ({
  appointment,
  onEdit,
}: AppointmentCardProps) => {
  const { styles } = useAppointmentContext("appointmentCardContent");
  const invalidateAppointments = useInvalidateAppointments();

  // Cached per doctor, so cards sharing a doctor trigger a single request.
  const { data: doctor } = trpc.appointment.getDoctorByEmployeeId.useQuery({
    employeeId: appointment.doctorEmployeeId,
  });

  const cancelAppointment = trpc.appointment.editAppointmentStatus.useMutation({
    onSuccess: async ({ message }) => {
      await invalidateAppointments();
      Toast.show({ type: "success", text1: "Success", text2: message });
    },
  });

  const confirmCancel = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () =>
            cancelAppointment.mutate({
              appointmentId: appointment.appointmentId,
              status: "Cancelled",
            }),
        },
      ],
    );
  };

  return (
    <View style={styles.appointmentContainer}>
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentIconAndText}>
          <View style={styles.avatarIcon}>
            <Text style={[styles.avatarText, styles.text]}>
              {doctor?.name?.slice(0, 3).toUpperCase()}
            </Text>
          </View>

          <View style={styles.appointmentTextHolder}>
            <Text
              style={[styles.text, styles.doctorText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {doctor?.name}
            </Text>
            <Text
              style={[styles.text, styles.doctorSubTitle]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {doctor?.specialization ?? ""}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.appointmentStatus,
            appointment.status === "Booked" && styles.booked,
            appointment.status === "Cancelled" && styles.cancelled,
            appointment.status === "Completed" && styles.completed,
            appointment.status === "Pending" && styles.pending,
          ]}
        >
          <Text style={[styles.text, styles.appointmentStatusText]}>
            {appointment.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider}></View>

      <View style={styles.appointmentFooter}>
        <View style={styles.scheduleHolder}>
          <Ionicons
            name="calendar-outline"
            style={styles.appointmentIcon}
            size={20}
          />
          <Text style={[styles.footerText, styles.text]}>
            {new Date(appointment.date).toDateString()}
          </Text>
          <Ionicons
            name="time-outline"
            style={styles.appointmentIcon}
            size={20}
          />
          <Text style={[styles.footerText, styles.text]}>
            {appointment.timeSlot}
          </Text>
        </View>

        <View>
          {appointment.status === "Booked" && (
            <ProfileButton
              iconName="create-outline"
              title="Edit"
              onAction={() => onEdit(appointment)}
            />
          )}
          {appointment.status === "Pending" && (
            <ProfileButton
              iconName="close-outline"
              title="Cancel"
              onAction={confirmCancel}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export const AppointmentCard = memo(AppointmentCardComponent);

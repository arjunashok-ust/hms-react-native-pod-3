import { View, StyleSheet, Text, Alert } from "react-native";
import ProfileButton from "../profile/profile-button.component";
import { Ionicons } from "@expo/vector-icons";
import { UserModel } from "../../types/user.types";
import { useEffect, useState } from "react";
import {
  deleteAppointment,
  getDoctorByEmployeeId,
} from "../../services/appointment.service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../../types/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { showError } from "../../utils/error.utils";

export const AppointmentCard = (props: any) => {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [doctor, setDoctor] = useState<UserModel | null>();

  const fetchDoctor = async () => {
    const data = await getDoctorByEmployeeId(props.doctorEmployeeId);
    setDoctor(data);
  };

  const goToEdit = () => {
    navigator.navigate("editAppointment", {
      appointment: {
        appointmentId: props.appointmentId,
        patientId: props.patientId,
        doctorEmployeeId: props.doctorEmployeeId,
        date: props.date,
        timeSlot: props.timeSlot,
        status: props.status,
        createdByEmployeeId: "",
      },
    });
  };

  useEffect(() => {
    fetchDoctor();
  }, [props.employeeId]);

  const deleteAppointmentByPatient = async () => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const appointmentId: string = props.appointmentId;
              await deleteAppointment(appointmentId);
              props.onDelete?.();
              Alert.alert("Success", "Appointment deleted sucessfully");
            } catch (err) {
              console.error(err);
              showError(err);
            }
          },
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
            <Text style={[styles.text, styles.doctorText]} numberOfLines={1} ellipsizeMode="tail">{doctor?.name}</Text>
            <Text style={[styles.text, styles.doctorSubTitle]} numberOfLines={1} ellipsizeMode="tail">
              {`${doctor?.specialization} ${props.doctorEmployeeId}`}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.appointmentStatus,
            props.status === "Booked" && styles.booked,
            props.status === "Cancelled" && styles.cancelled,
            props.status === "Completed" && styles.completed,
          ]}
        >
          <Text style={[styles.text, styles.appointmentStatusText]}>
            {props.status}
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
            {new Date(props.date).toDateString()}
          </Text>
          <Ionicons
            name="time-outline"
            style={styles.appointmentIcon}
            size={20}
          />
          <Text style={[styles.footerText, styles.text]}>{props.timeSlot}</Text>
        </View>

        <View>
          {props.status === "Booked" && (
            <ProfileButton
              iconName="create-outline"
              title="Edit"
              onAction={goToEdit}
            />
          )}
          <ProfileButton
            iconName="trash-outline"
            title="Delete"
            onAction={deleteAppointmentByPatient}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentContainer: {
    margin: 20,
    backgroundColor: "rgba(179, 17, 168, 0.3)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(250, 92, 255, 0.4)",
    padding: 20,
  },
  avatarIcon: {
    backgroundColor: "rgb(194, 80, 247,0.1)",
    borderRadius: 100,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgb(194, 80, 247,0.4)",
  },
  avatarText: {
    color: "rgba(218, 175, 255, 0.8)",
    fontSize: 14,
    lineHeight: 14,
  },
  doctorText: {
    color: "white",
    fontSize: 16,
    lineHeight: 16,
  },
  doctorSubTitle: {
    color: "rgba(199, 199, 199, 0.9)",
    fontSize: 12,
    lineHeight: 12,
  },
  appointmentStatus: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  booked: {
    backgroundColor: "rgba(28, 255, 172, 0.3)",
    borderColor: "rgba(175, 255, 226, 0.6)",
  },
  cancelled: {
    backgroundColor: "rgba(255, 124, 31, 0.3)",
    borderColor: "rgba(255, 215, 186, 0.6)",
  },
  completed: {
    backgroundColor: "rgba(67, 30, 255, 0.3)",
    borderColor: "rgba(168, 168, 255, 0.6)",
  },
  appointmentStatusText: {
    color: "rgba(171, 255, 224)",
    fontSize: 12,
    lineHeight: 12,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appointmentTextHolder: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  appointmentIconAndText: {
    flexDirection: "row",
  },
  appointmentIcon: {
    color: "rgba(225, 56, 255,0.9)",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 12,
    marginHorizontal: 10,
  },
  appointmentFooter: {
    flexDirection: "column",
  },
  scheduleHolder: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontFamily: "Sans",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 10,
  },
});

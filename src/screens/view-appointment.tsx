const BgImage = require("../../assets/img/cover.jpg");
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppointmentCard } from "../components/appointment/appointment-card.component";
import { useEffect, useState } from "react";
import { AppointmentModel } from "../types/appointment.types";
import ProfileButton from "../components/profile/profile-button.component";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { getAppointmentsByPatientId } from "../services/appointment.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewAppointmentScreen() {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  const goToHome = () => {
    navigator.navigate("tabs", {
      screen: "appointment",
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const patientId = await AsyncStorage.getItem("patientId");
      const data = await getAppointmentsByPatientId(patientId || "");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ImageBackground source={BgImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="View your,"
          text2="APPOINTMENTS"
          text3="here."
        ></WelcomeTextContainer>

        <ProfileButton
          title="GO BACK"
          iconName="arrow-back-outline"
          onAction={goToHome}
        />

        <LinearGradient
          style={styles.container}
          colors={["rgba(165, 35, 45, 0.2)", "rgba(20, 4, 30, 0.9)"]}
        >
          <View style={styles.formHeader}>
            <Ionicons
              name="calendar-outline"
              color={"white"}
              size={25}
              style={styles.formHeaderIcon}
            />
            <View style={styles.formHeaderTextHolder}>
              <Text style={[styles.text, styles.formHeaderTitle]}>
                SCHEDULE
              </Text>
              <Text style={[styles.text, styles.formHeaderValue]}>
                YOUR APPOINTMENTS
              </Text>
            </View>
          </View>

          {appointments.length === 0 && (
            <Text style={[styles.noAppointmentsText, styles.text]}>
              No appointments scheduled.
            </Text>
          )}

          <FlatList
            data={appointments}
            keyExtractor={(item) => item.appointmentId}
            renderItem={({ item }) => {
              return (
                <AppointmentCard
                  doctorEmployeeId={item.doctorEmployeeId}
                  status={item.status}
                  date={item.date}
                  timeSlot={item.timeSlot}
                  appointmentId={item.appointmentId}
                  onAppointmentChange={fetchAppointments}
                />
              );
            }}
          ></FlatList>

        </LinearGradient>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scrollView: {
    height: 400,
  },
  container: {
    flex: 1,
    borderRadius: 35,
    margin: 20,
    borderWidth: 1,
    borderColor: "rgba(248, 37, 255, 0.3)",
    paddingBottom: 20,
  },
  formHeader: {
    padding: 20,
    flexDirection: "row",
  },
  formHeaderIcon: {
    padding: 15,
    backgroundColor: "rgba(247, 17, 255, 0.2)",
    borderRadius: 100,
  },
  formHeaderTextHolder: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  formHeaderTitle: {
    fontSize: 10,
    lineHeight: 18,
    color: "white",
  },
  formHeaderValue: {
    fontSize: 18,
    lineHeight: 18,
    color: "white",
  },
  text: {
    fontFamily: "Sans",
  },
  noAppointmentsText: {
    color: "white",
    fontSize: 12,
    lineHeight: 12,
    textAlign: "center",
    backgroundColor: "rgba(255, 0, 221, 0.3)",
    padding: 10,
  },
});

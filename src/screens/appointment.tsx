const BgImage = require("../../assets/img/cover.jpg");
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppointmentInputCard } from "../components/appointment/appointment-input-card.component";
import { SectionDivider } from "../components/profile/section-divider.component";
import { Picker } from "@react-native-picker/picker";
import { TimeSlotHolder } from "../components/profile/time-slot-holder";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getAvailableTimeSlots, getDoctors } from "../services/user.service";
import { UserModel } from "../types/user.types";
import DateTimePicker from "@react-native-community/datetimepicker";
import ProfileButton from "../components/profile/profile-button.component";
import { createAppointment } from "../services/appointment.service";
import { AppointmentModel } from "../types/appointment.types";
import { showError } from "../utils/error.utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppointmentScreen() {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [doctors, setDoctors] = useState<UserModel[]>([]);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isDateSet, setIsDateSet] = useState<boolean>(false);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState({
    date: "",
    doctorEmployeeId: "",
    timeSlot: "",
  });

  useEffect(() => {
    const setData = async () => {
      await fetchDoctors();
      const patientId = await getPatientId();
      setPatientId(patientId ?? "");
    };
    setData();
  }, []);

  useEffect(() => {
    if (doctorId && isDateSet) {
      fetchAvailableTimeSlots();
    }
  }, [doctorId, date, isDateSet]);

  const getPatientId = async () => {
    const patientId = await AsyncStorage.getItem("patientId");
    return patientId;
  };

  const fetchDoctors = async () => {
    const doctors = await getDoctors();
    setDoctors(doctors);
  };

  const onDateChange = (date: Date) => {
    setDate(date);
    setIsDateSet(true);
    setIsShow(false);
  };

  const setDoctor = (employeeId: string) => {
    setAvailableSlots([]);
    setDoctorId(employeeId);
  };

  const fetchAvailableTimeSlots = async () => {
    const data = await getAvailableTimeSlots(doctorId, date);
    setAvailableSlots(data);
  };

  const clearFields = () => {
    setTimeSlot("");
    setAvailableSlots([]);
    setIsDateSet(false);
    setDoctorId("");
    setDate(new Date());
  };

  const validateDoctorEmployeeId = (doctorEmployeeId: string) => {
    if (!doctorEmployeeId) {
      return "Doctor ID is required";
    }
  };

  const validateDate = (dob: Date) => {
    const inputDate = new Date(dob);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate <= today) {
      return "You can't book appointments in past";
    }
  };

  const validateTimeSlot = (slot: string) => {
    if (!slot) {
      return "Time slot is required";
    }
  };

  const validateAppointment = () => {
    let newErrors = {
      doctorEmployeeId: validateDoctorEmployeeId(doctorId) ?? "",
      date: validateDate(date) ?? "",
      timeSlot: validateTimeSlot(timeSlot) ?? "",
    };

    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      return true;
    } else {
      return false;
    }
  };

  const goToAppointments = () => {
    navigator.navigate("viewAppointment");
  }

  const sendAppointment = async () => {
    const isValid = validateAppointment();
    if (!isValid) return;
    try {
      const payload: AppointmentModel = {
        appointmentId: "",
        status: "",
        patientId: patientId,
        doctorEmployeeId: doctorId,
        timeSlot: timeSlot,
        date: date,
        createdByEmployeeId: patientId,
      };
      await createAppointment(payload);
      Alert.alert("Appointment Created Sucessfully.");
      clearFields();
    } catch (err) {
      console.error(err);
      showError(err);
    }
  };

  return (
    <ImageBackground source={BgImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="Create your,"
          text2="APPOINTMENT"
          text3="here."
        ></WelcomeTextContainer>
        <ScrollView style={styles.scrollView}>
          <LinearGradient
            style={styles.container}
            colors={["rgba(255, 61, 77, 0.2)", "rgba(20, 4, 30, 0.9)"]}
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
                  NEW ENTRY
                </Text>
                <Text style={[styles.text, styles.formHeaderValue]}>
                  Book Appointment
                </Text>
              </View>
            </View>
            <AppointmentInputCard
              iconName="card-outline"
              title="PATIENT ID"
              value={patientId}
              getData={() => {}}
              isDisabled={true}
            />
            <SectionDivider
              title="SCHEDULE"
              iconName="calendar-outline"
            ></SectionDivider>
            <TouchableOpacity
              onPress={() => {
                setIsShow(true);
              }}
              style={styles.dateHolder}
            >
              <View style={styles.dateHeader}>
                <Ionicons
                  name="alarm-outline"
                  size={22}
                  color={"white"}
                  style={styles.dateIcon}
                />
                <Text style={[styles.dateTitle, styles.text]}>
                  {isDateSet ? date.toDateString() : "Date"}
                </Text>
              </View>
              <Ionicons name="chevron-down-outline" size={22} color={"white"} />
            </TouchableOpacity>
            {isDateSet && (
              <View>
                <SectionDivider
                  title="DOCTOR"
                  iconName="heart-outline"
                ></SectionDivider>
                <View style={styles.dropdownHolder}>
                  <Ionicons
                    name="medkit-outline"
                    color="white"
                    size={22}
                    style={styles.dropDownIcon}
                  />
                  <Picker
                    style={styles.picker}
                    dropdownIconColor="white"
                    onValueChange={(value: string) => setDoctor(value)}
                  >
                    <Picker.Item label="Doctor" value="" />
                    {doctors.map((doctor: UserModel) => (
                      <Picker.Item
                        key={doctor.employeeCode}
                        label={doctor.name}
                        value={doctor.employeeCode}
                      />
                    ))}
                  </Picker>
                </View>
                <SectionDivider iconName="flash-outline" title="TIME SLOT" />
                <View style={styles.timeSlotContainer}>
                  {availableSlots.length === 0 ? (
                    <Text style={[styles.text, styles.slotText]}>
                      No slot available at this moment
                    </Text>
                  ) : (
                    availableSlots.map((slot, index) => {
                      return (
                        <TimeSlotHolder
                          slot={slot}
                          onAction={(value: string) => {
                            setTimeSlot(value);
                          }}
                          id={slot}
                          key={slot}
                          isSelected={timeSlot === slot}
                        />
                      );
                    })
                  )}
                </View>
                <ProfileButton
                  title="CREATE"
                  iconName="add-outline"
                  onAction={sendAppointment}
                />
                <ProfileButton
                  title="CLEAR"
                  iconName="close-outline"
                  onAction={clearFields}
                />
              </View>
            )}
          </LinearGradient>
        </ScrollView>
        <ProfileButton
          title="VIEW APPOINTMENTS"
          iconName="eye-outline"
          onAction={goToAppointments}
        />
        {isShow && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, value) => {
              if (value) onDateChange(value);
            }}
          />
        )}
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
    height: 450,
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
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  dropdownHolder: {
    borderBottomWidth: 1,
    backgroundColor: "rgba(68, 68, 68, 0.8)",
    borderColor: "black",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    color: "white",
    fontFamily: "Sans",
  },
  dropDownIcon: {
    padding: 10,
    backgroundColor: "rgba(119, 119, 119, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  timeSlotContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dateHolder: {
    flexDirection: "row",
    backgroundColor: "rgba(62, 62, 62, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTitle: {
    color: "white",
    fontFamily: "Sans",
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 10,
  },
  dateIcon: {
    backgroundColor: "rgb(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 10,
  },
  slotText: {
    color: "white",
    backgroundColor: "rgba(101, 101, 101, 0.3)",
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 15,
    lineHeight: 15,
    marginTop: 20,
  },
});

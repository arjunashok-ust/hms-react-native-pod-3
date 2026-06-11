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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppointmentScreen() {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [doctors, setDoctors] = useState<UserModel[]>([]);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isDateSet, setIsDateSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    try {
      const doctors = await getDoctors();
      setDoctors(doctors);
    } catch (err) {
      console.error(err);
    }
  };

  const onDateChange = (date: Date) => {
    const errorMessage = validateDate(date);

    if (errorMessage === "") {
      setDate(date);
      setIsDateSet(true);
      setIsShow(false);
      setErrors((prev) => ({ ...prev, date: "" }));
    } else {
      setErrors((prev) => ({ ...prev, date: errorMessage ?? "" }));
      setIsShow(false);
    }
  };

  const setDoctor = (employeeId: string) => {
    setAvailableSlots([]);
    setDoctorId(employeeId);
  };

  const fetchAvailableTimeSlots = async () => {
    try {
      const data = await getAvailableTimeSlots(doctorId, date);
      setAvailableSlots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearFields = () => {
    setTimeSlot("");
    setErrors({
      date: "",
      doctorEmployeeId: "",
      timeSlot: "",
    });
    setAvailableSlots([]);
    setIsDateSet(false);
    setDoctorId("");
    setDate(new Date());
  };

  const validateDoctorEmployeeId = (doctorEmployeeId: string) => {
    if (!doctorEmployeeId) {
      return "Please select a doctor";
    }
    return "";
  };

  const validateDate = (dob: Date) => {
    const inputDate = new Date(dob);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate <= today) {
      return "Appointments cannot be booked for today or past dates.";
    }
    return "";
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
  };
  // send appointment
  const sendAppointment = async () => {
    const isValid = validateAppointment();
    if (!isValid)
      return Alert.alert("Validation failed,please check your inputs.");

    try {
      setIsLoading(true);

      const payload: AppointmentModel = {
        appointmentId: "",
        status: "Pending",
        patientId: patientId,
        doctorEmployeeId: doctorId,
        timeSlot: timeSlot,
        date: date,
        createdByEmployeeId: patientId,
      };

      const response = await createAppointment(payload);

      Alert.alert("Success", response?.data?.message);
      clearFields();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
          <View
            style={styles.container}
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
                  color={"#cfcfcf"}
                  style={styles.dateIcon}
                />
                <Text style={[styles.dateTitle, styles.text]}>
                  {isDateSet ? date.toDateString() : "Date"}
                </Text>
              </View>
              <Ionicons name="chevron-down-outline" size={22} color={"white"} />
            </TouchableOpacity>

            {!!errors.date && (
              <Text style={[styles.text, styles.errorText]}>{errors.date}</Text>
            )}

            {isDateSet && (
              <View>
                <SectionDivider
                  title="DOCTOR"
                  iconName="heart-outline"
                ></SectionDivider>

                <View style={styles.dropdownHolder}>
                  <Ionicons
                    name="medkit-outline"
                    color="#cfcfcf"
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

                {!!errors.doctorEmployeeId && (
                  <Text style={[styles.text, styles.errorText]}>
                    {errors.doctorEmployeeId}
                  </Text>
                )}

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
                {!!errors.timeSlot && (
                  <Text style={[styles.text, styles.errorText]}>
                    {errors.timeSlot}
                  </Text>
                )}

                <ProfileButton
                  title={isLoading?"CREATING...":"CREATE"}
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
          </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  scrollView: {
    height: 450,
  },
  container: {
    flex: 1,
    borderRadius: 35,
    margin: 20,
    backgroundColor: "#f2f2f2",
    borderColor: "rgba(207, 75, 255, 0.2)",
    borderWidth: 1,
    paddingBottom: 20,
  },
  formHeader: {
    padding: 20,
    flexDirection: "row",
  },
  formHeaderIcon: {
    padding: 15,
    backgroundColor: "rgb(108, 19, 109)",
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
    color: "#909090",
  },
  formHeaderValue: {
    fontSize: 18,
    lineHeight: 18,
    color: "#505050",
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
    backgroundColor: "rgb(222, 222, 222)",
    borderWidth: 1,
    borderColor: "rgba(83, 11, 107, 0.3)",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    marginLeft: 3,
    color: "rgb(39, 39, 39)",
    fontFamily: "Sans",
  },
  dropDownIcon: {
    padding: 10,
    backgroundColor: "rgb(108, 19, 109)",
    borderWidth: 1,
    borderColor: "rgba(198, 53, 255, 0.2)",
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
    backgroundColor: "rgb(222, 222, 222)",
    borderWidth: 1,
    borderColor: "rgba(83, 11, 107, 0.3)",
    borderRadius: 10,
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
    color: "rgb(39, 39, 39)",
    fontFamily: "Sans",
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 13,
  },
  dateIcon: {
    backgroundColor: "rgb(108, 19, 109)",
    borderWidth: 1,
    borderColor: "rgba(198, 53, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
  },
  slotText: {
    color: "#767676",
    backgroundColor: "rgb(222, 222, 222)",
    borderWidth: 1,
    borderColor: "rgba(83, 11, 107, 0.3)",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 20,
    fontSize: 15,
    lineHeight: 15,
    marginTop: 20,
  },
  errorText: {
    color: "#3b3b3b",
    fontSize: 13,
    width: "80%",
    borderLeftWidth: 4,
    borderColor: "#4c1c77",
    borderRadius: 4,
    marginTop:5,
    paddingHorizontal: 10,
    marginHorizontal:20,
  },
});

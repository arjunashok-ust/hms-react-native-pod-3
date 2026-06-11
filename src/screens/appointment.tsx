const BgImage = require("../../assets/img/cover.jpg");
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { AppointmentInputCard } from "../components/appointment/appointment-input-card.component";
import { SectionDivider } from "../components/profile/section-divider.component";
import { useEffect, useState } from "react";
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
import Toast from "react-native-toast-message";
import DoctorHolder from "../components/appointment/doctor-holder.component";
import TimeSlotComponent from "../components/appointment/time-slot.component";
import { DateHolder } from "../components/appointment/date-holder.component";
import { FormHeader } from "../components/appointment/form-header.component";

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
      Toast.show({
        type: "error",
        text1: "Validation Failed",
        text2: "Please check the input fields",
      });

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

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response?.data?.message,
      });
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
          <View style={styles.container}>
            <FormHeader title="NEW ENTRY" value="Book Appointment"/>

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

            <DateHolder
              date={date}
              isDateSet={isDateSet}
              setIsShow={setIsShow}
            />
            {!!errors.date && (
              <Text style={[styles.text, styles.errorText]}>{errors.date}</Text>
            )}

            {isDateSet && (
              <View>
                <SectionDivider
                  title="DOCTOR"
                  iconName="heart-outline"
                ></SectionDivider>

                <DoctorHolder doctors={doctors} setDoctor={setDoctor} />
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
                  title={isLoading ? "CREATING..." : "CREATE"}
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
  text: {
    fontFamily: "Sans",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  errorText: {
    color: "#3b3b3b",
    fontSize: 13,
    width: "80%",
    borderLeftWidth: 4,
    borderColor: "#4c1c77",
    borderRadius: 4,
    marginTop: 5,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
});

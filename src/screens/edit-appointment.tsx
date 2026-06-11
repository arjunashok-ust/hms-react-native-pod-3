const BgImage = require("../../assets/img/cover.jpg");
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { AppointmentInputCard } from "../components/appointment/appointment-input-card.component";
import { SectionDivider } from "../components/profile/section-divider.component";
import { useEffect, useState } from "react";
import { getAvailableTimeSlots, getDoctors } from "../services/user.service";
import { UserModel } from "../types/user.types";
import DateTimePicker from "@react-native-community/datetimepicker";
import ProfileButton from "../components/profile/profile-button.component";
import {
  editAppointmentData,
  editAppointmentStatus,
} from "../services/appointment.service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { DateHolder } from "../components/appointment/date-holder.component";
import DoctorHolder from "../components/appointment/doctor-holder.component";
import TimeSlotComponent from "../components/appointment/time-slot.component";
import { FormHeader } from "../components/appointment/form-header.component";

export default function EditAppointmentScreen() {
  const route = useRoute<RouteProp<NavigationModel, "editAppointment">>();
  const { appointment } = route.params;

  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [doctors, setDoctors] = useState<UserModel[]>([]);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isDateSet, setIsDateSet] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [timeSlot, setTimeSlot] = useState(appointment.timeSlot);
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
      if (appointment) {
        setTimeSlot(appointment.timeSlot);
        setDate(new Date(appointment.date));
        setIsDateSet(true);
      }
    };
    setData();
  }, []);

  useEffect(() => {
    if (doctors.length > 0 && appointment) {
      setDoctorId(appointment.doctorEmployeeId);
    }
  }, [doctors]);

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
    return doctors;
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
    const data = await getAvailableTimeSlots(doctorId, date);
    const isSameDoctor: boolean = appointment.doctorEmployeeId === doctorId;
    const isSameDate: boolean =
      new Date(appointment.date).toDateString() === date.toDateString();
    // add booked slot back to doctor time slot and make it selected
    if (isSameDoctor && isSameDate) {
      if (data.includes(appointment.timeSlot)) {
        setAvailableSlots(data);
      } else {
        setAvailableSlots([...data, appointment.timeSlot]);
      }
      setTimeSlot(appointment.timeSlot);
    } else {
      setAvailableSlots(data);
      setTimeSlot("");
    }
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

  const cancelAppointment = async () => {
    const payload = {
      appointmentId: appointment.appointmentId,
      status: "Cancelled",
    };
    try {
      setIsCancelLoading(true);
      const response = await editAppointmentStatus(payload);
      Alert.alert("Success", response?.data?.message);
      navigator.navigate("viewAppointment");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelLoading(false);
    }
  };

  const editAppointment = async () => {
    const valid = validateAppointment();

    if (!valid)
      return Toast.show({
        type: "error",
        text1: "Validation Failed",
        text2: "Please check the input fields",
      });

    try {
      setIsLoading(true);
      const payload = {
        appointmentId: appointment.appointmentId,
        patientId: patientId,
        doctorEmployeeId: doctorId,
        timeSlot: timeSlot,
        date: date,
        status: "Pending",
      };
      const response = await editAppointmentData(payload);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response?.data?.message,
      });
      navigator.navigate("viewAppointment");
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
          text1="Edit your,"
          text2="APPOINTMENT"
          text3="here."
        ></WelcomeTextContainer>

        <ProfileButton
          title="GO BACK"
          iconName="arrow-back-outline"
          onAction={goToAppointments}
        />

        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <FormHeader title="MODIFY ENTRY" value="Edit Appointment" />

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
              setIsShow={setIsShow}
              isDateSet={isDateSet}
            />
            {!!errors.date && (
              <Text style={[styles.text, styles.errorText]}>{errors.date}</Text>
            )}

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
                setTimeSlot={setTimeSlot}
                timeSlot={timeSlot}
              />
              {!!errors.timeSlot && (
                <Text style={[styles.text, styles.errorText]}>
                  {errors.timeSlot}
                </Text>
              )}

              <ProfileButton
                title={isLoading ? "SAVING..." : "SAVE"}
                iconName="add-outline"
                onAction={editAppointment}
              />
            </View>
          </View>
        </ScrollView>
        <ProfileButton
          title={isCancelLoading ? "CANCELING..." : "CANCEL APPOINTMENT"}
          iconName="close-outline"
          onAction={cancelAppointment}
        />
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
  },
  changeText: {
    color: "white",
    fontSize: 12,
    lineHeight: 12,
    padding: 5,
  },
});

const BgImage = require("../../assets/img/cover.jpg");
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { Ionicons } from "@expo/vector-icons";
import { AppointmentInputCard } from "../components/appointment/appointment-input-card.component";
import { SectionDivider } from "../components/profile/section-divider.component";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../services/user.service";
import { PatientModel } from "../types/user.types";
import DateTimePicker from "@react-native-community/datetimepicker";
import ProfileButton from "../components/profile/profile-button.component";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date>(new Date());
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
  });

  const nameRegex = /^[a-z ]*$/i;
  const emailRegex = /^[a-z0-9_.]+@[a-z0-9]+\.[a-z]{2,}$/i;
  const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;
  const addressRegex = /^[\w\s.,#/-]{2,200}$/;

  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      const data = await getPatientProfile(email ?? "");
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const setData = async (data: PatientModel) => {
    try {
      const inputDate = new Date(data?.dob ?? "");
      setPatientId(data?.uhid ?? "");
      setName(data?.name ?? "");
      setGender(data?.gender ?? "");
      setDob(inputDate);
      setEmail(data?.email ?? "");
      setAddress(data?.address ?? "");
      setPhone(data?.phone ?? "");
      setEmergencyContact(data?.emergencyContact ?? "Emergency Contact");
    } catch (err) {
      console.error(err);
    }
  };

  const validateName = (name: string) => {
    if (!name) return "Name is required.";
    if (!nameRegex.test(name)) return "Only characters are allowed.";
    if (name.length < 2) return "Minimum 2 characters are required.";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Email is invalid";
    return "";
  };

  const validatePhone = (value: string, isConfirmPhone: boolean) => {
    if (isConfirmPhone && !value) return "";
    if (!value) return "Phone is required.";
    if (!phoneRegex.test(value)) return "Invalid number format.";
    if (value === phone && isConfirmPhone)
      return "Emergency contact must be different from the primary contact number.";
    return "";
  };

  const validateDob = (dob: any) => {
    let inputDate = new Date(dob);
    let today = new Date();

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    // initially dob is set to Date()
    if (inputDate.getTime() === today.getTime()) return "DOB is required";

    if (inputDate > today) return "Future date are not allowed.";
    return "";
  };

  const validateGender = (value: string) => {
    if (!value) {
      return "Gender is required.";
    }
    return "";
  };

  const validateAddress = (value: string) => {
    if (!value) {
      return "Address is required";
    }
    if (!addressRegex.test(value)) {
      return "Address field is invalid";
    }
    return "";
  };

  const goToProfile = () => {
    navigator.navigate("tabs", {
      screen: "profile",
    });
  };

  const onDateChange = (date: Date) => {
    setDob(date);
    setIsShow(false);
  };

  const validateUpdateProfile = () => {
    let newErrors = {
      name: validateName(name),
      gender: validateGender(gender),
      dob: validateDob(dob),
      email: validateEmail(email),
      address: validateAddress(address),
      phone: validatePhone(phone, false),
      emergencyContact: validatePhone(emergencyContact, true),
    };

    setErrors(newErrors);

    const valid = Object.values(newErrors).every((error) => error === "");
    return valid;
  };

  const updateProfile = async () => {
    const isValid = validateUpdateProfile();

    if (!isValid)
      return Toast.show({
        type: "error",
        text1: "Validation Failed",
        text2: "Please check the input fields",
      });

    const payload = {
      patientId: patientId,
      name: name,
      gender: gender,
      dob: dob,
      address: address,
      emergencyContact: emergencyContact,
    };

    try {
      setIsLoading(true);
      await updatePatientProfile(payload);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Patient profile updated successfully",
      });
      navigator.navigate("tabs", {
        screen: "profile",
      });
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
          text2="PROFILE"
          text3="here."
        ></WelcomeTextContainer>

        <ProfileButton
          title="GO BACK"
          iconName="arrow-back-outline"
          onAction={goToProfile}
        />

        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.formHeader}>
              <Ionicons
                name="calendar-outline"
                color={"#d6d6d6"}
                size={25}
                style={styles.formHeaderIcon}
              />
              <View style={styles.formHeaderTextHolder}>
                <Text style={[styles.text, styles.formHeaderTitle]}>
                  UPDATE ENTRY
                </Text>
                <Text style={[styles.text, styles.formHeaderValue]}>
                  Edit Profile
                </Text>
              </View>
            </View>
            <SectionDivider
              title="PERSONAL INFO"
              iconName="person-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="card-outline"
              title="Name"
              value={name}
              getData={(value: string) => {
                setName(value);
              }}
              isDisabled={false}
            />
            {!!errors.name && (
              <Text style={[styles.text, styles.errorText]}>{errors.name}</Text>
            )}
            <Text style={[styles.text, styles.placeholderText]}>Gender</Text>
            <View style={styles.dropdownHolder}>
              <Ionicons
                name="person-outline"
                size={22}
                color={"#cfcfcf"}
                style={styles.appointmentIcon}
              />
              <Picker
                selectedValue={gender}
                onValueChange={(value) => {
                  setGender(value);
                }}
                style={styles.picker}
                dropdownIconColor="#000000"
              >
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {!!errors.gender && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.gender}
              </Text>
            )}
            <Text style={[styles.text, styles.placeholderText]}>DOB</Text>
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
                  {dob ? dob?.toDateString() : "DOB"}
                </Text>
              </View>
              <Ionicons
                name="chevron-down-outline"
                size={15}
                color={"black"}
                style={{ marginRight: 13 }}
              />
            </TouchableOpacity>
            {!!errors.dob && (
              <Text style={[styles.text, styles.errorText]}>{errors.dob}</Text>
            )}
            <SectionDivider
              title="CONTACT INFO"
              iconName="call-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="mail-outline"
              title="Email"
              value={email}
              getData={(value: string) => {
                setEmail(value);
              }}
              isDisabled={true}
            />
            {!!errors.email && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.email}
              </Text>
            )}
            <AppointmentInputCard
              iconName="location-outline"
              title="Address"
              value={address}
              getData={(value: string) => {
                setAddress(value);
              }}
              isDisabled={false}
            />
            {!!errors.address && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.address}
              </Text>
            )}
            <AppointmentInputCard
              iconName="call-outline"
              title="Phone"
              value={phone}
              getData={() => {}}
              isDisabled={true}
            />
            {!!errors.phone && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.phone}
              </Text>
            )}
            <AppointmentInputCard
              iconName="medical-outline"
              title="Emergency Contact"
              value={emergencyContact}
              getData={(value: string) => {
                setEmergencyContact(value);
              }}
              isDisabled={false}
            />
            {!!errors.emergencyContact && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.emergencyContact}
              </Text>
            )}
            <ProfileButton
              title={isLoading ? "UPDATING..." : "UPDATE PROFILE"}
              iconName="arrow-back-outline"
              onAction={updateProfile}
            />
            <ProfileButton
              title="CANCEL"
              iconName="close-outline"
              onAction={goToProfile}
            />
          </View>
        </ScrollView>
      </View>
      {isShow && (
        <DateTimePicker
          value={dob}
          mode="date"
          onChange={(event, value) => {
            if (value) onDateChange(value);
          }}
        />
      )}
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
    marginVertical: 10,
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    color: "rgb(39, 39, 39)",
    fontFamily: "Sans",
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 3,
  },
  dropDownIcon: {
    padding: 10,
    backgroundColor: "rgba(119, 119, 119, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
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
    marginLeft: 10,
  },
  dateIcon: {
    backgroundColor: "rgb(108, 19, 109)",
    borderWidth: 1,
    borderColor: "rgba(198, 53, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
  },
  placeholderText: {
    color: "rgb(139, 139, 139)",
    fontSize: 12,
    lineHeight: 12,
    marginHorizontal: 20,
  },
  appointmentIcon: {
    backgroundColor: "rgb(108, 19, 109)",
    borderWidth: 1,
    borderColor: "rgba(198, 53, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
  },
});

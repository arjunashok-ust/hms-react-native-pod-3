import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthInputText } from "../components/auth/auth-input-text";
import { AuthSubmitButton } from "../components/auth/auth-submit-button";
import BgImage from "../../assets/img/cover.jpg";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SignUpRequestModel } from "../types/auth.types";
import { signUp } from "../services/auth.service";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";

export default function SignUpScreen() {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [isDobSet, setIsDobSet] = useState(false);
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [status, setStatus] = useState("Pending");

  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    address: "",
    dob: "",
    emergencyContact: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const nameRegex = /^[a-z ]+( [a-z])*$/i;
  const emailRegex = /^[a-z0-9_.]+@[a-z0-9]+\.[a-z]{2,}$/i;
  const phoneRegex = /^\d*$/;

  const onDateChange = (event: DateTimePickerEvent, selectedDob?: any) => {
    setShow(false);
    setIsDobSet(true);
    if (selectedDob) setDob(selectedDob);
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

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Minimum 8 characters are required.";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return "Confirm Password is required.";
    if (password != confirmPassword) return "Passwords doesnt match.";
    return "";
  };

  const validatePhone = (value: string, isConfirmPhone: boolean) => {
    if (isConfirmPhone && !value) return "";
    if (!value) return "Phone is required.";
    if (!phoneRegex.test(value)) return "Only digits are allowed.";
    if (value.length > 10) return "Maximum 10 digits are allowed.";
    if (value.length < 10) return "Please enter a valid 10 digit number.";
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

  const validateRequired = (value: string, fieldName: string) => {
    if (!value) return `${fieldName} is required.`;
    return "";
  };

  const validateSignUp = () => {
    let newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
      phone: validatePhone(phone, false),
      gender: validateRequired(gender, "Gender"),
      address: validateRequired(address, "Address"),
      dob: validateDob(dob),
      emergencyContact: validatePhone(emergencyContact, true),
    };

    setErrors(newErrors);
    // check for no errors
    const isValid = Object.values(newErrors).every((error) => error === "");
    setIsFormValid(isValid);
    return isValid;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setGender("");
    setDob(new Date());
    setAddress("");
    setIsDobSet(false);
    setEmergencyContact("");
    setStatus("");
    setShow(false);
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "",
      address: "",
      dob: "",
      emergencyContact: "",
    });
    setIsFormValid(false);
  };

  const sendSignUp = () => {
    const validForm = validateSignUp();
    if (validForm) {
      setStatus("Pending");
      const payload: SignUpRequestModel = {
        name: name,
        email: email,
        role: "Patient",
        status: status,
        password: password,
        phone: phone,
        gender: gender,
        address: address,
        dob: dob,
        emergencyContact: emergencyContact,
      };
      // api call to server
      signUp(payload);
      Alert.alert("Success", "Account created sucessfully.");
      navigator.navigate("login");
    } else {
      Alert.alert(
        "Validation failed.",
        "Please check your input and try again.",
      );
    }
  };

  return (
    <ImageBackground source={BgImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="New To,"
          text2="HMS?"
          text3="Create your account to get started."
          isHome={false}
        />
        <View style={styles.container}>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          >
            <AuthInputText
              innerText="Name"
              getData={(value: string) => setName(value)}
            />
            {!!errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            <AuthInputText
              innerText="Email"
              getData={(value: string) => setEmail(value)}
            />
            {!!errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <AuthInputText
              innerText="Password"
              isPassword={true}
              getData={(value: string) => setPassword(value)}
            />
            {!!errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <AuthInputText
              innerText="Confirm Password"
              isPassword={true}
              getData={(value: string) => setConfirmPassword(value)}
            />
            {!!errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            <AuthInputText
              innerText="Phone"
              getData={(value: string) => setPhone(value)}
            />
            {!!errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
            <View style={styles.dropdownHolder}>
              <Picker
                selectedValue={gender}
                onValueChange={(value) => {
                  if (value != "") setGender(value);
                }}
                style={styles.picker}
                dropdownIconColor="white"
              >
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {!!errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}
            <AuthInputText
              innerText="Address"
              getData={(value: string) => setAddress(value)}
            />
            {!!errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={styles.dropdownHolder}
            >
              <Text style={styles.dobText}>
                {isDobSet ? dob.toDateString() : "DOB"}
              </Text>
              {show && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  onChange={onDateChange}
                />
              )}
            </TouchableOpacity>
            {!!errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
            <AuthInputText
              innerText="Emergency Contact"
              getData={(value: string) => setEmergencyContact(value)}
            />
            {!!errors.emergencyContact && (
              <Text style={styles.errorText}>{errors.emergencyContact}</Text>
            )}
            <AuthSubmitButton titleText="Signup" onSubmit={sendSignUp} />
            <TouchableOpacity
              style={styles.signUpFooter}
              onPress={() => navigator.navigate("login")}
            >
              <Text style={styles.signUpFooterText}>
                Already have an account?
              </Text>
              <Text style={[styles.signUpFooterText, styles.login]}> Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
    backgroundColor: "rgb(0,0,0,0.7)",
    justifyContent: "space-between",
  },

  welcomeTextContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 100,
    marginHorizontal: 20,
    padding: 10,
    height: "10%",
  },
  loginText: {
    fontFamily: "Sans",
    color: "white",
  },
  loginTextWelcome: {
    fontSize: 38,
    lineHeight: 38,
  },
  loginTextMain: {
    fontSize: 48,
    lineHeight: 48,
    color: "rgb(255, 107, 107)",
  },
  loginTextSub: {
    fontSize: 12,
    lineHeight: 12,
    marginVertical: 10,
    backgroundColor: "rgb(255, 255, 255,0.1)",
    padding: 10,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255,0.2)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: "center",
  },
  errorText: {
    color: "rgb(255, 107, 107)",
    fontSize: 13,
    width: "80%",
    borderLeftWidth: 4,
    borderColor: "white",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  dropdownHolder: {
    borderBottomWidth: 3,
    borderColor: "rgb(255, 215, 215)",
    width: "80%",
    height: 50,
    marginVertical: 10,
    borderRadius: 2,
  },
  picker: {
    color: "white",
    marginTop: -12,
  },
  dobText: {
    fontFamily: "Sans",
    fontSize: 16,
    color: "white",
    paddingHorizontal: 12,
  },
  signUpFooter: {
    marginTop: 40,
    flexDirection: "row",
  },
  signUpFooterText: {
    color: "white",
    fontFamily: "Sans",
    fontSize: 14,
  },
  login: {
    color: "rgb(255, 107, 107)",
  },
});

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/navigationTypes";
import { useState } from "react";
import { trpc } from "@hms/trpc-client";
import {
  maxDobLimit,
  minDobLimit,
  validateConfirmPassword,
  validateDob,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
  validateRequired,
} from "@hms/shared-util";
import { BLOOD_GROUPS, GENDERS } from "@hms/models";
import Toast from "react-native-toast-message";
import { useAuthenticationContext } from "../../hooks/useAuthenticationContext";

export function useSignUp() {
  const { styles, content } = useAuthenticationContext("signupContent");
  const navigator =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [isDobSet, setIsDobSet] = useState(false);
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [status, setStatus] = useState("Active");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    address: "",
    bloodGroup: "",
    dob: "",
    emergencyContact: "",
  });

  const signUpMutation = trpc.auth.patientSignUp.useMutation();

  const onDobChange = (selectedDob: Date) => {
    setDob(selectedDob);
    setIsDobSet(true);
  };

  const validateSignUp = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
      phone: validatePhone(phone),
      gender: validateRequired(gender, content.requiredLabels.gender),
      address: validateRequired(address, content.requiredLabels.address),
      bloodGroup: validateRequired(
        bloodGroup,
        content.requiredLabels.bloodGroup,
      ),
      dob: validateDob(dob),
      emergencyContact: validatePhone(phone, emergencyContact),
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    return isValid;
  };

  const sendSignUp = async () => {
    const validForm = validateSignUp();
    if (validForm) {
      try {
        setIsLoading(true);

        await signUpMutation.mutateAsync({
          name,
          email,
          status: "Active",
          password,
          phone,
          gender: gender as (typeof GENDERS)[number],
          address,
          bloodGroup: bloodGroup as (typeof BLOOD_GROUPS)[number],
          allergies,
          dob,
          emergencyContact,
        });

        Toast.show({
          type: "success",
          text1: content.toast.success.title,
          text2: content.toast.success.message,
        });
        navigator.navigate("login");
      } catch (err) {
        // global mutation cache already toasts the error
      } finally {
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: content.toast.validationFailed.title,
        text2: content.toast.validationFailed.message,
      });
    }
  };

  return {
    styles,
    content,
    errors,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setPhone,
    setGender,
    setAddress,
    setBloodGroup,
    setAllergies,
    minDobLimit,
    maxDobLimit,
    setEmergencyContact,
    isLoading,
    navigator,
    gender,
    bloodGroup,
    isDobSet,
    dob,
    onDobChange,
    sendSignUp
  };
}

const BgImage = require("../../assets/img/cover.jpg");
import { useState } from "react";
import { LoginRequestModel } from "../types/auth.types";
import { login } from "../services/auth.service";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { AuthInputText } from "../components/auth/auth-input-text";
import { AuthSubmitButton } from "../components/auth/auth-submit-button";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "../types/navigation.types";

export default function LoginScreen() {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email, password });
  const [isFormValid, setFormStatus] = useState<boolean>(false);

  const validateForm = () => {
    let error = { email: "", password: "" };
    const emailRegex = /^[a-z0-9._]+@[a-z]+\.[a-z]{2,}$/i;

    if (!email) {
      error.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      error.email = "Email is invalid.";
    }

    if (!password) {
      error.password = "Password is required";
    } else if (password.length < 8) {
      error.password = "Minimum 8 characters required";
    }

    if(!error.email && !error.password){
      setFormStatus(true);
      return true;
    }
    else{
      return false;
      setFormStatus(false);
    }
  
    setErrors(error);
  };

  const sendLogin = async () => {
    const valid = validateForm();
    if (valid) {
      const payload: LoginRequestModel = {
        email: email,
        password: password,
      };

      const isValid = await login(payload);

      setTimeout(() => {
        if (isValid) {
          Alert.alert("Success", "Login Sucessfull");
          navigator.replace("tabs");
        } else {
          Alert.alert("Failed", "Invalid Credentials");
        }
      },500);
    } else {
      Alert.alert("Server error during login");
    }
  };

  return (
    <ImageBackground source={BgImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="Welcome To,"
          text2="HMS"
          text3="Please login to your account"
          isHome={false}
        />
        <View style={styles.container}>
          <AuthInputText
            innerText="Email"
            getData={(value: string) => {
              setEmail(value);
            }}
            iconName="mail-outline"
          />
          {!!errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          <AuthInputText
            innerText="Password"
            getData={(value: string) => {
              setPassword(value);
            }}
            isPassword={true}
            iconName="key-outline"
          />
          {!!errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <AuthSubmitButton titleText="Login" onSubmit={sendLogin} />
          <TouchableOpacity
            style={styles.loginFooter}
            onPress={() => navigator.navigate("signup")}
          >
            <Text style={styles.loginFooterText}>Don't have an account?</Text>
            <Text style={[styles.loginFooterText, styles.signUp]}> Signup</Text>
          </TouchableOpacity>
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
    height: "20%",
  },
  container: {
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    justifyContent: "center",
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
  loginFooter: {
    marginTop: 40,
    flexDirection: "row",
  },
  loginFooterText: {
    color: "black",
    fontFamily: "Sans",
    fontSize: 14,
  },
  signUp: {
    color: "rgb(255, 107, 107)",
  },
});

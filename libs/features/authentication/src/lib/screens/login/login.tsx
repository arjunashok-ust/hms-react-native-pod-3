import { coverImage } from "@hms/shared-ui";
import { useState } from "react";
import { trpc } from "@hms/trpc-client";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { AuthInputText } from "../../components/auth-input-text";
import { AuthSubmitButton } from "../../components/auth-submit-button";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { AuthenticationMicroAppProps } from "../../micro-app.types";
import { AuthStackParamList } from "../../navigation/navigation-types";
import {
  EMPTY_LOGIN_ERRORS,
  hasLoginErrors,
  validateLoginForm,
} from "../../validation/login-form.validation";

export default function Login({ onSignedIn }: AuthenticationMicroAppProps) {
  const navigator =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = trpc.auth.login.useMutation();

  const [errors, setErrors] = useState(EMPTY_LOGIN_ERRORS);

  const sendLogin = async () => {
    const nextErrors = validateLoginForm(email, password);
    setErrors(nextErrors);
    if (hasLoginErrors(nextErrors)) {
      Toast.show({
        type: "error",
        text1: "Validation Failed",
        text2: "Please check the input fields",
      });
      return;
    }

    try {
      setIsLoading(true);

      const { token, email: userEmail } = await loginMutation.mutateAsync({
        email,
        password,
        isClientApp: true,
      });

      await onSignedIn({ token, email: userEmail });

      Toast.show({
        type: "success",
        text1: "Success.",
        text2: "Login Sucessfull",
      });
    } catch {
      // login errors are already toasted; the host cleans up its own session failures
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
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
          {!!errors.emailError && (
            <Text style={styles.errorText}>{errors.emailError}</Text>
          )}
          <AuthInputText
            innerText="Password"
            getData={(value: string) => {
              setPassword(value);
            }}
            isPassword={true}
            iconName="key-outline"
          />
          {!!errors.passwordError && (
            <Text style={styles.errorText}>
              {errors.passwordError}
            </Text>
          )}
          <AuthSubmitButton
            titleText={isLoading ? "Logging In..." : "Login"}
            onSubmit={sendLogin}
          />
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
    backgroundColor: "#e1e1e1",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  errorText: {
    color: "#ef2121",
    fontSize: 13,
    width: "80%",
    borderLeftWidth: 4,
    borderColor: "#cd1717",
    borderRadius: 4,
    marginTop: 5,
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
    color: "#4c1c77",
  },
});

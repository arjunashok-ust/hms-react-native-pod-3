import { coverImage } from "@hms/shared-ui";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { AuthInputText } from "../../components/authInputText/authInputText";
import { AuthSubmitButton } from "../../components/authSubmitText/authSubmitText";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { AuthenticationMicroAppProps } from "../../microAppTypes";
import { useLogin } from "./useLogin";

export default function LoginContent({ onSignedIn }: AuthenticationMicroAppProps) {
  const {
    styles,
    content,
    errors,
    setEmail,
    setPassword,
    isLoading,
    sendLogin,
    navigator,
  } = useLogin({ onSignedIn });

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1={content.welcome.text1}
          text2={content.welcome.text2}
          text3={content.welcome.text3}
          isHome={false}
        />
        <View style={styles.container}>
          <AuthInputText
            innerText={content.fields.email}
            getData={(value: string) => {
              setEmail(value);
            }}
            iconName="mail-outline"
          />
          {!!errors.emailError && (
            <Text style={styles.errorText}>{errors.emailError}</Text>
          )}
          <AuthInputText
            innerText={content.fields.password}
            getData={(value: string) => {
              setPassword(value);
            }}
            isPassword={true}
            iconName="key-outline"
          />
          {!!errors.passwordError && (
            <Text style={styles.errorText}>{errors.passwordError}</Text>
          )}
          <AuthSubmitButton
            titleText={
              isLoading
                ? content.submitButton.loggingIn
                : content.submitButton.login
            }
            onSubmit={sendLogin}
          />
          <TouchableOpacity
            style={styles.loginFooter}
            onPress={() => navigator.navigate("signup")}
          >
            <Text style={styles.loginFooterText}>{content.footer.prompt}</Text>
            <Text style={[styles.loginFooterText, styles.signUp]}>
              {content.footer.action}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

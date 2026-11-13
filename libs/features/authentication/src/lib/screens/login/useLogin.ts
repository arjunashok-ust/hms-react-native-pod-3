import { trpc } from "@hms/trpc-client";
import { useState } from "react";
import {
  EMPTY_LOGIN_ERRORS,
  hasLoginErrors,
  validateLoginForm,
} from "../../validation/loginFormValidation";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/navigationTypes";
import { AuthenticationMicroAppProps } from "../../microAppTypes";
import { useAuthenticationContext } from "../../hooks/useAuthenticationContext";

export function useLogin({ onSignedIn }: AuthenticationMicroAppProps) {
  const { styles, content } = useAuthenticationContext("loginContent");
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
        text1: content.toast.validationFailed.title,
        text2: content.toast.validationFailed.message,
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
        text1: content.toast.success.title,
        text2: content.toast.success.message,
      });
    } catch {
      // login errors are already toasted; the host cleans up its own session failures
    } finally {
      setIsLoading(false);
    }
  };

  return {
    styles,
    content,
    errors,
    setEmail,
    setPassword,
    isLoading,
    sendLogin,
    navigator,
  };
}

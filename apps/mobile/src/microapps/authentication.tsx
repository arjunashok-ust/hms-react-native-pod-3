import { clearSession, saveSession } from "@hms/data-access";
import {
  AuthenticationMicroApp,
  SignInCredentials,
} from "@hms/feature-authentication";
import { TOKEN_KEY, tokenStorage, trpc } from "@hms/trpc-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationModel } from "@hms/models";

export default function AuthenticationHost() {
  const navigation =
    useNavigation<NativeStackNavigationProp<NavigationModel>>();
  const utils = trpc.useUtils();

  const handleSignedIn = async ({ token, email }: SignInCredentials) => {
    try {
      await tokenStorage.setItem(TOKEN_KEY, token);
      const { patientId } = await utils.user.getPatientId.fetch({ email });
      await saveSession({ token, email, patientId });
      navigation.reset({
        index: 0,
        routes: [{ name: "tabs", params: { screen: "home" } }],
      });
    } catch (e) {
      await clearSession();
      throw e;
    }
  };

  return <AuthenticationMicroApp onSignedIn={handleSignedIn} />;
}

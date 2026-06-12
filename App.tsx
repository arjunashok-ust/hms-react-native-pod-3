import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";
<<<<<<< HEAD
=======
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
>>>>>>> a4a1e316cff7ae00c35df3ad58d8fc630c8127c9

export default function App() {
  const font = useFonts({
    Sans: require("./assets/fonts/GoogleSans.ttf"),
  });

  if (!font) {
    return null;
  }

  return (
<<<<<<< HEAD
      <AppNavigator />
=======
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
      <Toast />
    </SafeAreaView>
>>>>>>> a4a1e316cff7ae00c35df3ad58d8fc630c8127c9
  );
}

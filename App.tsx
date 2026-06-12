import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const font = useFonts({
    Sans: require("./assets/fonts/GoogleSans.ttf"),
  });

  if (!font) {
    return null;
  }

  return (
      <AppNavigator />
  );
}

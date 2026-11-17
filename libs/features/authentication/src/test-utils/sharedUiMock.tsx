// Stand-in for @hms/shared-ui in specs: keeps native date picker and image
// assets out of the test, and lets a test choose a date by pressing "dob-picker".
import { Pressable, Text } from "react-native";

export const PICKED_DOB = new Date(1990, 0, 15);

export const coverImage = 1;
export const WelcomeTextContainer = () => null;
export const DatePicker = ({ onChange }: { onChange: (d: Date) => void }) => (
  <Pressable testID="dob-picker" onPress={() => onChange(PICKED_DOB)}>
    <Text>pick dob</Text>
  </Pressable>
);

// Jest stand-in for @hms/shared-ui. Every component forwards `testID` so a lib can
// address it by its namespaced id, and renders the text a test would want to read.
import { Pressable, Text, TextInput, View } from "react-native";

export const PICKED_DOB = new Date(1990, 0, 15);

export const coverImage = 1;

export const WelcomeTextContainer = (props: any) => (
  <View testID={props.testID}>
    <Text>{props.text1}</Text>
    <Text>{props.text2}</Text>
    <Text>{props.text3}</Text>
  </View>
);

export const FormHeader = (props: any) => (
  <View testID={props.testID}>
    <Text>{props.title}</Text>
    <Text>{props.value}</Text>
  </View>
);

export const SearchBox = (props: any) => (
  <TextInput
    testID={props.testID}
    placeholder={props.placeholder}
    onChangeText={props.onChangeText}
  />
);

export const AppointmentInputCard = (props: any) => (
  <View>
    <Text>{props.title}</Text>
    <TextInput
      testID={props.testID}
      value={props.value}
      editable={!props.isDisabled}
      onChangeText={props.getData}
    />
  </View>
);

export const ProfileButton = (props: any) => (
  <Pressable testID={props.testID} onPress={props.onAction}>
    <Text>{props.title}</Text>
  </Pressable>
);

export const SectionDivider = (props: any) => (
  <View testID={props.testID}>
    <Text>{props.title}</Text>
  </View>
);

export const TimeSlotHolder = (props: any) => (
  <Pressable testID={props.testID} onPress={() => props.onAction(props.slot)}>
    <Text>{props.slot}</Text>
  </Pressable>
);

// Pressing it picks PICKED_DOB, so a test can choose a date without a native picker.
export const DatePicker = (props: any) => (
  <Pressable
    testID={props.testID ?? "date-picker"}
    onPress={() => props.onChange(PICKED_DOB)}
  >
    <Text>{props.value ? "date set" : props.placeholder}</Text>
  </Pressable>
);

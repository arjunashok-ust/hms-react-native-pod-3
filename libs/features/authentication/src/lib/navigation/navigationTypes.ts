import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, T>;

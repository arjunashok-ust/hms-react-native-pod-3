import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type HomeStackParamList = {
  home: undefined;
};

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

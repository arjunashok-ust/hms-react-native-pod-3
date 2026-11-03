import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Prefixed route names so they never collide with the host's or other micro apps' routes.
export type ProfileStackParamList = {
  profileView: undefined;
  profileEdit: undefined;
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;

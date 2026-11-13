import { NavigatorScreenParams } from "@react-navigation/native";

export type NavigationModel = {
  auth: undefined;
  tabs: NavigatorScreenParams<TabParamList>;
};

export type TabParamList = {
  home: undefined;
  profile: undefined;
  appointment: { doctorId?: string; launchId?: number };
};

import { NavigatorScreenParams } from "@react-navigation/native";

export type NavigationModel = {
  login: undefined;
  signup: undefined;
  tabs: NavigatorScreenParams<TabParamList>;
  viewAppointment: undefined,
};

export type TabParamList = {
  home: undefined;
  profile: undefined;
  appointment: undefined;
};

import { NavigatorScreenParams } from "@react-navigation/native";
import { AppointmentModel } from "./appointment.schema";

export type NavigationModel = {
  login: undefined;
  signup: undefined;
  tabs: NavigatorScreenParams<TabParamList>;
};

export type TabParamList = {
  home: undefined;
  profile: undefined;
  appointment: { doctorId?: string; launchId?: number };
};

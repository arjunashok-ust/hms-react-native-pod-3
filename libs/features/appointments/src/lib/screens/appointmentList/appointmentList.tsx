import { AppointmentScreenProps } from "../../navigation/navigationTypes";
import AppointmentListContent from "./appointmentListContent";

export function AppointmentList({
  navigation,
}: AppointmentScreenProps<"appointmentList">) {
  return <AppointmentListContent navigation={navigation} />;
}

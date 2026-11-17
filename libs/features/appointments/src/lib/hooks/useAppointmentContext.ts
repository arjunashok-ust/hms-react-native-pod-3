import { AppointmentStyles } from "../context/appointmentStyles";
import { AppointmentContent, defaultContent } from "../content/content";
import { useContext, useMemo } from "react";
import { AppointmentContext } from "../context/appointmentContext";

type ScreenKey = keyof AppointmentStyles & keyof AppointmentContent;

export function useAppointmentContext<K extends ScreenKey>(screen: K) {
  const value = useContext(AppointmentContext);
  if (!value) {
    throw new Error(
      "useAppointment should be only called inside AppointmentProvider",
    );
  }
  const factory = value.styles[screen];
  const styles = useMemo(
    () => factory() as ReturnType<AppointmentStyles[K]>,
    [factory],
  );
  const componentName = String(screen).replace(/Content$/, "");
  const testId = useMemo(
    () => value.testId(componentName),
    [value, componentName],
  );
  return { styles, content: value.content[screen], testId };
}

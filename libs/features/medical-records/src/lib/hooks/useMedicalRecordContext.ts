import { useContext, useMemo } from "react";
import { MedicalRecordContent } from "../content/content";
import { MedicalRecordContext } from "../context/medicalRecordContext";
import { MedicalRecordStyles } from "../context/medicalRecordStyles";

type ScreenKey = keyof MedicalRecordStyles & keyof MedicalRecordContent;
export function useMedicalRecordContext<K extends ScreenKey>(screen: K) {
  const value = useContext(MedicalRecordContext);
  if (!value) {
    throw new Error(
      "useMedicalRecord must be used within MedicalRecordProvider",
    );
  }
  const factory = value.styles[screen];
  const styles = useMemo(
    () => factory() as ReturnType<MedicalRecordStyles[K]>,
    [factory],
  );
  return { styles, content: value.content[screen] };
}

import { useHost } from "@hms/shared-util";
import { useProfileContext } from "../../hooks/useProfileContext";
import { ProfileScreenProps } from "../../navigation/navigationTypes";
import { usePatientProfile } from "../../hooks/usePatientProfile";
import { formatDate } from "../../utils/formatDate";

type Navigation = ProfileScreenProps<"profileView">["navigation"];

export function useProfileViewContent(navigation: Navigation) {
  const { styles, content } = useProfileContext("profileViewContent");
  const { actions } = useHost();
  const { data: patientData } = usePatientProfile();

  const goToEditProfile = () => navigation.navigate("profileEdit");

  return {
    styles,
    content,
    patientData,
    formattedDob: formatDate(patientData?.dob),
    goToEditProfile,
    signOut: actions.signOut,
  };
}

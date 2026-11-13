import { useEffect, useState } from "react";
import { useProfileContext } from "../../hooks/useProfileContext";
import { ProfileScreenProps } from "../../navigation/navigationTypes";
import {
  EMPTY_ERRORS,
  hasErrors,
  ProfileFormValues,
  validateProfile,
} from "./profileEdit.validation";
import { trpc } from "@hms/trpc-client";
import { usePatientProfile } from "../../hooks/usePatientProfile";
import Toast from "react-native-toast-message";
import { Gender } from "@hms/models";

type Navigation = ProfileScreenProps<"profileEdit">["navigation"];

const EMPTY_VALUES: ProfileFormValues = {
  name: "",
  gender: "",
  dob: new Date(),
  email: "",
  address: "",
  phone: "",
  emergencyContact: "",
};

export function useProfileEditContent(navigation: Navigation) {
  const { styles, content } = useProfileContext("profileEditContent");
  const [patientId, setPatientId] = useState("");
  const [values, setValues] = useState<ProfileFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const utils = trpc.useUtils();
  const { data: profile } = usePatientProfile();

  const goToProfile = () => navigation.navigate("profileView");

  const updateProfileMutation = trpc.user.updatePatientProfile.useMutation({
    onSuccess: async () => {
      await utils.user.getPatientProfile.invalidate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Patient profile updated successfully",
      });
      goToProfile();
    },
  });

  // Seed the form once the profile arrives.
  useEffect(() => {
    if (!profile) return;
    setPatientId(profile.uhid);
    setValues({
      name: profile.name,
      gender: profile.gender ?? "",
      dob: profile.dob ? new Date(profile.dob) : new Date(),
      email: profile.email,
      address: profile.address ?? "",
      phone: profile.phone ?? "",
      emergencyContact: profile.emergencyContact ?? "",
    });
  }, [profile]);

  const setField = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const updateProfile = () => {
    const newErrors = validateProfile(values);
    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      Toast.show({
        type: "error",
        text1: "Validation Failed",
        text2: "Please check the input fields",
      });
      return;
    }

    updateProfileMutation.mutate({
      patientId,
      name: values.name,
      gender: values.gender as Gender,
      dob: values.dob,
      address: values.address,
      emergencyContact: values.emergencyContact,
    });
  };

  return {
    styles,
    content,
    values,
    errors,
    setField,
    isUpdating: updateProfileMutation.isPending,
    updateProfile,
    goToProfile,
  };
}


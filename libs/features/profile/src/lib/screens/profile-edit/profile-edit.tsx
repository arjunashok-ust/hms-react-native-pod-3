import {
  AppointmentInputCard,
  coverImage,
  DatePicker,
  ProfileButton,
  SectionDivider,
  WelcomeTextContainer,
} from "@hms/shared-ui";
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { PatientProfile, trpc } from "@hms/trpc-client";
import { Gender } from "@hms/models";
import { maxDobLimit, minDobLimit } from "@hms/shared-util";
import Toast from "react-native-toast-message";
import { usePatientProfile } from "../../hooks/use-patient-profile";
import type { ProfileScreenProps } from "../../navigation/navigation-types";
import {
  EMPTY_ERRORS,
  hasErrors,
  validateProfile,
} from "../../validation/profile-form.validation";

export default function ProfileEditScreen({
  navigation,
}: ProfileScreenProps<"profileEdit">) {
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date>(new Date());
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

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
    if (profile) populateForm(profile);
  }, [profile]);

  const populateForm = (data: PatientProfile) => {
    setPatientId(data.uhid);
    setName(data.name);
    setGender(data.gender ?? "");
    setDob(data.dob ? new Date(data.dob) : new Date());
    setEmail(data.email);
    setAddress(data.address ?? "");
    setPhone(data.phone ?? "");
    setEmergencyContact(data.emergencyContact ?? "");
  };

  const updateProfile = () => {
    const newErrors = validateProfile({
      name,
      gender,
      dob,
      email,
      address,
      phone,
      emergencyContact,
    });
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
      name,
      gender: gender as Gender,
      dob,
      address,
      emergencyContact,
    });
  };

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="Edit your,"
          text2="PROFILE"
          text3="here."
        ></WelcomeTextContainer>

        <ProfileButton
          title="GO BACK"
          iconName="arrow-back-outline"
          onAction={goToProfile}
        />

        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.formHeader}>
              <Ionicons
                name="calendar-outline"
                color={"#d6d6d6"}
                size={25}
                style={styles.formHeaderIcon}
              />
              <View style={styles.formHeaderTextHolder}>
                <Text style={[styles.text, styles.formHeaderTitle]}>
                  UPDATE ENTRY
                </Text>
                <Text style={[styles.text, styles.formHeaderValue]}>
                  Edit Profile
                </Text>
              </View>
            </View>
            <SectionDivider
              title="PERSONAL INFO"
              iconName="person-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="card-outline"
              title="Name"
              value={name}
              getData={(value: string) => {
                setName(value);
              }}
              isDisabled={false}
            />
            {!!errors.name && (
              <Text style={[styles.text, styles.errorText]}>{errors.name}</Text>
            )}
            <Text style={[styles.text, styles.placeholderText]}>Gender</Text>
            <View style={styles.dropdownHolder}>
              <Ionicons
                name="person-outline"
                size={22}
                color={"#cfcfcf"}
                style={styles.appointmentIcon}
              />
              <Picker
                selectedValue={gender}
                onValueChange={(value) => {
                  setGender(value);
                }}
                style={styles.picker}
                dropdownIconColor="#000000"
              >
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {!!errors.gender && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.gender}
              </Text>
            )}
            <Text style={[styles.text, styles.placeholderText]}>DOB</Text>
            <DatePicker
              value={dob}
              onChange={setDob}
              placeholder="DOB"
              iconName="alarm-outline"
              minimumDate={minDobLimit()}
              maximumDate={maxDobLimit()}
            />
            {!!errors.dob && (
              <Text style={[styles.text, styles.errorText]}>{errors.dob}</Text>
            )}
            <SectionDivider
              title="CONTACT INFO"
              iconName="call-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="mail-outline"
              title="Email"
              value={email}
              getData={(value: string) => {
                setEmail(value);
              }}
              isDisabled={true}
            />
            {!!errors.email && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.email}
              </Text>
            )}
            <AppointmentInputCard
              iconName="location-outline"
              title="Address"
              value={address}
              getData={(value: string) => {
                setAddress(value);
              }}
              isDisabled={false}
            />
            {!!errors.address && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.address}
              </Text>
            )}
            <AppointmentInputCard
              iconName="call-outline"
              title="Phone"
              value={phone}
              getData={() => {
                /* noop */
              }}
              isDisabled={true}
            />
            {!!errors.phone && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.phone}
              </Text>
            )}
            <AppointmentInputCard
              iconName="medical-outline"
              title="Emergency Contact"
              value={emergencyContact}
              getData={(value: string) => {
                setEmergencyContact(value);
              }}
              isDisabled={false}
            />
            {!!errors.emergencyContact && (
              <Text style={[styles.text, styles.errorText]}>
                {errors.emergencyContact}
              </Text>
            )}
            <ProfileButton
              title={
                updateProfileMutation.isPending
                  ? "UPDATING..."
                  : "UPDATE PROFILE"
              }
              iconName="arrow-back-outline"
              onAction={updateProfile}
            />
            <ProfileButton
              title="CANCEL"
              iconName="close-outline"
              onAction={goToProfile}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  scrollView: {
    height: 450,
  },
  container: {
    flex: 1,
    borderRadius: 35,
    margin: 20,
    backgroundColor: "#f2f2f2",
    borderColor: "rgba(207, 75, 255, 0.2)",
    borderWidth: 1,
    paddingBottom: 20,
  },
  formHeader: {
    padding: 20,
    flexDirection: "row",
  },
  formHeaderIcon: {
    padding: 15,
    backgroundColor: "rgb(108, 19, 109)",
    borderRadius: 100,
  },
  formHeaderTextHolder: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  formHeaderTitle: {
    fontSize: 10,
    lineHeight: 18,
    color: "#909090",
  },
  formHeaderValue: {
    fontSize: 18,
    lineHeight: 18,
    color: "#505050",
  },
  text: {
    fontFamily: "Sans",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  dropdownHolder: {
    backgroundColor: "rgb(222, 222, 222)",
    borderWidth: 1,
    borderColor: "rgba(83, 11, 107, 0.3)",
    borderRadius: 10,
    marginVertical: 10,
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    color: "rgb(39, 39, 39)",
    fontFamily: "Sans",
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 3,
  },
  dropDownIcon: {
    padding: 10,
    backgroundColor: "rgba(119, 119, 119, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  errorText: {
    color: "#ef2121",
    fontSize: 13,
    width: "80%",
    borderLeftWidth: 4,
    borderColor: "#cd1717",
    borderRadius: 4,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  placeholderText: {
    color: "rgb(139, 139, 139)",
    fontSize: 12,
    lineHeight: 12,
    marginHorizontal: 20,
  },
  appointmentIcon: {
    backgroundColor: "rgb(108, 19, 109)",
    borderWidth: 1,
    borderColor: "rgba(198, 53, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
  },
});

import {
  AppointmentInputCard,
  coverImage,
  DatePicker,
  ProfileButton,
  SectionDivider,
  WelcomeTextContainer,
} from "@hms/shared-ui";
import { Text, View, ImageBackground, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { PatientProfile, trpc } from "@hms/trpc-client";
import { Gender } from "@hms/models";
import { maxDobLimit, minDobLimit } from "@hms/shared-util";
import Toast from "react-native-toast-message";
import { usePatientProfile } from "../../hooks/usePatientProfile";
import type { ProfileScreenProps } from "../../navigation/navigationTypes";
import {
  EMPTY_ERRORS,
  hasErrors,
  validateProfile,
} from "./profileEdit.validation";
import { useProfileContext } from "../../hooks/useProfileContext";

export default function ProfileEditScreen({
  navigation,
}: ProfileScreenProps<"profileEdit">) {
  const { styles, content } = useProfileContext("profileEditContent");
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
          text1={content.welcome.text1}
          text2={content.welcome.text2}
          text3={content.welcome.text3}
        ></WelcomeTextContainer>

        <ProfileButton
          title={content.profileButton.goBack}
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
                  {content.formHeaderTextHolder.formHeaderTitle}
                </Text>
                <Text style={[styles.text, styles.formHeaderValue]}>
                  {content.formHeaderTextHolder.formHeaderValue}
                </Text>
              </View>
            </View>
            <SectionDivider
              title={content.sectionDivider}
              iconName="person-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="card-outline"
              title={content.fieldLabels.name}
              value={name}
              getData={(value: string) => {
                setName(value);
              }}
              isDisabled={false}
            />
            {!!errors.name && (
              <Text style={[styles.text, styles.errorText]}>{errors.name}</Text>
            )}
            <Text style={[styles.text, styles.placeholderText]}>
              {content.placeHolderText.gender}
            </Text>
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
            <Text style={[styles.text, styles.placeholderText]}>
              {content.placeHolderText.dateOfBirth}
            </Text>
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
              title={content.sectionDivider.contactInfo}
              iconName="call-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="mail-outline"
              title={content.fieldLabels.email}
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
              title={content.fieldLabels.address}
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
              title={content.fieldLabels.phone}
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
              title={content.fieldLabels.emergencyContact}
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
                  ? content.profileButton.updating
                  : content.profileButton.updateProfile
              }
              iconName="arrow-back-outline"
              onAction={updateProfile}
            />
            <ProfileButton
              title={content.profileButton.cancel}
              iconName="close-outline"
              onAction={goToProfile}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

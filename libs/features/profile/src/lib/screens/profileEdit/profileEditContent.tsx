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
import { maxDobLimit, minDobLimit } from "@hms/shared-util";
import type { ProfileScreenProps } from "../../navigation/navigationTypes";
import { useProfileEditContent } from "./useProfileEditContent";

export type Props = Pick<ProfileScreenProps<"profileEdit">, "navigation">;

export default function ProfileEditContent({ navigation }: Props) {
  const {
    styles,
    content,
    testId,
    values,
    errors,
    setField,
    isUpdating,
    updateProfile,
    goToProfile,
  } = useProfileEditContent(navigation);

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
      testID={testId`screen`}
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
          testID={testId`goBack`}
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
              title={content.sectionDivider.personalInfo}
              iconName="person-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="card-outline"
              title={content.fieldLabels.name}
              value={values.name}
              getData={(value: string) => {
                setField("name", value);
              }}
              isDisabled={false}
              testID={testId`name`}
            />
            {!!errors.name && (
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`nameError`}
              >{errors.name}</Text>
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
                testID={testId`gender`}
                selectedValue={values.gender}
                onValueChange={(value) => {
                  setField("gender", value);
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
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`genderError`}
              >
                {errors.gender}
              </Text>
            )}
            <Text style={[styles.text, styles.placeholderText]}>
              {content.placeHolderText.dateOfBirth}
            </Text>
            <View testID={testId`dob`}>
              <DatePicker
                value={values.dob}
                onChange={(value) => setField("dob", value)}
                placeholder="DOB"
                iconName="alarm-outline"
                minimumDate={minDobLimit()}
                maximumDate={maxDobLimit()}
              />
            </View>
            {!!errors.dob && (
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`dobError`}
              >
                {errors.dob}
              </Text>
            )}
            <SectionDivider
              title={content.sectionDivider.contactInfo}
              iconName="call-outline"
            ></SectionDivider>
            <AppointmentInputCard
              iconName="mail-outline"
              title={content.fieldLabels.email}
              value={values.email}
              getData={(value: string) => {
                setField("email", value);
              }}
              isDisabled={true}
              testID={testId`email`}
            />
            {!!errors.email && (
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`emailError`}
              >
                {errors.email}
              </Text>
            )}
            <AppointmentInputCard
              iconName="location-outline"
              title={content.fieldLabels.address}
              value={values.address}
              getData={(value: string) => {
                setField("address", value);
              }}
              isDisabled={false}
              testID={testId`address`}
            />
            {!!errors.address && (
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`addressError`}
              >
                {errors.address}
              </Text>
            )}
            <AppointmentInputCard
              iconName="call-outline"
              title={content.fieldLabels.phone}
              value={values.phone}
              getData={() => {
                /* noop */
              }}
              isDisabled={true}
              testID={testId`phone`}
            />
            {!!errors.phone && (
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`phoneError`}
              >
                {errors.phone}
              </Text>
            )}
            <AppointmentInputCard
              iconName="medical-outline"
              title={content.fieldLabels.emergencyContact}
              value={values.emergencyContact}
              getData={(value: string) => {
                setField("emergencyContact", value);
              }}
              isDisabled={false}
              testID={testId`emergencyContact`}
            />
            {!!errors.emergencyContact && (
              <Text
                style={[styles.text, styles.errorText]}
                testID={testId`emergencyContactError`}
              >
                {errors.emergencyContact}
              </Text>
            )}
            <ProfileButton
              title={
                isUpdating
                  ? content.profileButton.updating
                  : content.profileButton.updateProfile
              }
              iconName="arrow-back-outline"
              onAction={updateProfile}
              testID={testId`updateProfile`}
            />
            <ProfileButton
              title={content.profileButton.cancel}
              iconName="close-outline"
              onAction={goToProfile}
              testID={testId`cancel`}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

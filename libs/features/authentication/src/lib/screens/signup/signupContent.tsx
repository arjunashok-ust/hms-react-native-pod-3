import { coverImage } from "@hms/shared-ui";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AuthInputText } from "../../components/authInputText/authInputText";
import { AuthSubmitButton } from "../../components/authSubmitText/authSubmitText";
import { DatePicker, WelcomeTextContainer } from "@hms/shared-ui";
import { Picker } from "@react-native-picker/picker";
import { useSignUp } from "./useSignup";

export default function SignUpContent() {
  const {
    styles,
    content,
    errors,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setPhone,
    setGender,
    setAddress,
    setBloodGroup,
    setAllergies,
    minDobLimit,
    maxDobLimit,
    setEmergencyContact,
    isLoading,
    navigator,
    gender,
    bloodGroup,
    isDobSet,
    dob,
    onDobChange,
    sendSignUp,
  } = useSignUp();

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
          isHome={false}
        />
        <View style={styles.container}>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          >
            <AuthInputText
              innerText={content.fields.name}
              getData={(value: string) => setName(value)}
              iconName="person-outline"
            />
            {!!errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            <AuthInputText
              innerText={content.fields.email}
              getData={(value: string) => setEmail(value)}
              iconName="mail-outline"
            />
            {!!errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <AuthInputText
              innerText={content.fields.password}
              isPassword={true}
              getData={(value: string) => setPassword(value)}
              iconName="key-outline"
            />
            {!!errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <AuthInputText
              innerText={content.fields.confirmPassword}
              isPassword={true}
              getData={(value: string) => setConfirmPassword(value)}
              iconName="lock-closed-outline"
            />
            {!!errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            <AuthInputText
              innerText={content.fields.phone}
              getData={(value: string) => setPhone(value)}
              iconName="call-outline"
            />
            {!!errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
            <View style={styles.dropdownHolder}>
              <Picker
                selectedValue={gender}
                onValueChange={(value) => {
                  if (value != "") setGender(value);
                }}
                style={styles.picker}
                dropdownIconColor="#828282"
              >
                <Picker.Item
                  label={content.gender.placeholder}
                  value=""
                  style={styles.picker}
                />
                <Picker.Item
                  label={content.gender.male}
                  value="Male"
                  style={styles.picker}
                />
                <Picker.Item
                  label={content.gender.female}
                  value="Female"
                  style={styles.picker}
                />
              </Picker>
            </View>
            {!!errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}
            <AuthInputText
              innerText={content.fields.address}
              getData={(value: string) => setAddress(value)}
              iconName="location-outline"
            />
            {!!errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
            <View style={styles.dropdownHolder}>
              <Picker
                selectedValue={bloodGroup}
                onValueChange={(value) => {
                  if (value != "") setBloodGroup(value);
                }}
                style={styles.picker}
                dropdownIconColor="#828282"
              >
                <Picker.Item
                  label={content.bloodGroup.placeholder}
                  value=""
                  style={styles.picker}
                />
                <Picker.Item label="A+" value="A+" style={styles.picker} />
                <Picker.Item label="A-" value="A-" style={styles.picker} />
                <Picker.Item label="B+" value="B+" style={styles.picker} />
                <Picker.Item label="B-" value="B-" style={styles.picker} />
                <Picker.Item label="AB+" value="AB+" style={styles.picker} />
                <Picker.Item label="AB-" value="AB-" style={styles.picker} />
                <Picker.Item label="O+" value="O+" style={styles.picker} />
                <Picker.Item label="O-" value="O-" style={styles.picker} />
              </Picker>
            </View>
            {!!errors.bloodGroup && (
              <Text style={styles.errorText}>{errors.bloodGroup}</Text>
            )}
            <AuthInputText
              innerText={content.fields.allergies}
              getData={(value: string) => setAllergies(value)}
              iconName="medkit-outline"
            />
            <DatePicker
              value={isDobSet ? dob : null}
              onChange={onDobChange}
              placeholder={content.fields.dob}
              minimumDate={minDobLimit()}
              maximumDate={maxDobLimit()}
              style={styles.dobField}
            />
            {!!errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
            <AuthInputText
              innerText={content.fields.emergencyContact}
              getData={(value: string) => setEmergencyContact(value)}
              iconName="call-outline"
            />
            {!!errors.emergencyContact && (
              <Text style={styles.errorText}>{errors.emergencyContact}</Text>
            )}
            <AuthSubmitButton
              titleText={
                isLoading
                  ? content.submitButton.signingUp
                  : content.submitButton.signup
              }
              onSubmit={sendSignUp}
            />
            <TouchableOpacity
              style={styles.signUpFooter}
              onPress={() => navigator.navigate("login")}
            >
              <Text style={styles.signUpFooterText}>
                {content.footer.prompt}
              </Text>
              <Text style={[styles.signUpFooterText, styles.login]}>
                {content.footer.action}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

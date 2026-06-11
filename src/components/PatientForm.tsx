import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import PhoneInput from "react-native-phone-number-input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

interface PatientFormProps {
  initialValues: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  buttonText: string;
  isEditMode?: boolean;
}

const getValidationSchema = (isEditMode: boolean) => {
  const nameRegex = /^[A-Za-z\s.\-']+$/;
  const stateRegex = /^[A-Za-z\s]+$/;
  const indianPhoneRegex = /^(?:\+91)?\s*[6-9]\d{9}$/;

  let baseSchema = {
    name: Yup.string()
      .trim()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters")
      .matches(
        nameRegex,
        "Name can only contain alphabets, spaces, dots, hyphens, and apostrophes",
      ),

    email: Yup.string()
      .trim()
      .lowercase()
      .email("Please enter a valid email address")
      .required("Email is required"),

    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        indianPhoneRegex,
        "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
      ),

    gender: Yup.string()
      .oneOf(["Male", "Female", "Other"], "Please select a valid gender option")
      .required("Gender is required"),

    dob: Yup.date()
      .required("Date of Birth is required")
      .min(new Date("1926-01-01"), "Date of Birth cannot be earlier than 1926")
      .max(new Date(), "Date of Birth cannot be in the future"),

    bloodGroup: Yup.string()
      .oneOf(
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "Invalid Blood Group",
      )
      .optional()
      .nullable(),

    allergies: Yup.string()
      .trim()
      .max(200, "Allergies descriptions cannot exceed 200 characters")
      .optional()
      .nullable(),

    emergencyContact: Yup.string()
      .trim()
      .optional()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test(
        "is-valid-emergency",
        "Enter a valid 10-digit emergency number starting with 6-9",
        (value) => !value || indianPhoneRegex.test(value),
      ),

    line1: Yup.string()
      .trim()
      .required("Address Line 1 is required")
      .min(5, "Address must be descriptive (min 5 characters)"),

    line2: Yup.string().trim().optional().nullable(),

    state: Yup.string()
      .trim()
      .required("State is required")
      .matches(
        stateRegex,
        "State field cannot contain numbers or special characters",
      ),

    pincode: Yup.string()
      .trim()
      .matches(/^\d{6}$/, "Pincode must be exactly 6 numeric digits")
      .required("Pincode is required"),
  };

  if (!isEditMode) {
    Object.assign(baseSchema, {
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one digit")
        .matches(
          /[\W_]/,
          "Password must contain at least one special character",
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    });
  }

  return Yup.object().shape(baseSchema);
};

export default function PatientForm(props: Readonly<PatientFormProps>) {
  const {
    initialValues,
    onSubmit,
    isLoading,
    buttonText,
    isEditMode = false,
  } = props;
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getValidationSchema(isEditMode)),
    defaultValues: initialValues,
  });

  return (
    <View style={styles.formContainer}>
      {/* 1. Name Field */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Full Name"
            style={[
              styles.input,
              errors.name && styles.inputError,
              isEditMode && styles.disabledInput,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!isEditMode}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message as string}</Text>
      )}

      {/* 2. Email Field */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email Address"
            style={[
              styles.input,
              errors.email && styles.inputError,
              isEditMode && styles.disabledInput,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isEditMode}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message as string}</Text>
      )}

      {/* 3. Phone Field */}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <View
            style={[styles.phoneWrapper, errors.phone && styles.inputError]}
          >
            <PhoneInput
              defaultCode="IN"
              layout="first"
              onChangeFormattedText={onChange}
              value={value ? value.replace(/^\+?91/, "").trim() : ""}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
              disableArrowIcon={true} 
              countryPickerProps={{
                countryCodes: ["IN"], 
                withFilter: false, 
              }}
              textInputProps={{
                keyboardType: "number-pad",
                maxLength: 10,
              }}
            />
          </View>
        )}
      />

      {/* Password Fields */}
      {!isEditMode && (
        <>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                style={[styles.input, errors.password && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password.message as string}
            </Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Confirm Password"
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>
              {errors.confirmPassword.message as string}
            </Text>
          )}
        </>
      )}

      {/* 4. Gender Picker */}
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="Gender" value={undefined} color="#9CA3AF" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        )}
      />
      {errors.gender && (
        <Text style={styles.errorText}>{errors.gender.message as string}</Text>
      )}

      {/* 5. Date of Birth Picker */}
      <Controller
        control={control}
        name="dob"
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              style={[
                styles.input,
                errors.dob && styles.inputError,
                styles.dateInput,
              ]}
              onPress={() => setIsDatePickerOpen(true)}
            >
              <Text style={value ? styles.dateText : styles.placeholderText}>
                {value ? new Date(value).toDateString() : "DOB"}
              </Text>
            </TouchableOpacity>
            {isDatePickerOpen && (
              <DateTimePicker
                value={value ? new Date(value) : new Date(2000, 0, 1)}
                mode="date"
                display="default"
                minimumDate={new Date("1926-01-01")}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setIsDatePickerOpen(false);
                  if (event.type === "set" && selectedDate)
                    onChange(selectedDate);
                }}
              />
            )}
          </>
        )}
      />
      {errors.dob && (
        <Text style={styles.errorText}>{errors.dob.message as string}</Text>
      )}

      {/* 6. Blood Group Picker */}
      <Controller
        control={control}
        name="bloodGroup"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item
                label="Blood Group (Optional)"
                value={undefined}
                color="#9CA3AF"
              />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          </View>
        )}
      />

      {/* 7. Allergies Field */}
      <Controller
        control={control}
        name="allergies"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Allergies (comma separated)"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {/* 8. Emergency Contact Field */}
      <Controller
        control={control}
        name="emergencyContact"
        render={({ field: { onChange, value } }) => (
          <View
            style={[
              styles.phoneWrapper,
              errors.emergencyContact && styles.inputError,
            ]}
          >
            <PhoneInput
              defaultCode="IN"
              layout="first"
              onChangeFormattedText={onChange}
              value={value ? value.replace(/^\+?91/, "").trim() : ""}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
              disableArrowIcon={true}
              countryPickerProps={{
                countryCodes: ["IN"],
                withFilter: false,
              }}
              textInputProps={{
                keyboardType: "number-pad",
                maxLength: 10,
                placeholder: "Emergency Contact (Optional)",
                placeholderTextColor: "#9CA3AF",
              }}
            />
          </View>
        )}
      />
      {/* 9. Address Line 1 */}
      <Controller
        control={control}
        name="line1"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Address Line 1"
            style={[styles.input, errors.line1 && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.line1 && (
        <Text style={styles.errorText}>{errors.line1.message as string}</Text>
      )}

      {/* 10. Address Line 2 */}
      <Controller
        control={control}
        name="line2"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Address Line 2 (Optional)"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {/* 11. State Field */}
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="State"
            style={[styles.input, errors.state && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.state && (
        <Text style={styles.errorText}>{errors.state.message as string}</Text>
      )}

      {/* 12. Pincode Field */}
      <Controller
        control={control}
        name="pincode"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Pincode (6 digits)"
            style={[styles.input, errors.pincode && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="number-pad"
            maxLength={6}
          />
        )}
      />
      {errors.pincode && (
        <Text style={styles.errorText}>{errors.pincode.message as string}</Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit((validatedData) => onSubmit(validatedData))}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>{buttonText}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { width: "100%" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1E1E3F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputError: { borderColor: "#ef4444", borderWidth: 1 },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 12,
    marginTop: -10,
    marginLeft: 8,
  },
  phoneWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  phoneContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: 55, // 🟢 1. Added explicit height to prevent collapse
  },
  phoneTextContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 0,
    borderLeftWidth: 1, // 🟢 Optional: Adds a nice divider line between the flag and the number
    borderColor: "#F3F4F6",
  },
  pickerWrapper: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  picker: { height: 55, width: "100%", color: "#1E1E3F" },
  dateInput: { justifyContent: "center" },
  dateText: { fontSize: 16, color: "#1E1E3F" },
  placeholderText: { fontSize: 16, color: "#9CA3AF" },
  button: {
    backgroundColor: "#4B1D76",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4B1D76",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: "#8b5cf6" },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
  },
});

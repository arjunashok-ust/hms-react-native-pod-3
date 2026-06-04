import axios from "axios";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LoginRequestModel, SignUpRequestModel } from "../types/auth.types";
import { getPatientId } from "./user.service";

export const login = async (data: LoginRequestModel): Promise<boolean> => {
  try {
    const response = await axios.post("http://10.0.2.2:8080/auth/login", data);

    const token = response.data.token;
    const email = response.data.email;

    SecureStore.setItemAsync("token", token);
    SecureStore.setItemAsync("email", email);

    setTimeout(async () => {
      const patientId = await getPatientId(email);
      SecureStore.setItemAsync("patientId", patientId);
    }, 500);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const signUp = (data: SignUpRequestModel) => {
  axios
    .post("http://10.0.2.2:8080/auth/patientSignUp", data)
    .then((res) => {
      Alert.alert("Success", "Account created sucessfully.");
    })
    .catch((err) => {
      console.log(err);
      Alert.alert("Failed", "Server error occured while creating account.");
    });
};

export const setToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("token", token);
  } catch (err) {
    console.error(err);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    return token;
  } catch (err) {
    console.error(err);
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync("token");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const clearSecureStorage = async () => {
  try {
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("patientId");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logout = async () => {
  try {
    await deleteToken();
    await clearSecureStorage();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

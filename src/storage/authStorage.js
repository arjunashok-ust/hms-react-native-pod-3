import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveLoginData = async (token, user, patient) => {
  try {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("patient", JSON.stringify(patient));
  } catch (error) {
    console.log("Storage Error:", error);
  }
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getPatient = async () => {
  const patient = await AsyncStorage.getItem("patient");
  return patient ? JSON.parse(patient) : null;
};

export const clearStorage = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("patient");
};

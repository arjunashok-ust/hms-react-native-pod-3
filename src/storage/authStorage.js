import * as SecureStore from "expo-secure-store";

export const saveLoginData = async (token, refreshToken, user, patient) => {
  try {
    await SecureStore.setItemAsync("token", token);
    if (refreshToken) {
      await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    await SecureStore.setItemAsync("patient", JSON.stringify(patient));
  } catch (error) {
    console.log("Storage Error:", error);
  }
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

/* Access + refresh token helpers for the silent-refresh flow. */
export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken");
};

export const saveTokens = async (token, refreshToken) => {
  await SecureStore.setItemAsync("token", token);
  if (refreshToken) {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  }
};

export const getUser = async () => {
  const user = await SecureStore.getItemAsync("user");

  return user ? JSON.parse(user) : null;
};

export const getPatient = async () => {
  const patient = await SecureStore.getItemAsync("patient");

  return patient ? JSON.parse(patient) : null;
};

/* Update only the stored patient (e.g. after a profile edit) without touching tokens. */
export const savePatient = async (patient) => {
  await SecureStore.setItemAsync("patient", JSON.stringify(patient));
};

export const clearStorage = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("patient");
};

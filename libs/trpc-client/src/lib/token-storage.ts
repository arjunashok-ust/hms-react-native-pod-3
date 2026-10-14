import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "token";

// expo-secure-store has no web implementation, so fall back to AsyncStorage (localStorage) there.
const isWeb = Platform.OS === "web";

export const tokenStorage = {
  getItem: (key: string) =>
    isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    isWeb ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
  removeItem: (key: string) =>
    isWeb ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
};

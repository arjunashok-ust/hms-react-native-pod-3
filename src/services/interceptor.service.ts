import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://10.0.2.2:8080",
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    throw err;
  },
);

export default api;

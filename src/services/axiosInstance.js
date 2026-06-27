import axios from "axios";
import {
  getToken,
  getRefreshToken,
  saveTokens,
  clearStorage,
} from "../storage/authStorage";
import { Alert } from "react-native";
import { resetToLogin } from "../navigation/navigationRef";

const USE_PHYSICAL_DEVICE = false;

const baseURL = USE_PHYSICAL_DEVICE
  ? "http://10.11.64.135:5000" // your PC's LAN IP
  : "http://10.0.2.2:5000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Serialize concurrent refreshes: only ONE /refresh fires even if several
   requests 401 at once; the rest wait in this queue for the new token. */
let isRefreshing = false;
let pendingRequests = [];

const flushQueue = (newToken) => {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
};

const forceLogout = async () => {
  await clearStorage();
  resetToLogin();
  Alert.alert("Session Expired", "Please login again.");
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const url = originalRequest.url || "";

    /* Never run refresh logic for the auth endpoints themselves. */
    const isAuthEndpoint =
      url.includes("/login") ||
      url.includes("/refresh") ||
      url.includes("/signup");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await forceLogout();
        return Promise.reject(error);
      }

      /* A refresh is already in flight — queue this request until it resolves. */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        /* Bare axios (not axiosInstance) so this call skips the interceptors. */
        const { data } = await axios.post(`${baseURL}/api/patientApp/refresh`, {
          refreshToken,
        });

        const newToken = data?.data?.token;
        const newRefresh = data?.data?.refreshToken;
        if (!newToken) {
          throw new Error("No token returned from refresh");
        }

        await saveTokens(newToken, newRefresh);
        isRefreshing = false;
        flushQueue(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        flushQueue(null);
        await forceLogout();
        return Promise.reject(refreshErr);
      }
    }

    /* Generic error handling for everything else. */
    let message = "";

    if (error.response) {
      message =
        error.response?.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
      message = "No response from server";
    } else {
      message = error.message;
    }

    Alert.alert("Error", message);

    return Promise.reject(error);
  }
);

export default axiosInstance;

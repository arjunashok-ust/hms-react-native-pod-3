import { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { resetToLogin } from "../navigation/RootNavigation";

export const attachErrorInterceptor = (client: AxiosInstance) => {
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            let customErrorMessage = "An unexpected network error occurred.";

            if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.message;

                if (status === 401 || status === 403) {
                    await SecureStore.deleteItemAsync("patient_jwt");
                    await SecureStore.deleteItemAsync("patient_profile");
                    resetToLogin();
                    customErrorMessage = "Your session has expired. Please log in again.";
                } else if (status >= 500) {
                    customErrorMessage = "The server is experiencing issues. Please try again later.";
                } else {
                    customErrorMessage = serverMessage || "Invalid request. Please check your data.";
                }
            } else if (error.request) {
                customErrorMessage = "Could not connect to the server. Please check your internet connection.";
            }

            error.message = customErrorMessage;
            return Promise.reject(error);
        }
    );
};
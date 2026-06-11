import axios from "axios";
import { attachAuthInterceptor } from "../interceptors/AuthInterceptor";
import { attachErrorInterceptor } from "../interceptors/ErrorInterceptor";

const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

attachAuthInterceptor(apiClient);
attachErrorInterceptor(apiClient);

export default apiClient;
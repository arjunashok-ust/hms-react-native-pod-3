import apiClient from "./apiClient";
import { LoginResponse } from "../features/auth/types";

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/api/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    register: async (payload: any) => {
        const response = await apiClient.post("/api/patients/mobile-register", payload);
        return response.data;
    },
};
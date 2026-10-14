import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY, tokenStorage } from "@hms/trpc-client";

const EMAIL_KEY = "email";
const PATIENT_ID_KEY = "patientId";

export interface Session {
  token: string;
  email: string;
  patientId: string;
}

export const saveSession = async ({ token, email, patientId }: Session) => {
  await Promise.all([
    tokenStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(EMAIL_KEY, email),
    AsyncStorage.setItem(PATIENT_ID_KEY, patientId),
  ]);
};

export const clearSession = async () => {
  await Promise.all([
    tokenStorage.removeItem(TOKEN_KEY),
    AsyncStorage.multiRemove([EMAIL_KEY, PATIENT_ID_KEY]),
  ]);
};

export const getStoredEmail = () => AsyncStorage.getItem(EMAIL_KEY);

export const getStoredPatientId = () => AsyncStorage.getItem(PATIENT_ID_KEY);

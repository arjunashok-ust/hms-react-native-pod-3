import axios from "axios";
import { Alert } from "react-native";

export const showError = (err: unknown) => {
  let message = "Something went wrong";

  if (axios.isAxiosError(err)) {
    message =
      err.response?.data?.message ||
      err.message ||
      "Server error";
  } else if (err instanceof Error) {
    message = err.message;
  }

  Alert.alert("Error", message);
};

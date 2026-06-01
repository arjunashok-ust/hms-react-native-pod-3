import axios from "axios";
import { Alert } from "react-native";

import { LoginRequestModel, SignUpRequestModel } from "../types/auth.types";

export const login = (data: LoginRequestModel) => {
  axios
    .post("http://10.0.2.2:8080/auth/login", data)
    .then((res) => {
      const token = res.data.token;
      const role = res.data.role;
      console.log(token);
      console.log(role);
      Alert.alert("Success", "Login Sucessfull");
    })
    .catch((err) => {
      Alert.alert("Failed", "Invalid Credentials");
    });
};

export const signUp = (data: SignUpRequestModel) => {
  axios.post("http://10.0.2.2:8080/auth/patientSignUp", data).then((res)=>{
    Alert.alert("Success","Account created sucessfully.");
  }).catch((err)=>{
    console.log(err);
    Alert.alert("Failed","Server error occured while creating account.");
  })
}

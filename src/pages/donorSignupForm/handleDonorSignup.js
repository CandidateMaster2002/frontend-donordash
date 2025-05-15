import React from "react";
import axiosInstance from "../../utils/myAxios";
import { DONOR_SIGNUP } from "../../constants/apiEndpoints";
import { handleUserLogin } from "../../utils/services";

export const handleDonorSignup = async (data,navigate) => {
  console.log("Data in handleDonorSignup:", data);
  try {
    const response = await axiosInstance.post(DONOR_SIGNUP, data);

    handleUserLogin({ email: data.email, password: data.password },navigate);
  } catch (error) {
    alert(
      "Error during signup. Ensure email id, mobile number & pan no are not registered already."
    );
    console.error("Error during signup:", error);
  }
};

import React from "react";
import axiosInstance from "../../utils/myAxios";
import { DONOR_SIGNUP } from "../../constants/apiEndpoints";
import { handleUserLogin } from "../../utils/services";

export const handleDonorSignup = async (data,navigate) => {
  try {
    const response = await axiosInstance.post(DONOR_SIGNUP, data);
alert(
      "Signup successful. Please login to continue."
    );

  } catch (error) {
    alert(
      "Error during signup. Ensure email id, mobile number & pan no are not registered already."
    );
    console.error("Error during signup:", error);
  }
};

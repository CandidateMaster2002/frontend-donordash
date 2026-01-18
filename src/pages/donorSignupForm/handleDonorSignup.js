import React from "react";
import axiosInstance from "../../utils/myAxios";
import { DONOR_SIGNUP } from "../../constants/apiEndpoints";
import { handleUserLogin } from "../../utils/services";

export const handleDonorSignup = async (data) => {
  try {
    await axiosInstance.post(DONOR_SIGNUP, data);
    return true;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

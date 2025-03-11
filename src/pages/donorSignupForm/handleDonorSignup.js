import React from "react";
import axiosInstance from "../../utils/myAxios";
import { DONOR_SIGNUP } from "../../constants/apiEndpoints";

export const handleDonorSignup = async (data) => {
 

  try {
    const response = await axiosInstance.post(DONOR_SIGNUP, data);
  } catch (error) {
    console.error("Error during signup:", error);
  }
};
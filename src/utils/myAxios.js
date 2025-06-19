import axios from "axios";
import { useLoading } from "../hooks/LoadingContext";
// import { useLoading } from "../LoadingContext";

const axiosInstance = axios.create({
  baseURL:"https://backend-donordash.onrender.com/"
});

// src/utils/myAxios.js

export const setupInterceptors = ({ showLoader, hideLoader }) => {
  axiosInstance.interceptors.request.use((config) => {
    showLoader?.();
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      hideLoader?.();
      return response;
    },
    (error) => {
      hideLoader?.();
      return Promise.reject(error);
    }
  );
};


export default axiosInstance;

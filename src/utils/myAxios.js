import axios from "axios";
// import { useLoading } from "../LoadingContext";

const axiosInstance = axios.create({
  baseURL:"https://backend-donordash.onrender.com/"
});

export const setupInterceptors = (showLoader, hideLoader) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      showLoader();  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      hideLoader();  // Hide loader on success
      return response;
    },
    (error) => {
      hideLoader();  // Hide loader on error
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;

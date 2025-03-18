import axios from "axios";
// import { useLoading } from "../LoadingContext";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/",
  baseURL:"https://backend-donordash.onrender.com/"
});

// Function to set up the interceptors after the context is provided
export const setupInterceptors = (showLoader, hideLoader) => {
  API.interceptors.request.use(
    (config) => {
      showLoader();  // Trigger the loader here
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  API.interceptors.response.use(
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
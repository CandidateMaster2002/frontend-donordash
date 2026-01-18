import axios from "axios";
// import { useLoading } from "../LoadingContext";

const axiosInstance = axios.create({
  // baseURL: "https://backend-donordash.onrender.com/",
  baseURL: "http://localhost:8080/",
});

export const setupInterceptors = (showLoader, hideLoader) => {
  const reqId = axiosInstance.interceptors.request.use((config) => {
    const sl = config.showLoader;
    // sl can be: true | "fullscreen" | { type:"inline", scope:"donations" } | { type:"button", scope:"btn1" }
    if (sl) {
      if (sl === true || sl === "fullscreen") showLoader("fullscreen");
      else if (typeof sl === "string" && sl === "inline")
        showLoader("inline", config.loaderScope || "default");
      else if (sl.type === "inline")
        showLoader("inline", sl.scope || "default");
      else if (sl.type === "fullscreen") showLoader("fullscreen");
    }
    return config;
  });

  const resId = axiosInstance.interceptors.response.use(
    (response) => {
      const sl = response.config?.showLoader;
      if (sl) {
        if (sl === true || sl === "fullscreen") hideLoader("fullscreen");
        else if (typeof sl === "string" && sl === "inline")
          hideLoader("inline", response.config.loaderScope || "default");
        else if (sl.type === "inline")
          hideLoader("inline", sl.scope || "default");
        else if (sl.type === "fullscreen") hideLoader("fullscreen");
      }
      return response;
    },
    (error) => {
      const cfg = error.config || {};
      const sl = cfg.showLoader;
      if (sl) {
        if (sl === true || sl === "fullscreen") hideLoader("fullscreen");
        else if (typeof sl === "string" && sl === "inline")
          hideLoader("inline", cfg.loaderScope || "default");
        else if (sl.type === "inline")
          hideLoader("inline", sl.scope || "default");
        else if (sl.type === "fullscreen") hideLoader("fullscreen");
      }
      return Promise.reject(error);
    }
  );

  // return eject function
  return () => {
    axiosInstance.interceptors.request.eject(reqId);
    axiosInstance.interceptors.response.eject(resId);
  };
};

// axiosInstance.interceptors.request.use(
//   (config) => {
//     showLoader();
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     hideLoader(); // Hide loader on success
//     return response;
//   },
//   (error) => {
//     hideLoader(); // Hide loader on error
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;

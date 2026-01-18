// AxiosInterceptor.jsx
import { useEffect } from "react";
import { useLoading } from "./LoadingContext";
import { setupInterceptors } from "./myAxios";

export default function AxiosInterceptor() {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // register interceptors once
    const eject = setupInterceptors(showLoader, hideLoader);

    // optional cleanup if setupInterceptors returns eject function
    return () => {
      if (typeof eject === "function") eject();
    };
  }, [showLoader, hideLoader]);

  return null;
}

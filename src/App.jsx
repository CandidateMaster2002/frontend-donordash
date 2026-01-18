import React from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import HeaderLoggedIn from "./components/HeaderLoggedIn";
import { getRedirectPath } from "./utils/services";
import { HeaderProvider } from "./utils/HeaderContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import FormAndDownload from "./PDF_Components/FormAndDownload";
const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  ``;

  if (
    !user &&
    location.pathname !== "/login-page" &&
    location.pathname !== "/donor-signup"
  ) {
    return <Navigate to="/login-page" />;
  }

  if (user && location.pathname === "/") {
    return <Navigate to={getRedirectPath(user.userType)} />;
  }

  return (
    <HeaderProvider>
      <div className="w-screen min-h-screen select-none cursor-default">
        {/* <FormAndDownload /> */}
        <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
          <HeaderLoggedIn />
        </div>
        {/* <div style={{ marginTop: '64px' }}> */}
        <div>
          <Outlet />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            style={{ zIndex: 9999 }}
          />
        </div>
      </div>
    </HeaderProvider>
  );
};

export default App;

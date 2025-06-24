import React from "react";
import CounselorDashBoard from "./CounselorDashBoard";
import UserDashboard from "./UserDashboard";

import LoginPage from "../pages/loginPage/LoginPage";
const LandingPage = () => {
  
  return (
    <>
      {localStorage.getItem("loggedInCounselor") ? (
        <CounselorDashBoard/>
      ) : localStorage.getItem("loggedInUser") ? (
        <UserDashboard />
      ) : (
        <LoginPage/>
      )}
    </>
  );
};

export default LandingPage;
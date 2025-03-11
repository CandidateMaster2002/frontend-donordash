import React from "react";
import CounselorDashBoard from "./CounselorDashBoard";
import UserDashboard from "./UserDashboard";
import CounselorLogin from "../CounselorLogin";
import UserLogin from "../UserLogin";
import LoginPage from "../LoginPage";
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
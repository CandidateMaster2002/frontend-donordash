import React from "react";
import donationMeterLogo from "../assets/images/donation-meter-logo.png";
import { useNavigate } from "react-router-dom";

const HeaderLoggedOut = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center"></div>
      <div className="w-screen h-[100px] bg-gradient-to-l from-purple-600 to-blue-300 shadow-lg p-4 flex items-center justify-center select-none cursor-default">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center justify-center"
        >
          <img
            src={donationMeterLogo}
            alt="DonationMeter Logo"
            className="h-60 xs:h-12" // Adjust height to fit the header
          />
        </div>
      </div>
    </>
  );
};

export default HeaderLoggedOut;

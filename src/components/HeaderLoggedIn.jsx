import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { signoutUser } from "../utils/services";
import donationMeterLogo from "../assets/images/donation-meter-logo.png";
import { getLoggedInIdFromLocalStorage } from "../utils/services";

const HeaderLoggedIn = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signoutUser();
    navigate("/login-page");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <div className="h-[70px] bg-gradient-to-l from-purple-600 to-blue-300 shadow-lg p-4 flex justify-between items-center border border-4">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center"
      >
        <img
          src={donationMeterLogo}
          alt="DonationMete₹ Logo"
          className="h-40 sm:h-12" // Adjust height to fit the header
        />
      </div>

      {/* Profile Icon and Dropdown */}
      <div className="relative pr-4">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/20 transition-all "
        >
          <FaUserCircle className="h-6 w-6 text-white" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
            <button
              onClick={() => navigate( `/donor-profile/${getLoggedInIdFromLocalStorage()}`)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 transition-all"
            >
              Profile
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center space-x-2">
                <GoSignOut className="h-5 w-5" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderLoggedIn;
import React, { useEffect } from "react";
import axiosInstance from "../../utils/myAxios";
import { USER_LOGIN } from "../../constants/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { getRedirectPath } from "../../utils/services";
import HeaderLoggedOut from "../../components/HeaderLoggedOut";
import iskconDhanbadLogo from "../../assets/images/iskcon_dhanbad_logo-removebg.png";
import radhaGovindaji from "../../assets/images/radha_govindji3.png";
import prabhupada from "../../assets/images/prabhupada2.png";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate(getRedirectPath(user.userType));
    }
  }, [navigate]);

  const handleUserLogin = async (credentials) => {
    try {
      const response = await axiosInstance.post(USER_LOGIN, credentials);
      const { userType } = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate(getRedirectPath(userType));
    } catch (error) {
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
      console.error("Login failed", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const mobileNumber = event.target.mobileNumber.value;
    const password = event.target.password.value;
    handleUserLogin({ mobileNumber, password });
  };


  return (
    <>
      <HeaderLoggedOut />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8  bg-gradient-to-r from-purple-300 to-blue-200">
        <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-lg shadow-2xl  bg-gradient-to-r from-purple-200 to-blue-100">
          {/* Logo Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <img
              src={radhaGovindaji}
              alt="Radha Govindaji"
              className="h-20 md:h-24 hidden md:block"
            />
            <img
              src={iskconDhanbadLogo}
              alt="ISKCON Dhanbad Logo"
              className="h-20 md:h-24"
            />
            <img
              src={prabhupada}
              alt="Srila Prabhupada"
              className="h-20 md:h-24 hidden md:block"
            />
          </div>

          {/* Heading Section */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-purple-800">
              Welcome to Donor Dash
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please login to track all donations made to ISKCON Dhanbad and
              download receipts.
            </p>
          </div>

          {/* Login Form */}
          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            method="POST"
          >
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px *:max-w-lg *:mx-auto">
              {/* Mobile Number Input */}
              <div className="my-4 ">
                <label htmlFor="mobile-number" className="sr-only">
                  Mobile Number
                </label>
                <input
                  id="mobile-number"
                  name="mobileNumber"
                  type="tel"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Mobile Number"
                />
              </div>

              <div className="my-2">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="max-w-sm mx-auto">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
              >
                Login
              </button>
            </div>
          </form>

          {/* Signup Link */}
          <div className="text-center">
            <a
              href="/donor-signup"
              className="text-lg text-purple-600 hover:text-purple-500 transition-all"
            >
              First time user? Create account
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

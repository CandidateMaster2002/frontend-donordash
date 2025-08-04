import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiHome,
  FiMapPin,
  FiLock,
} from "react-icons/fi";
import { FaIdCard, FaHandshake } from "react-icons/fa";
import { validations } from "../../utils/validations";
import useFetchCityAndState from "../../hooks/useFetchCityAndState";
import { handleDonorSignup } from "./handleDonorSignup";
import { useNavigate } from "react-router-dom";
import { zones } from "../../constants/constants";
import { useLocation } from "react-router-dom";
import { getRedirectPath, getAllDonorCultivators, checkDonorRegisteredByMobile } from "../../utils/services";

const DonorSignupForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [donorCultivators, setDonorCultivators] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkResult, setCheckResult] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);

  const location = useLocation();
const preselectedCultivatorId = location.state?.preselectedCultivatorId || null;


  const handleCheckMobile = async () => {
    setCheckLoading(true);
    const mobile = methods.getValues("mobileNumber");
    if (mobile) {
      const result = await checkDonorRegisteredByMobile(mobile);
      setCheckResult(result);
    }
    setCheckLoading(false);
  };

  useEffect(() => {
    const fetchDonorCultivators = async () => {
      try {
        const cultivators = await getAllDonorCultivators();
        setDonorCultivators(cultivators);
      } catch (error) {
        console.error("Error fetching donor cultivators:", error);
      }
    };
    fetchDonorCultivators();
  }, [navigate]);

  const methods = useForm({
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      password: "",
      remark: "Not Mentioned",
      zone: "Other",
       donorCultivatorId: preselectedCultivatorId || "",
    },
  });

  const pincode = useWatch({ control: methods.control, name: "pincode" });

  useEffect(() => {
    methods.register("confirmPassword", {
      validate: (value) =>
        value === methods.getValues("password") || "Passwords do not match",
    });
  }, [methods]);

  useFetchCityAndState(pincode, methods.setValue);

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      data.donorCultivatorId = parseInt(data.donorCultivatorId, 10);
      delete data.confirmPassword;
      if (data.panNumber === "") delete data.panNumber;
      const success = await handleDonorSignup(data, navigate);
      if (success) methods.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field) => {
    const error = methods.formState.errors[field];
    return error ? (
      <span className="text-red-500 text-xs mt-1">
        {validations[field].validation.errorMessages[error.type]}
      </span>
    ) : null;
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Donor Registration
            </h1>

            <form
              onSubmit={methods.handleSubmit(onFormSubmit)}
              className="space-y-5"
            >
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Personal Information
                </h2>

                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    {...methods.register("name", validations.name.validation)}
                    placeholder="Legal Name / वैध नाम"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {renderError("name")}
                </div>

                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      maxLength={10}
                      {...methods.register(
                        "mobileNumber",
                        validations.mobileNumber.validation
                      )}
                      placeholder="Mobile Number / मोबाइल नंबर"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {renderError("mobileNumber")}
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckMobile}
                    disabled={checkLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {checkLoading ? "Checking..." : "Check"}
                  </button>
                </div>

                {checkResult && !checkResult.donorRegistered && (
                  <p className="text-sm text-red-600 mt-1">
                    Donor not registered.
                  </p>
                )}

                {checkResult && checkResult.donorRegistered && (
                  <div className="mt-3 p-3 border rounded bg-yellow-50 text-sm text-gray-800">
                    <p>
                      <strong>Donor Id:</strong>
                      {checkResult.id}
                    </p>
                    <p>
                      <strong>Name:</strong> {checkResult.name}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {checkResult.mobileNumber}
                    </p>
                    <p>
                      <strong>Address:</strong> {checkResult.address},{" "}
                      {checkResult.city}, {checkResult.state},{" "}
                      {checkResult.pincode}
                    </p>
                    <p>
                      <strong>Connected To:</strong>{" "}
                      {checkResult?.donorCultivatorName}
                    </p>
                  </div>
                )}

                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    {...methods.register('email', validations.email.validation)}
                    placeholder="Email / ईमेल (optional)"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {renderError('email')}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Address Information
                </h2>

                <div className="relative">
                  <FiHome className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    {...methods.register(
                      "address",
                      validations.address.validation
                    )}
                    placeholder="Full Address / पूरा पता"
                    rows="3"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {renderError("address")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      {...methods.register(
                        "pincode",
                        validations.pincode.validation
                      )}
                      placeholder="Pincode / पिनकोड"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {renderError("pincode")}
                  </div>

                  <div>
                    <input
                      type="text"
                      {...methods.register("city", validations.city.validation)}
                      placeholder="City / शहर"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      {...methods.register(
                        "state",
                        validations.state.validation
                      )}
                      placeholder="State / राज्य"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      {...methods.register(
                        "panNumber",
                        validations.panNumber.validation
                      )}
                      placeholder="PAN Number / पैन नंबर (optional)"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {renderError("panNumber")}
                    <p className="text-xs text-gray-500 mt-1">
                      For 80G tax benefit PAN is compulsory
                    </p>
                  </div>

                  <div className="relative">
                    <FaHandshake className="absolute left-3 top-3 text-gray-400" />
                    <select
                      {...methods.register(
                        "donorCultivatorId",
                        validations.connectedTo.validation
                      )}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Connected To / किससे जुड़े हैं?</option>
                      {donorCultivators.map((cultivator) => (
                        <option key={cultivator.id} value={cultivator.id}>
                          {cultivator.name}
                        </option>
                      ))}
                    </select>
                    {renderError("connectedTo")}
                  </div>
                </div>

                <div>
                  <select
                    {...methods.register("zone", validations.zone.validation)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Zone / क्षेत्र चुनें</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.value}>
                        {zone.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Account Security
                </h2>

                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    {...methods.register(
                      "password",
                      validations.password.validation
                    )}
                    placeholder="Password / पासवर्ड"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {renderError("password")}
                </div>

                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    {...methods.register("confirmPassword")}
                    placeholder="Confirm Password / पासवर्ड की पुष्टि"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {renderError("confirmPassword")}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || checkResult?.donorRegistered === true}
                className={`w-full py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting || checkResult?.donorRegistered === true
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default DonorSignupForm;

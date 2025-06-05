import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { donationPurposes, paymentModes } from "../../constants/constants";
import { validations } from "../../utils/validations";
import axiosInstance from "../../utils/myAxios";
import { DONATE, DONORS_FILTER } from "../../constants/apiEndpoints";
import {
  getDonorCultivatorIdFromLocalStorage,
  getDonorIdFromLocalStorage,
  getDonorSupervisorIdForAdminFromLocalStorage,
  getUserTypeFromLocalStorage,
} from "../../utils/services";
import { handleRazorpayPayment } from "../../utils/razorpayPayment";
import BankDetails from "../../components/BankDetails";

const DonateNowPopup = ({
  amount,
  purpose,
  closePopup,
  setShowSuccessPopup,
  setSuccessMessage,
}) => {
  const [showTransactionId, setShowTransactionId] = useState(false);
  const [showPaymentDate, setShowPaymentDate] = useState(false);
  const [donors, setDonors] = useState([]);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const userType = getUserTypeFromLocalStorage();

  const handleSuccess = () => {
    setSuccessMessage("Your donation has been successful!");
    setShowSuccessPopup(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      purpose: purpose || "",
      paymentMode: "",
      remark: "",
      transactionId: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amount: amount || "",
      donorId: userType === "donor" ? getDonorIdFromLocalStorage() : "",
    },
  });

  useEffect(() => {
    if (userType === "donorCultivator") {
      fetchDonors({ donorCultivator: getDonorCultivatorIdFromLocalStorage() });
    }
    if (userType === "admin") {
      fetchDonors({
        donationSupervisor: getDonorSupervisorIdForAdminFromLocalStorage(),
      });
    }
  }, [userType]);

  const fetchDonors = async (params) => {
    try {
      const response = await axiosInstance.get(DONORS_FILTER, { params });
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error.message);
    }
  };

  const onSubmit = async (data) => {
    const donationData = {
      amount: data.amount,
      purpose: data.purpose,
      paymentMode: data.paymentMode,
      transactionId: data.transactionId || null,
      paymentDate: data.paymentDate || new Date().toISOString().split("T")[0],
      status: "Pending",
      remark: data.remark,
      donorId:
        userType === "donor" ? getDonorIdFromLocalStorage() : data.donorId,
      createdAt: new Date().toISOString(),
    };

    try {
      if (donationData.paymentMode === "Razorpay") {
        await handleRazorpayPayment(donationData);
      } else {
        const response = await axiosInstance.post(DONATE, donationData);
      }
      closePopup();
      handleSuccess();
    } catch (error) {
      console.error("Donation failed:", error.message);
      alert("Donation failed: " + error.message);
    }
  };

  const handlePaymentModeChange = (e) => {
    const selectedMethod = e.target.value;
    setShowTransactionId(
      selectedMethod === "Cheque" || selectedMethod === "Bank Transfer"
    );
    setShowBankDetails(selectedMethod === "Bank Transfer");
    setShowPaymentDate(selectedMethod !== "Razorpay");
  };

  

  return (
   <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">

      <div className="rounded-lg shadow-lg w-full max-w-md relative max-h-[80vh] flex flex-col">
        <div className="p-6 overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            onClick={closePopup}
          >
            &times;
          </button>
          <h3 className="text-2xl font-semibold mb-6 text-center">Donate Now</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(userType === "admin" || userType === "donorCultivator") && (
              <div>
                <label className="block mb-2 font-medium">Donor:</label>
                <select
                  {...register("donorId", {
                    required: "Please select a donor",
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Donor</option>
                  {donors.map((donor) => (
                    <option key={donor.id} value={donor.id}>
                      {donor.username}
                    </option>
                  ))}
                </select>
                {errors.donorId && (
                  <span className="text-red-500 text-sm">
                    {errors.donorId.message}
                  </span>
                )}
              </div>
            )}
            
            <div>
              <label className="block mb-2 font-medium">Amount:</label>
              <input
                type="number"
                {...register("amount", {
                  required: "Please enter the amount",
                  valueAsNumber: true,
                })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.amount && (
                <span className="text-red-500 text-sm">
                  {errors.amount.message}
                </span>
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Purpose:</label>
              <select
                {...register("purpose", {
                  required: "Please select a purpose",
                })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Purpose</option>
                {donationPurposes.map((purpose, index) => (
                  <option key={index} value={purpose.value}>
                    {purpose.value}
                  </option>
                ))}
              </select>
              {errors.purpose && (
                <span className="text-red-500 text-sm">
                  {errors.purpose.message}
                </span>
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Payment Method:</label>
              <select
                {...register("paymentMode", {
                  required: validations.paymentMode.validation.required,
                })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handlePaymentModeChange}
              >
                <option value="">Select Payment Method</option>
                {paymentModes.map((method, index) => (
                  <option key={index} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.paymentMode && (
                <span className="text-red-500 text-sm">
                  {validations.paymentMode.validation.errorMessages.required}
                </span>
              )}
            </div>
            
            {showBankDetails && (  <BankDetails />)}
          
            
            {showTransactionId &&
              (userType === "admin" || userType === "donorCultivator") && (
                <div>
                  <label className="block mb-2 font-medium">UTR No.</label>
                  <input
                    type="text"
                    {...register("transactionId", {
                      validate: (value) =>
                        (userType !== "admin" &&
                          userType !== "donorCultivator") ||
                        value.trim() !== "" ||
                        "Please enter UTR No.",
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.transactionId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transactionId.message}
                    </p>
                  )}
                </div>
              )}

            {showPaymentDate && (
              <div>
                <label className="block mb-2 font-medium">Payment Date:</label>
                <input
                  type="date"
                  {...register("paymentDate")}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div>
              <label className="block mb-2 font-medium">Remark:</label>
              <textarea
                {...register("remark")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="bg-blue-500 text-white py-3 px-6 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateNowPopup;
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { donationPurposes, paymentModes } from "../../constants/constants";
import { validations } from "../../utils/validations";
import axiosInstance from "../../utils/myAxios";
import { DONATE, DONORS_FILTER } from "../../constants/apiEndpoints";
import { getDonorById,getDonorsByCultivator } from "../../utils/services";
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
  const [FieldNameUTR, setFieldNameUTR] = useState(
    "UTR No (12 digit numeric transaction ID)"
  );
  const [generateReceipt, setGenerateReceipt] = useState(true);
  const [showGenerateReceiptCheckbox, setShowGenerateReceiptCheckbox] =
    useState(false);
  const userType = getUserTypeFromLocalStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [existingDonation, setExistingDonation] = useState(null);
  const [allowOtherCultivatorDonors, setAllowOtherCultivatorDonors] =
    useState(false);
  const [selectedDonorDetails, setSelectedDonorDetails] = useState(null);
  const [cultivatorDonors, setCultivatorDonors] = useState([]);
  const [shownDonors, setShownDonors] = useState([]);

  const handleSuccess = () => {
    setSuccessMessage("Your donation has been successful!");
    setShowSuccessPopup(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      purpose: purpose || "",
      paymentMode: "",
      remark: "",
      transactionId: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amount: amount || "",
      donorId: userType === "donor" ? getDonorIdFromLocalStorage() : "",
      donorCultivatorId: "",
    },
  });

  useEffect(() => {
    if (userType === "donorCultivator") {
      fetchDonors();
    }
    if (userType === "admin") {
      fetchDonors({
        donationSupervisor: getDonorSupervisorIdForAdminFromLocalStorage(),
      });
    }
  }, [userType]);

  // Show the right donor list depending on checkbox and userType
  useEffect(() => {
    // console.log(userType)
    if (userType === "admin") {
      setShownDonors(donors);
    } else if (userType === "donorCultivator") {
      // console.log(allowOtherCultivatorDonors)
      setShownDonors(allowOtherCultivatorDonors ? donors : cultivatorDonors);
      console.log("Cultivator Donors:", cultivatorDonors);
    }
  }, [donors, cultivatorDonors, allowOtherCultivatorDonors, userType]);

  const handleDonorChange = async (e) => {
    const donorId = e.target.value;
    setValue("donorId", donorId);
    if (donorId) {
      try {
        const donorData = await getDonorById(donorId);
        // console.log("Selected Donor Data:", donorData);
        setSelectedDonorDetails(donorData);
      } catch (error) {
        console.error("Failed to fetch donor details:", error);
        setSelectedDonorDetails(null);
      }
    } else {
      setSelectedDonorDetails(null);
    }
  };

  const fetchDonors = async (params) => {
    try {
      const response = await axiosInstance.get(DONORS_FILTER, { params });
      setDonors(response.data);
      if (userType === "donorCultivator") {
        const cultivatorResponse = await getDonorsByCultivator(7);
        console.log("cultivatorId", getDonorCultivatorIdFromLocalStorage());
        console.log("Cultivddator Donors from api", cultivatorResponse);
        setCultivatorDonors(cultivatorResponse);
      }
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
      notGenerateReceipt:
        data.paymentMode === "Cash" ? !generateReceipt : false,
      collectedById: getDonorCultivatorIdFromLocalStorage(),
      donorId:
        userType === "donor" ? getDonorIdFromLocalStorage() : data.donorId,
      createdAt: new Date().toISOString(),
    };

    if (userType === "donorCultivator") {
      const donorExists = cultivatorDonors.some(
        (donor) => donor.donorId === donationData.donorId
      );
      if (!donorExists) {
        donationData.status = "Unapproved";
      }
    }

    try {
      if (donationData.paymentMode === "Razorpay") {
        const donor = await getDonorById(donationData.donorId);
        const {
          donations,
          donorCultivator,
          type,
          catoegory,
          specialDays,
          ...donorDataRest
        } = donor;

        await handleRazorpayPayment(donationData, donorDataRest);
      } else {
        const response = await axiosInstance.post(DONATE, donationData);
        if (response?.data?.alreadyExists === true) {
          setExistingDonation(response.data.donation);
          return;
        }
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
      selectedMethod === "Cheque" ||
        selectedMethod === "Bank Transfer" ||
        selectedMethod === "Razorpay Link"
    );
    setShowGenerateReceiptCheckbox(selectedMethod === "Cash");
    if (selectedMethod === "Razorpay Link")
      setFieldNameUTR("Razorpay Transaction ID starting with 'pay_'");
    else setFieldNameUTR("UTR No.(12 digit numeric transaction ID)");
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
            type="button"
          >
            &times;
          </button>
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Donate Now
          </h3>

          {existingDonation && (
            <div className="mb-4 p-4 border border-yellow-400 bg-yellow-100 rounded text-sm text-yellow-800">
              <h4 className="font-semibold text-base mb-2">
                Duplicate Donation Detected
              </h4>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {existingDonation.transactionId}
              </p>
              <p>
                <strong>Amount:</strong> ₹{existingDonation.amount}
              </p>
              <p>
                <strong>Purpose:</strong> {existingDonation.purpose}
              </p>
              <p>
                <strong>Status:</strong> {existingDonation.status}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {new Date(existingDonation.paymentDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(userType === "admin" || userType === "donorCultivator") && (
              <div>
                {userType === "donorCultivator" && (
                  <div className="mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allowOtherCultivatorDonors"
                      checked={allowOtherCultivatorDonors}
                      onChange={(e) =>
                        setAllowOtherCultivatorDonors(e.target.checked)
                      }
                    />
                    <label htmlFor="allowOtherCultivatorDonors" className="text-sm">
                      Do you want to add donation for other cultivator's donor?
                    </label>
                  </div>
                )}

                <label className="block mb-2 font-medium">Search Donor:</label>
                <input
                  type="text"
                  placeholder="Search donor by name or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block mb-2 font-medium">Donor:</label>
                <select
                  {...register("donorId", { required: "Please select a donor" })}
                  onChange={handleDonorChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Donor</option>
                  {shownDonors
                    .filter(
                      (donor) =>
                        donor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        donor.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((donor) => (
                      <option key={donor.donorId} value={donor.donorId}>
                        {donor.username}
                      </option>
                    ))}
                </select>
                {errors.donorId && (
                  <span className="text-red-500 text-sm">
                    {errors.donorId.message}
                  </span>
                )}

                {selectedDonorDetails && (
                  <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50 text-sm">
                    <p><strong>Name:</strong> {selectedDonorDetails?.name}</p>
                    <p><strong>Address:</strong> {selectedDonorDetails?.address || "N/A"}</p>
                    <p><strong>Mobile:</strong> {selectedDonorDetails?.mobileNumber || "N/A"}</p>
                    <p><strong>PAN:</strong> {selectedDonorDetails?.panNumber || "N/A"}</p>
                    <p><strong>Cultivator Name:</strong> {selectedDonorDetails?.donorCultivator?.name || "N/A"}</p>
                  </div>
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

            {showGenerateReceiptCheckbox && (
              <div className="mt-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="generateReceipt"
                  checked={generateReceipt}
                  onChange={(e) => setGenerateReceipt(e.target.checked)}
                  className="mt-1"
                />
                <label
                  htmlFor="generateReceipt"
                  className="text-2xl font-bold text-red-900"
                >
                  Do you need receipt for this?
                </label>
              </div>
            )}

            {showBankDetails && <BankDetails />}

            {showTransactionId &&
              (userType === "admin" || userType === "donorCultivator") && (
                <div>
                  <label className="block mb-2 font-medium">
                    {FieldNameUTR}
                  </label>
                  <input
                    type="text"
                    {...register("transactionId", {
                      validate: (value) =>
                        (userType !== "admin" &&
                          userType !== "donorCultivator") ||
                        value.trim() !== "" ||
                        "Please enter a UTR no.",
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
            <div className="p-0">
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                Pay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonateNowPopup;
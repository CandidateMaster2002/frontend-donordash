import axiosInstance from "./myAxios";

import {
  DONATIONS_BY_DONOR_ID,
  DONORS_FILTER,
  DONATE,
  DONATIONS_FILTER,
  DONATIONS_FILTER_SUM,
  ALL_DONOR_CULTIVATORS,
  GET_DONOR_BY_ID,
  EDIT_DONOR,
  ALL_SPECIAL_DAYS_BY_DONOR_ID,
  EDIT_DONATION,
  GET_RECEIPT,
  CHANGE_STATUS,
  USER_LOGIN,
  UNAPPROVED_DONATIONS_BY_CULTIVATOR,
  CHECK_DONOR_REGSITERED_BY_MOBILE,
  REQUEST_ACQUIRE_DONOR,
  REQUEST_DONOR_RELEASE,
  DONOR_APPROVE_ACQUIRE,
  DONOR_APPROVE_RELEASE,
  GET_PENDING_DONOR_TRANSFERS,
  ALL_DONATIONS,
} from "../constants/apiEndpoints";

export const getRedirectPath = (userType) => {
  switch (userType) {
    case "donor":
      return "/donor-home";
    case "donationSupervisor":
      return "/supervisor-home";
    case "donorCultivator":
      return "/donor-cultivator-home";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/login-page";
  }
};

export const signoutUser = () => {
  localStorage.removeItem("user");
};

export const getLoggedInIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.userDetails?.id;
};

export const getDonorIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "donor") {
    return user.userDetails?.id;
  }
  return null;
};

export const getDonationSupervisorFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "donationSupervisor") {
    return user.userDetails;
  }
  return null;
};

export const getDonationSupervisorIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "donationSupervisor") {
    return user.userDetails?.id;
  }
  return null;
};

export const getDonorFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "donor") {
    return user.userDetails;
  }
};

export const getDonorCultivatorFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "donorCultivator") {
    return user.userDetails;
  }
};

export const getDonorCultivatorIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "donorCultivator") {
    return user.userDetails?.id;
  }
  return null;
};

export const getDonorSupervisorIdForAdminFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "admin") {
    return user.userDetails?.donationSupervisor?.id;
  }
  return null;
};

export const getAdminIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userType === "admin") {
    return user.userDetails?.id;
  }
  return null;
};

export const getUserTypeFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.userType : null;
};

export const changeDonationStatus = async (donationId, newStatus) => {
  try {
    const response = await axiosInstance.put(
      `${CHANGE_STATUS}/${donationId}/${newStatus}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error changing donation status:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to change donation status"
    );
  }
};

export const getUnApprovedDonationsByCultivator = async (cultivatorId) => {
  try {
    const response = await axiosInstance.get(
      `${UNAPPROVED_DONATIONS_BY_CULTIVATOR}/${cultivatorId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching unapproved donations:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch unapproved donations"
    );
  }
};

export const getDonorById = async (donorId) => {
  try {
    const response = await axiosInstance.get(`${GET_DONOR_BY_ID}/${donorId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching donor by ID:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch donor by ID"
    );
  }
};

export const requiredTransactionIdForStatusChange = (donation, newStatus) => {
  return (
    newStatus === "Verified" &&
    donation.paymentMode !== "Cash" &&
    !donation.transactionId
  );
};

export const getDonationsByDonorId = async (donorId) => {
  try {
    const response = await axiosInstance.get(
      `${DONATIONS_BY_DONOR_ID}/${donorId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching donations:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch donations"
    );
  }
};

export const editDonorById = async (donorId, donorData) => {
  try {
    const response = await axiosInstance.put(
      `${EDIT_DONOR}/${donorId}`,
      donorData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error editing donor:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to edit donor");
  }
};

export const getDonorsByCultivator = async (donorCultivatorId) => {
  try {
    const response = await axiosInstance.get(DONORS_FILTER, {
      params: { donorCultivator: donorCultivatorId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching donors by cultivator:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch donors by cultivator"
    );
  }
};

export const getDonors = async (params) => {
  try {
    const response = await axiosInstance.get(DONORS_FILTER, params);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching donors:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch donors");
  }
};

export const handleUserLogin = async (credentials, navigate) => {
  try {
    const response = await axiosInstance.post(USER_LOGIN, credentials);
    const { userType } = response.data;
    localStorage.setItem("user", JSON.stringify(response.data));
    navigate(getRedirectPath(userType));
  } catch (error) {
    alert("Login failed: " + (error.response?.data?.message || error.message));
    console.error("Login failed", error);
  }
};
export const getAllDonorCultivators = async () => {
  try {
    const response = await axiosInstance.get(ALL_DONOR_CULTIVATORS);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching donor cultivators:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch donor cultivators"
    );
  }
};

export const requestAcquireDonor = async (donorId, cultivatorId) => {
  try {
    const response = await axiosInstance.post(
      `${REQUEST_ACQUIRE_DONOR}`,
      null,
      {
        params: { donorId, requestedById: cultivatorId },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to request donor acquisition"
    );
  }
};

export const getPendingDonorTransfers = async (cultivatorId) => {
  try {
    const response = await axiosInstance.get(
      `${GET_PENDING_DONOR_TRANSFERS}/${cultivatorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pending donor transfers:", error.message);
    throw error;
  }
};

// 2. Request to Release a Donor
export const requestDonorRelease = async (donorId, fromId, toId) => {
  try {
    const response = await axiosInstance.post(
      `${REQUEST_DONOR_RELEASE}`,
      null,
      {
        params: { donorId, fromId, toId },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to request donor release");
  }
};

// 3. Approve Donor Acquisition
export const approveDonorAcquire = async (donorId, fromId, toId) => {
  try {
    const response = await axiosInstance.post(
      `${DONOR_APPROVE_ACQUIRE}`,
      null,
      {
        params: { donorId, fromId, toId },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to approve acquisition");
  }
};

// 4. Approve Donor Release
export const approveDonorRelease = async (donorId, fromId, toId) => {
  try {
    const response = await axiosInstance.post(
      `${DONOR_APPROVE_RELEASE}`,
      null,
      {
        params: { donorId, fromId, toId },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to approve release");
  }
};

export const donate = async (donationData) => {
  try {
    const response = await axiosInstance.post(DONATE, donationData);
    return response.data;
  } catch (error) {
    console.error(
      "Donation failed1:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to process donation"
    );
  }
};

export const fetchDonations = async (filterDto) => {
  try {
    const response = await axiosInstance.post(DONATIONS_FILTER, filterDto);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the donations!", error);
    throw error;
  }
};

export const fetchAllDonations = async () => {
  try {
    const response = await axiosInstance.get(ALL_DONATIONS);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the donations!", error);
    throw error;
  }
};

export const fetchSpecialDaysByDonorId = async (donorId) => {
  try {
    const response = await axiosInstance.get(
      `${ALL_SPECIAL_DAYS_BY_DONOR_ID}/${donorId}`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the special days!", error);
    throw error;
  }
};

export const checkDonorRegisteredByMobile = async (mobileNumber) => {
  try {
    const response = await axiosInstance.get(
      `${CHECK_DONOR_REGSITERED_BY_MOBILE}?mobileNumber=${mobileNumber}`
    );

    return response.data; // This will include donorRegistered: true/false and details if true
  } catch (error) {
    console.error("Error checking donor registration:", error.message);
    return {
      donorRegistered: false,
      error: "Unable to verify donor. Please try again later.",
    };
  }
};

export const fetchDonationSummary = async (params) => {
  try {
    const response = await axiosInstance.get(DONATIONS_FILTER_SUM, { params });
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the donation summary!", error);
    throw error;
  }
};

export const editDonation = async (donationId, donationData) => {
  try {
    const response = await axiosInstance.put(
      `${EDIT_DONATION}/${donationId}`,
      donationData
    );
    return response.data;
  } catch (error) {
    console.error("There was an error editing the donation!", error);
    throw error;
  }
};

export const getReceiptByDonationId = async (donationId) => {
  try {
    const response = await axiosInstance.get(`${GET_RECEIPT}/${donationId}`);
    console.log("Receipt response data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching receipt:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch receipt");
  }
};

//13 Jan 2002
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear().toString();

  return `${day} ${month} ${year}`;
};

export const formatDateDDMMYYYY = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Verified":
      return "bg-green-100 text-green-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    case "Cancelled":
      return "bg-gray-100 text-gray-700";
    case "Unapproved":
      return "bg-blue-100 text-blue-700";
    default:
      return "";
  }
};

export const fetchDonationSummaryData = async (
  filter,
  cultivatorId,
  setSummaryData
) => {
  const params = {
    cultivatorId: cultivatorId,
    dateFrom: filter.startDate,
    dateTo: filter.endDate,
    status: "Verified",
  };

  try {
    const purposeSummary = await fetchDonationSummary({
      ...params,
      parameter: "purpose",
    });
    const zoneSummary = await fetchDonationSummary({
      ...params,
      parameter: "zone",
    });

    const paymentModeSummary = await fetchDonationSummary({
      ...params,
      parameter: "payment_mode",
    });

    const cultivatorSummary = await fetchDonationSummary({
      ...params,
      parameter: "cultivator",
    });

    const formattedPurposeSummary = Object.entries(purposeSummary).map(
      ([description, amount]) => ({
        description,
        amount,
      })
    );
    const formattedZoneSummary = Object.entries(zoneSummary).map(
      ([description, amount]) => ({
        description,
        amount,
      })
    );

    const formattedPaymentModeSummary = Object.entries(paymentModeSummary).map(
      ([description, amount]) => ({
        description,
        amount,
      })
    );

    const formattedCultivatorSummary = Object.entries(cultivatorSummary).map(
      ([description, amount]) => ({
        description,
        amount,
      })
    );

    setSummaryData({
      purpose: formattedPurposeSummary,
      zone: formattedZoneSummary,
      paymentMode: formattedPaymentModeSummary,
      cultivator: formattedCultivatorSummary,
    });
  } catch (error) {
    console.error("Error fetching donation summary:", error);
  }
};

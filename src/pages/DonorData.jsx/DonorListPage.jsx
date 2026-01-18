import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDonors,
  getAllDonorCultivators,
  getDonorCultivatorIdFromLocalStorage,
  getDonorCultivatorFromLocalStorage,
  requestDonorRelease,
  requestAcquireDonor,
} from "../../utils/services";
import PendingTransferRequests from "./PendingTransferRequests";
import InlineLoader from "../../utils/InlineLoader";

const DonorListPage = () => {
  const [myDonors, setMyDonors] = useState([]);
  const [otherDonors, setOtherDonors] = useState([]);
  const [cultivators, setCultivators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestsTab, setShowRequestsTab] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithoutPAN, setShowWithoutPAN] = useState(false);
  const navigate = useNavigate();
  const myCultivatorId = getDonorCultivatorIdFromLocalStorage();
  const cultivatorName = getDonorCultivatorFromLocalStorage()?.name || "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allDonors, cultivatorList] = await Promise.all([
        getDonors(),
        getAllDonorCultivators(),
      ]);

      const filteredMyDonors = allDonors.filter(
        (d) => d.cultivatorName == cultivatorName
      );
      const filteredOtherDonors = allDonors.filter(
        (d) => d.cultivatorName != cultivatorName
      );

      setMyDonors(filteredMyDonors);
      setOtherDonors(filteredOtherDonors);
      setCultivators(cultivatorList);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleShowDonorProfile = (donorId) => {
    navigate(`/donor-profile/${donorId}`);
  };

  const handleReleaseRequest = async (donorId, targetCultivatorId) => {
    if (!targetCultivatorId) return;

    try {
      await requestDonorRelease(donorId, myCultivatorId, targetCultivatorId);
      alert("Release request submitted successfully");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAcquireRequest = async (donorId) => {
    try {
      await requestAcquireDonor(donorId, myCultivatorId);
      alert("Acquire request submitted successfully");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredMyDonors = myDonors.filter((d) =>
    d?.donorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered My Donors:", filteredMyDonors);

  const filteredOtherDonors = otherDonors.filter((d) =>
    d?.donorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Donor Management
            </h1>
            <p className="text-gray-600 mb-6">
              Manage your donors and transfer requests
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search donors by name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showRequestsTab
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                onClick={() => setShowRequestsTab(!showRequestsTab)}
              >
                {showRequestsTab ? (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Hide Requests
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    View Pending Requests
                  </span>
                )}
              </button>
            </div>
            <InlineLoader scope="donor-list">
              {showRequestsTab ? (
                <PendingTransferRequests />
              ) : (
                <>
                  <section className="mb-8 ">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        My Donors
                      </h2>

                      <div className="flex items-center gap-4">
                        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                          {filteredMyDonors.length} Donors
                        </span>

                        {/* Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                            Show donors without PAN
                          </span>

                          <button
                            type="button"
                            role="switch"
                            aria-checked={showWithoutPAN}
                            onClick={() => setShowWithoutPAN((s) => !s)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 ${
                              showWithoutPAN
                                ? "bg-green-500 focus:ring-green-300"
                                : "bg-gray-300 focus:ring-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                showWithoutPAN
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </label>
                      </div>
                    </div>

                    {filteredMyDonors.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                          {searchTerm
                            ? "No matching donors found"
                            : "You don't have any donors assigned yet"}
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredMyDonors
                          .filter((donor) =>
                            showWithoutPAN ? donor?.panNumber == null : true
                          )
                          .map((donor) => (
                            <div
                              key={donor.donorId}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3
                                  className="text-lg font-semibold text-purple-700 cursor-pointer hover:underline"
                                  onClick={() =>
                                    handleShowDonorProfile(donor.donorId)
                                  }
                                >
                                  {donor.donorName}
                                </h3>
                              </div>

                              <p className="text-gray-600 mb-3">
                                <span className="font-medium">Phone:</span>{" "}
                                {donor?.mobileNumber || "N/A"}
                              </p>

                              <p className="text-gray-600 mb-3">
                                <span className="font-medium">PAN:</span>{" "}
                                {donor?.panNumber || "N/A"}
                              </p>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Request Release To:
                                </label>
                                <select
                                  onChange={(e) =>
                                    handleReleaseRequest(
                                      donor.donorId,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="">Select cultivator...</option>
                                  {cultivators
                                    .filter((c) => c.id !== myCultivatorId)
                                    .map((cult) => (
                                      <option key={cult.id} value={cult.id}>
                                        {cult.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Other Donors
                      </h2>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {filteredOtherDonors.length} Donors
                      </span>
                    </div>

                    {filteredOtherDonors.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                          {searchTerm
                            ? "No matching donors found"
                            : "No other donors available"}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View (hidden on mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Donor Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Current Cultivator
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredOtherDonors.map((donor) => (
                                <tr key={donor.donorId}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div
                                        className="text-sm font-medium text-purple-600 hover:text-purple-800 cursor-pointer"
                                        onClick={() =>
                                          handleShowDonorProfile(donor.donorId)
                                        }
                                      >
                                        {donor.donorName}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {donor.mobileNumber}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {donor.cultivatorName}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={() =>
                                        handleAcquireRequest(donor.donorId)
                                      }
                                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                    >
                                      Request Acquire
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View (shown on mobile) */}
                        <div className="md:hidden grid gap-4">
                          {filteredOtherDonors.map((donor) => (
                            <div
                              key={donor.donorId}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3
                                  className="text-lg font-semibold text-purple-700 cursor-pointer hover:underline"
                                  onClick={() =>
                                    handleShowDonorProfile(donor.donorId)
                                  }
                                >
                                  {donor.donorName}
                                </h3>
                                {/* <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Available
              </span> */}
                              </div>

                              <div className="space-y-2">
                                <p className="text-gray-600">
                                  <span className="font-medium">Phone:</span>{" "}
                                  {donor.mobileNumber || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">
                                    Cultivator:
                                  </span>{" "}
                                  {donor.cultivatorName}
                                </p>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <button
                                  className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                  onClick={() =>
                                    handleAcquireRequest(donor.donorId)
                                  }
                                >
                                  Request Acquire
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </section>
                </>
              )}
            </InlineLoader>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorListPage;

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

const DonorListPage = () => {
  const [myDonors, setMyDonors] = useState([]);
  const [otherDonors, setOtherDonors] = useState([]);
  const [cultivators, setCultivators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestsTab, setShowRequestsTab] = useState(false);
  const navigate = useNavigate();
  const myCultivatorId = getDonorCultivatorIdFromLocalStorage();
  const cultivatorName = getDonorCultivatorFromLocalStorage()?.name || "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allDonors = await getDonors();
      const cultivatorList = await getAllDonorCultivators();

      const filteredMyDonors = allDonors.filter(
        (d) => d.connectedTo === cultivatorName
      );
      const filteredOtherDonors = allDonors.filter(
        (d) => d.connectedTo !== cultivatorName
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
    try {
      await requestDonorRelease(donorId, myCultivatorId, targetCultivatorId);
      alert("Release request submitted");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAcquireRequest = async (donorId) => {
    try {
      await requestAcquireDonor(donorId, myCultivatorId);
      alert("Acquire request submitted");
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredMyDonors = myDonors.filter((d) =>
    d?.donorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherDonors = otherDonors.filter((d) =>
    d?.donorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-4">
        Donor Management
      </h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search donors..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow"
          onClick={() => setShowRequestsTab(!showRequestsTab)}
        >
          {showRequestsTab ? "Hide Requests" : "View Pending Requests"}
        </button>
      </div>

      {!showRequestsTab && (
        <>
          <h2 className="text-xl font-semibold text-purple-700 mt-6 mb-2">
            My Donors
          </h2>
          <ul className="bg-white shadow rounded mb-6">
            {filteredMyDonors.map((donor) => (
              <li
                key={donor.donorId}
                className="p-4 border-b text-xl flex justify-between items-center"
              >
                <span
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => handleShowDonorProfile(donor.donorId)}
                >
                  {donor.donorName}
                </span>
                <p className="font-medium">{donor?.mobile}</p>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) =>
                      handleReleaseRequest(donor.donorId, e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                    defaultValue=""
                  >
                    <option value="">Request Release</option>
                    {cultivators
                      .filter((c) => c.id !== myCultivatorId)
                      .map((cult) => (
                        <option key={cult.id} value={cult.id}>
                          {cult.name}
                        </option>
                      ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            Other Donors
          </h2>
          <ul className="bg-white shadow rounded">
            {filteredOtherDonors.map((donor) => (
              <li
                key={donor.donorId}
                className="p-4 border-b flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{donor.donorName}</p>
                  <p className="font-medium">{donor.mobile}</p>
                  <p className="text-sm text-gray-500">
                    Cultivator: {donor?.connectedTo}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleAcquireRequest(donor.donorId)}
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
                  >
                    Request Acquire
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {showRequestsTab && <PendingTransferRequests />}
    </div>
  );
};

export default DonorListPage;

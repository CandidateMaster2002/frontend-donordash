import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserTypeFromLocalStorage,
  getDonorCultivatorIdFromLocalStorage,
} from "../../utils/services";
import { fetchDonations, changeDonationStatus } from "../../utils/services";

const UnapprovedDonations = () => {
  const navigate = useNavigate();
  const [donationsToApprove, setDonationsToApprove] = useState([]);
  const [unapprovedSubmissions, setUnapprovedSubmissions] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const userType = getUserTypeFromLocalStorage();
  const cultivatorId = getDonorCultivatorIdFromLocalStorage();

  useEffect(() => {
    if (userType !== "donorCultivator") {
      navigate("/");
      return;
    }
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const toApproveFilter = {
        donorCultivatorId: cultivatorId,
        status: "Unapproved",
      };
      const submittedByMeFilter = {
        collectedById: cultivatorId,
        status: "Unapproved",
      };

      const [toApprove, submittedByMe] = await Promise.all([
        fetchDonations(toApproveFilter),
        fetchDonations(submittedByMeFilter),
      ]);

      // Unapproved donations submitted by this cultivator, but not their own donors
      const filteredSubmissions = submittedByMe.filter(
        (donation) => donation.donorCultivatorId !== cultivatorId
      );

      setDonationsToApprove(toApprove);
      setUnapprovedSubmissions(filteredSubmissions);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleStatusUpdate = async (donationId) => {
    try {
      setUpdatingId(donationId);
      const response = await changeDonationStatus(donationId, "Pending");
      alert(`Doantion approved successfully`);
      loadDonations(); // Reload after update
    } catch (error) {
      console.error("Error updating donation status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-purple-800 text-center">
        Unapproved Donations
      </h1>

      {/* Donations to be approved */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-green-700">Donations to be Approved</h2>
        {donationsToApprove.length === 0 ? (
          <p>No donations to approve.</p>
        ) : (
          <table className="w-full border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Donor</th>
                <th className="py-2 px-4 border">Collected By</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Purpose</th>
                <th className="py-2 px-4 border">Mode</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {donationsToApprove.map((donation, index) => (
                <tr key={donation.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{donation.donorName}</td>
                  <td className="py-2 px-4 border">{donation.collectedByName}</td>
                  <td className="py-2 px-4 border">₹{donation.amount}</td>
                  <td className="py-2 px-4 border">{donation.purpose}</td>
                  <td className="py-2 px-4 border">{donation.paymentMode}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleStatusUpdate(donation.id)}
                      disabled={updatingId === donation.id}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === donation.id ? "Approving..." : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Unapproved donations submitted by current cultivator for others */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-red-700">
          Unapproved Donations (Submitted by You for Other Cultivators)
        </h2>
        {unapprovedSubmissions.length === 0 ? (
          <p>No unapproved external submissions.</p>
        ) : (
          <table className="w-full border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Donor</th>
                <th className="py-2 px-4 border">Cultivator Name</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Purpose</th>
                <th className="py-2 px-4 border">Mode</th>
              </tr>
            </thead>
            <tbody>
              {unapprovedSubmissions.map((donation, index) => (
                <tr key={donation.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{donation.donorName}</td>
                  <td className="py-2 px-4 border">{donation.donorCultivatorName}</td>
                  <td className="py-2 px-4 border">₹{donation.amount}</td>
                  <td className="py-2 px-4 border">{donation.purpose}</td>
                  <td className="py-2 px-4 border">{donation.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UnapprovedDonations;

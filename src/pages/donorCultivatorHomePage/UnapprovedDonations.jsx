import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserTypeFromLocalStorage,
  getDonorCultivatorIdFromLocalStorage,
} from '../../utils/services';
import { fetchDonations, changeDonationStatus } from '../../utils/services';

const UnapprovedDonations = () => {
  const navigate = useNavigate();
  const [donationsToApprove, setDonationsToApprove] = useState([]);
  const [unapprovedSubmissions, setUnapprovedSubmissions] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const userType = getUserTypeFromLocalStorage();
  const cultivatorId = getDonorCultivatorIdFromLocalStorage();

  useEffect(() => {
    if (userType !== 'donorCultivator') {
      navigate('/');
      return;
    }
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const toApproveFilter = {
        donorCultivatorId: cultivatorId,
        status: 'Unapproved',
      };
      const submittedByMeFilter = {
        collectedById: cultivatorId,
        status: 'Unapproved',
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
      console.error('Error fetching donations:', error);
    }
  };

  const handleStatusUpdate = async (donationId) => {
    try {
      setUpdatingId(donationId);
      const response = await changeDonationStatus(donationId, 'Pending');
      alert(`Doantion approved successfully`);
      loadDonations(); // Reload after update
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Failed to update status.');
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
        <h2 className="text-xl font-bold mb-4 text-green-700">
          Donations to be Approved
        </h2>
        {donationsToApprove.length === 0 ? (
          <p>No donations to approve.</p>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border text-center">
                <thead className="bg-blue-900 text-white">
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
                      <td className="py-2 px-4 border">
                        {donation.collectedByName}
                      </td>
                      <td className="py-2 px-4 border">₹{donation.amount}</td>
                      <td className="py-2 px-4 border">{donation.purpose}</td>
                      <td className="py-2 px-4 border">
                        {donation.paymentMode}
                      </td>
                      <td className="py-2 px-4 border">
                        <button
                          onClick={() => handleStatusUpdate(donation.id)}
                          disabled={updatingId === donation.id}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingId === donation.id
                            ? 'Approving...'
                            : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile-style scrollable table with sticky header and first column */}
            <div className="md:hidden mt-4">
              <style>{`
                .unapproved-mobile-scroll::-webkit-scrollbar {
                  height: 0;
                  width: 0;
                }
                .unapproved-mobile-scroll {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
              `}</style>
              <div
                className="relative overflow-auto border bg-white shadow-sm unapproved-mobile-scroll"
                style={{ maxHeight: '70vh' }}
              >
                <table className="min-w-max w-full table-fixed text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-40 bg-blue-900 text-white px-2 py-2 text-left w-6">
                        #
                      </th>
                      <th className="sticky left-6 z-40 bg-blue-900 text-white px-2 py-2 text-left w-32">
                        Donor
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-32">
                        Collected By
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-right w-18">
                        Amount
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-32">
                        Purpose
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-24">
                        Mode
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-center w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donationsToApprove.map((donation, index) => (
                      <tr key={donation.id} className="bg-white last:border-b">
                        <td className="sticky left-0 z-30 bg-blue-50 text-blue-800 px-2 py-3 text-xs font-semibold border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="sticky left-6 z-30 bg-blue-50 text-blue-800 px-2 py-3 text-sm font-semibold truncate border-r border-gray-200">
                          {donation.donorName}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-600 truncate border-l border-gray-200">
                          {donation.collectedByName}
                        </td>
                        <td className="px-2 py-3 text-right font-medium border-l border-gray-200">
                          ₹{donation.amount}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-700 truncate border-l border-gray-200">
                          {donation.purpose}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-700 truncate border-l border-gray-200">
                          {donation.paymentMode}
                        </td>
                        <td className="px-2 py-3 text-center border-l border-gray-200">
                          <button
                            onClick={() => handleStatusUpdate(donation.id)}
                            disabled={updatingId === donation.id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            {updatingId === donation.id
                              ? 'Approving...'
                              : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border text-center">
                <thead className="bg-blue-900 text-white">
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
                      <td className="py-2 px-4 border">
                        {donation.donorCultivatorName}
                      </td>
                      <td className="py-2 px-4 border">₹{donation.amount}</td>
                      <td className="py-2 px-4 border">{donation.purpose}</td>
                      <td className="py-2 px-4 border">
                        {donation.paymentMode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile-style scrollable table with sticky header and first column */}
            <div className="md:hidden mt-4">
              <style>{`
                .unapproved-mobile-scroll-2::-webkit-scrollbar {
                  height: 0;
                  width: 0;
                }
                .unapproved-mobile-scroll-2 {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
              `}</style>
              <div
                className="relative overflow-auto border bg-white shadow-sm unapproved-mobile-scroll-2"
                style={{ maxHeight: '70vh' }}
              >
                <table className="min-w-max w-full table-fixed text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-40 bg-blue-900 text-white px-2 py-2 text-left w-6">
                        #
                      </th>
                      <th className="sticky left-6 z-40 bg-blue-900 text-white px-2 py-2 text-left w-32">
                        Donor
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-32">
                        Cultivator Name
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-right w-18">
                        Amount
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-32">
                        Purpose
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-24">
                        Mode
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {unapprovedSubmissions.map((donation, index) => (
                      <tr key={donation.id} className="bg-white last:border-b">
                        <td className="sticky left-0 z-30 bg-blue-50 text-blue-800 px-2 py-3 text-xs font-semibold border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="sticky left-6 z-30 bg-blue-50 text-blue-800 px-2 py-3 text-sm font-semibold truncate border-r border-gray-200">
                          {donation.donorName}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-600 truncate border-l border-gray-200">
                          {donation.donorCultivatorName}
                        </td>
                        <td className="px-2 py-3 text-right font-medium border-l border-gray-200">
                          ₹{donation.amount}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-700 truncate border-l border-gray-200">
                          {donation.purpose}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-700 truncate border-l border-gray-200">
                          {donation.paymentMode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UnapprovedDonations;

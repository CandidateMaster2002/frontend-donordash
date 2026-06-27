import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getUserTypeFromLocalStorage,
  getDonorCultivatorIdFromLocalStorage,
} from '../../utils/services';
import {
  fetchDonations,
  changeDonationStatus,
} from '../../utils/services';
import DonationsToApproveTable from './components/DonationsToApproveTable';
import SubmittedUnapprovedDonationsTable from './components/SubmittedUnapprovedDonationsTable';

const UnapprovedDonations = () => {
  const navigate = useNavigate();
  const [donationsToApprove, setDonationsToApprove] = useState([]);
  const [unapprovedSubmissions, setUnapprovedSubmissions] = useState([]);
  const [loadingUnapprovedTables, setLoadingUnapprovedTables] = useState(false);
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
      setLoadingUnapprovedTables(true);
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
    } finally {
      setLoadingUnapprovedTables(false);
    }
  };

  const handleStatusUpdate = async (donationId) => {
    try {
      setUpdatingId(donationId);
      await changeDonationStatus(donationId, 'Pending');
      toast.success('Donation approved successfully');
      loadDonations(); // Reload after update
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800 dark:text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-purple-800 dark:text-purple-800 text-center">
        Unapproved Donations
      </h1>

      <DonationsToApproveTable
        donations={donationsToApprove}
        loading={loadingUnapprovedTables}
        updatingId={updatingId}
        onApprove={handleStatusUpdate}
      />

      <SubmittedUnapprovedDonationsTable
        donations={unapprovedSubmissions}
        loading={loadingUnapprovedTables}
      />
    </div>
  );
};

export default UnapprovedDonations;

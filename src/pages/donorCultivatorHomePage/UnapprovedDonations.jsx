import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getUserTypeFromLocalStorage,
  getDonorCultivatorIdFromLocalStorage,
  getDonors,
  getDonorsByCultivator,
  getDonorCultivatorById,
} from '../../utils/services';
import {
  fetchDonations,
  changeDonationStatus,
  fetchRazorpayDonations,
} from '../../utils/services';
import RazorpayDonationsTable from './components/RazorpayDonationsTable';
import DonationsToApproveTable from './components/DonationsToApproveTable';
import SubmittedUnapprovedDonationsTable from './components/SubmittedUnapprovedDonationsTable';

const formatToInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UnapprovedDonations = () => {
  const navigate = useNavigate();
  const [donationsToApprove, setDonationsToApprove] = useState([]);
  const [unapprovedSubmissions, setUnapprovedSubmissions] = useState([]);
  const [loadingUnapprovedTables, setLoadingUnapprovedTables] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [razorpayDonations, setRazorpayDonations] = useState([]);
  const [loadingRazorpayDonations, setLoadingRazorpayDonations] =
    useState(false);
  const [razorpayError, setRazorpayError] = useState('');
  const [allDonors, setAllDonors] = useState([]);
  const [cultivatorDonors, setCultivatorDonors] = useState([]);
  const [donorCultivator, setDonorCultivator] = useState(null);
  const [toDate, setToDate] = useState(formatToInputDate(new Date()));
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return formatToInputDate(date);
  });

  const userType = getUserTypeFromLocalStorage();
  const cultivatorId = getDonorCultivatorIdFromLocalStorage();

  useEffect(() => {
    if (userType !== 'donorCultivator') {
      navigate('/');
      return;
    }
    loadDonations();
    loadRazorpayDonations(fromDate, toDate);
    loadDonorOptions();
    loadDonorCultivatorDetails();
  }, []);

  const loadDonorOptions = async () => {
    try {
      const [allDonorsResponse, cultivatorDonorsResponse] = await Promise.all([
        getDonors(),
        getDonorsByCultivator(cultivatorId),
      ]);
      setAllDonors(Array.isArray(allDonorsResponse) ? allDonorsResponse : []);
      setCultivatorDonors(
        Array.isArray(cultivatorDonorsResponse) ? cultivatorDonorsResponse : []
      );
    } catch (error) {
      console.error('Error fetching donor options:', error);
    }
  };

  const loadDonorCultivatorDetails = async () => {
    try {
      const cultivator = await getDonorCultivatorById(cultivatorId);
      setDonorCultivator(cultivator || null);
    } catch (error) {
      console.error('Error fetching donor cultivator:', error);
      setDonorCultivator(null);
    }
  };

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

  const loadRazorpayDonations = async (startDate, endDate) => {
    try {
      setLoadingRazorpayDonations(true);
      setRazorpayError('');
      const data = await fetchRazorpayDonations(startDate, endDate);
      setRazorpayDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      setRazorpayDonations([]);
      setRazorpayError(error.message || 'Failed to fetch Razorpay donations.');
    } finally {
      setLoadingRazorpayDonations(false);
    }
  };

  const handleRazorpayFilterSubmit = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      setRazorpayError('Please select both from and to dates.');
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      setRazorpayError('From date cannot be after To date.');
      return;
    }
    loadRazorpayDonations(fromDate, toDate);
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

      <RazorpayDonationsTable
        donations={razorpayDonations}
        donorCultivator={donorCultivator}
        allDonors={allDonors}
        cultivatorDonors={cultivatorDonors}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onSubmit={handleRazorpayFilterSubmit}
        onRefreshDonations={() => loadRazorpayDonations(fromDate, toDate)}
        loading={loadingRazorpayDonations}
        error={razorpayError}
      />
    </div>
  );
};

export default UnapprovedDonations;

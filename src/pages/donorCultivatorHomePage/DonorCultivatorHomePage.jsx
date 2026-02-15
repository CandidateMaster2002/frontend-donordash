import React, { useState, useEffect, useMemo } from 'react';
import DateFilter from '../../components/DateFilter';
import DonationSummaryTable from '../../components/DonationSummaryTable';
import DonationsTable from '../../components/DonationsTable';
import { fetchDonationSummaryData } from '../../utils/services';
import {
  fetchDonations,
  getDonorCultivatorFromLocalStorage,
} from '../../utils/services';
import DonateNowPopup from '../donorHomePage/DonateNowPopup';
import { RiAddCircleFill } from 'react-icons/ri';
import EditDonationPopup from '../adminPage/EditDonationPopup';
import { editDonation } from '../../utils/services';
import SuccessPopup from '../../components/SuccessPopup';
import { getDonorCultivatorIdFromLocalStorage } from '../../utils/services';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useHeader } from '../../utils/HeaderContext';
import { donationPurposes, paymentModes } from '../../constants/constants';
import { getDonorsByCultivator } from '../../utils/services';
import MobileFilters from './components/MobileFilters';
import DesktopFilters from './components/DesktopFilters';

const DonorCultivatorHomePage = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const [filter, setFilter] = useState({
    type: 'all',
    month: '',
    startDate: lastMonth.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  });
  const { setHeaderExtras } = useHeader();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [donationsData, setDonationsData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summaryData, setSummaryData] = useState({ purpose: [], zone: [] });
  const [showAddDonationPopup, setShowAddDonationPopup] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    setHeaderExtras(
      <div className="flex items-center gap-4 font-semibold">
        {/* Tabs */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 rounded-full font-semibold transition-all duration-300
            focus:outline-none focus:ring-0
            ${
              activeTab === 'home'
                ? 'bg-white text-purple-700 shadow-md'
                : 'hover:bg-gray-100 md:hover:bg-white/20'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-2 rounded-full font-semibold transition-all duration-300
            focus:outline-none focus:ring-0 ${
              activeTab === 'reports'
                ? 'bg-white text-purple-700 shadow-md'
                : 'hover:bg-gray-100 md:hover:bg-white/20'
            }`}
          >
            Reports
          </button>
        </div>

        {/* Existing Nav Links */}
        <div className="flex gap-4 ml-8">
          <NavLink
            to="/donor-list"
            className="px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-100 md:hover:bg-white/20 focus:outline-none"
          >
            View All Donors
          </NavLink>

          <NavLink
            to="/donor-signup"
            className="px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-100 md:hover:bg-white/20 focus:outline-none"
          >
            Add Donor
          </NavLink>

          <NavLink
            to="/unapproved-donations"
            className="px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-100 md:hover:bg-white/20 focus:outline-none"
          >
            Unapproved Donations
          </NavLink>
        </div>
      </div>
    );

    return () => setHeaderExtras(null);
  }, [activeTab]);

  const handleEditDonation = async (updatedDonation) => {
    try {
      await editDonation(updatedDonation.id, updatedDonation);
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.id === updatedDonation.id ? updatedDonation : donation
        )
      );
      setSuccessMessage('The donation has been updated successfully!');
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Error saving donation:', err.message);
      alert('Failed to update donation');
    }

    setEditingDonation(null);
  };

  const handleEdit = (row) => {
    setEditingDonation(row);
  };

  const closePopup = () => {
    setShowAddDonationPopup(false);
  };

  // Fetch data on component mount (default: all dates)
  useEffect(() => {
    fetchDonationsData(filter);
    fetchDonationSummaryData(filter);
    fetchDonors();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleFilterChange = async (newFilter) => {
    setLoading(true);
    try {
      setFilter(newFilter);

      await fetchDonationsData(newFilter);

      if (newFilter.startDate && newFilter.endDate) {
        await fetchDonationSummaryData(newFilter);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationsData = async (filter) => {
    try {
      const filterDto = {
        donorCultivatorId: getDonorCultivatorIdFromLocalStorage(),
        fromDate: filter.startDate,
        toDate: filter.endDate,
      };

      const showLoader = filter?.type === 'all';
      const axiosConfig = showLoader
        ? { showLoader: 'fullscreen' }
        : { showLoader: false };

      const donations = await fetchDonations(filterDto, axiosConfig);
      setDonationsData(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  useEffect(() => {
    fetchDonationSummaryData(
      filter,
      getDonorCultivatorIdFromLocalStorage(),
      setSummaryData
    );
  }, [filter]);

  const handleAddDonation = () => {
    setShowAddDonationPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddDonationPopup(false);
  };

  const [selectedDonorId, setSelectedDonorId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [sortBy, setSortBy] = useState('date'); // "date" | "amount"
  const [sortOrder, setSortOrder] = useState('desc'); // "asc" | "desc"

  const uiFilter = useMemo(
    () => ({
      donorId: selectedDonorId,
      status: selectedStatus,
      purpose: selectedPurpose,
      paymentMode: selectedPaymentMode,
      sortBy,
      sortOrder,
    }),
    [
      selectedDonorId,
      selectedStatus,
      selectedPurpose,
      selectedPaymentMode,
      sortBy,
      sortOrder,
    ]
  );

  const clearAll = () => {
    setSelectedDonorId('');
    setSelectedStatus('');
    setSelectedPurpose('');
    setSelectedPaymentMode('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const [cultivatorDonors, setCultivatorDonors] = useState([]);
  const paymentStatuses = ['Pending', 'Cancelled', 'Verified', 'Unapproved'];
  const fetchDonors = async () => {
    try {
      const cultivatorResponse = await getDonorsByCultivator(
        getDonorCultivatorIdFromLocalStorage()
      );
      setCultivatorDonors(cultivatorResponse);
    } catch (error) {
      console.error('Error fetching donors:', error.message);
    }
  };

  return (
    <div className="p-6 relative bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Hare Krishna {getDonorCultivatorFromLocalStorage().name}
        </h1>
      </div>

      {activeTab === 'home' && (
        <>
          <div className="mt-4 mb-2 text-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-800">
              Donations collected in last 30 days appear here
            </h2>
          </div>
          {/* --- Responsive Filters Row --- */}
          <div className="my-4">
            {/* Row: label + mobile open button */}
            <div className="flex items-center justify-between md:justify-center gap-3">
              {/* Mobile: open filters button (visible on small screens only) */}
              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className="sm:hidden px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 dark:bg-white dark:text-gray-700 dark:border-gray-300 text-sm"
                aria-expanded={isFiltersOpen}
                aria-controls="mobile-filters-panel"
              >
                Filters
              </button>
            </div>
            {/* Desktop filters (visible on md and up) */}
            <DesktopFilters
              selectedDonorId={selectedDonorId}
              setSelectedDonorId={setSelectedDonorId}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPurpose={selectedPurpose}
              setSelectedPurpose={setSelectedPurpose}
              selectedPaymentMode={selectedPaymentMode}
              setSelectedPaymentMode={setSelectedPaymentMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              cultivatorDonors={cultivatorDonors}
              paymentStatuses={paymentStatuses}
              donationPurposes={donationPurposes}
              paymentModes={paymentModes}
              onClear={clearAll}
            />
            {/* Mobile slide-over panel */}
            <MobileFilters
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              selectedDonorId={selectedDonorId}
              setSelectedDonorId={setSelectedDonorId}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPurpose={selectedPurpose}
              setSelectedPurpose={setSelectedPurpose}
              selectedPaymentMode={selectedPaymentMode}
              setSelectedPaymentMode={setSelectedPaymentMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              cultivatorDonors={cultivatorDonors}
              paymentStatuses={paymentStatuses}
              donationPurposes={donationPurposes}
              paymentModes={paymentModes}
              onClear={() => {
                clearAll();
                setIsFiltersOpen(false);
              }}
            />
          </div>

          <DonationsTable
            data={donationsData}
            uiFilter={uiFilter}
            onEdit={handleEdit}
          />
        </>
      )}

      {activeTab === 'reports' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <DonationSummaryTable
              data={summaryData.zone}
              columnName1="Zone"
              columnName2="Amount"
            />
            <DonationSummaryTable
              data={summaryData.paymentMode}
              columnName1="Payment Mode"
              columnName2="Amount"
            />
            <DonationSummaryTable
              data={summaryData.purpose}
              columnName1="Purpose"
              columnName2="Amount"
            />
          </div>
          <>
            <DateFilter
              filter={filter}
              onFilterChange={handleFilterChange}
              loading={loading}
            />

            {/* --- Responsive Filters Row --- */}
            <div className="my-4">
              {/* Row: label + mobile open button */}
              <div className="flex items-center justify-between md:justify-center gap-3">
                {/* Mobile: open filters button (visible on small screens only) */}
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(true)}
                  className="md:hidden px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 dark:border-gray-300 dark:bg-white dark:text-gray-800 text-sm"
                  aria-expanded={isFiltersOpen}
                  aria-controls="mobile-filters-panel"
                >
                  Filters
                </button>
              </div>

              {/* Desktop filters (visible on md and up) */}
              <DesktopFilters
                selectedDonorId={selectedDonorId}
                setSelectedDonorId={setSelectedDonorId}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedPurpose={selectedPurpose}
                setSelectedPurpose={setSelectedPurpose}
                selectedPaymentMode={selectedPaymentMode}
                setSelectedPaymentMode={setSelectedPaymentMode}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                cultivatorDonors={cultivatorDonors}
                paymentStatuses={paymentStatuses}
                donationPurposes={donationPurposes}
                paymentModes={paymentModes}
                onClear={clearAll}
              />

              {/* Mobile slide-over panel */}
              <MobileFilters
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                selectedDonorId={selectedDonorId}
                setSelectedDonorId={setSelectedDonorId}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedPurpose={selectedPurpose}
                setSelectedPurpose={setSelectedPurpose}
                selectedPaymentMode={selectedPaymentMode}
                setSelectedPaymentMode={setSelectedPaymentMode}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                cultivatorDonors={cultivatorDonors}
                paymentStatuses={paymentStatuses}
                donationPurposes={donationPurposes}
                paymentModes={paymentModes}
                onClear={() => {
                  clearAll();
                  setIsFiltersOpen(false);
                }}
              />
            </div>

            <DonationsTable
              data={donationsData}
              uiFilter={uiFilter}
              onEdit={handleEdit}
            />
          </>
        </>
      )}

      {editingDonation && (
        <EditDonationPopup
          donation={editingDonation}
          onSave={handleEditDonation}
          onClose={() => setEditingDonation(null)}
        />
      )}

      {/* Floating "+" Button */}
      <button
        type="button"
        onClick={handleAddDonation}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:scale-110 transition-all flex items-center justify-center"
      >
        <RiAddCircleFill className="w-8 h-8" />
      </button>

      {/* Add Donation Popup */}
      {showAddDonationPopup && (
        <DonateNowPopup
          closePopup={closePopup}
          setShowSuccessPopup={setShowSuccessPopup}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default DonorCultivatorHomePage;

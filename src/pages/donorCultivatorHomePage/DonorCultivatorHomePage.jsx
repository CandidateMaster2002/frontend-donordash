import React, { useState, useEffect, useMemo } from "react";
import DateFilter from "../../components/DateFilter";
import DonationSummaryTable from "../../components/DonationSummaryTable";
import DonationsTable from "../../components/DonationsTable";
import { fetchDonationSummaryData } from "../../utils/services";
import {
  fetchDonations,
  getDonorCultivatorFromLocalStorage,
} from "../../utils/services";
import DonateNowPopup from "../donorHomePage/DonateNowPopup";
import { RiAddCircleFill } from "react-icons/ri";
import EditDonationPopup from "../adminPage/EditDonationPopup";
import { editDonation } from "../../utils/services";
import SuccessPopup from "../../components/SuccessPopup";
import { getDonorCultivatorIdFromLocalStorage } from "../../utils/services";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useHeader } from "../../utils/HeaderContext";
import { donationPurposes, paymentModes } from "../../constants/constants";
import { getDonorsByCultivator } from "../../utils/services";

const DonorCultivatorHomePage = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const [filter, setFilter] = useState({
    type: "all",
    month: "",
    startDate: lastMonth.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  });
  const { setHeaderExtras } = useHeader();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [donationsData, setDonationsData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summaryData, setSummaryData] = useState({ purpose: [], zone: [] });
  const [showAddDonationPopup, setShowAddDonationPopup] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    setHeaderExtras(
      <div className="flex items-center gap-4 text-white font-semibold">
        {/* Tabs */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3 py-2 rounded-full font-semibold transition-all duration-300
              focus:outline-none focus:ring-0
              ${
                activeTab === "home"
                  ? "bg-white text-purple-700 shadow-md"
                  : "text-white/90 hover:bg-white/20"
              }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-2 rounded-full font-semibold transition-all duration-300
              focus:outline-none focus:ring-0 ${
                activeTab === "reports"
                  ? "bg-white text-purple-700 shadow-md"
                  : "text-white/90 hover:bg-white/20"
              }`}
          >
            Reports
          </button>
        </div>

        {/* Existing Nav Links */}
        <div className="flex gap-4 ml-8">
          <NavLink
            to="/donor-list"
            className="px-4 py-2 rounded-full font-medium text-white/90
               transition-all duration-300
               hover:bg-white/20 hover:text-white
               focus:outline-none"
          >
            View All Donors
          </NavLink>

          <NavLink
            to="/donor-signup"
            className="px-4 py-2 rounded-full font-medium text-white/90
               transition-all duration-300
               hover:bg-white/20 hover:text-white
               focus:outline-none"
          >
            Add Donor
          </NavLink>

          <NavLink
            to="/unapproved-donations"
            className="px-4 py-2 rounded-full font-medium text-white/90
               transition-all duration-300
               hover:bg-white/20 hover:text-white
               focus:outline-none"
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
      setSuccessMessage("The donation has been updated successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Error saving donation:", err.message);
      alert("Failed to update donation");
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

      const showLoader = filter?.type === "all";
      const axiosConfig = showLoader
        ? { showLoader: "fullscreen" }
        : { showLoader: false };

      const donations = await fetchDonations(filterDto, axiosConfig);
      setDonationsData(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
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

  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date" | "amount"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"

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

  const [cultivatorDonors, setCultivatorDonors] = useState([]);
  const paymentStatuses = ["Pending", "Cancelled", " Verified", "Unapproved"];
  const fetchDonors = async () => {
    try {
      const cultivatorResponse = await getDonorsByCultivator(
        getDonorCultivatorIdFromLocalStorage()
      );
      setCultivatorDonors(cultivatorResponse);
    } catch (error) {
      console.error("Error fetching donors:", error.message);
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

      {activeTab === "home" && (
        <>
          <DateFilter
            filter={filter}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
          {/* --- Filters Row --- */}
          <div className="flex flex-wrap gap-3 items-center justify-center my-4">
            <div className="font-semibold text-lg mr-2">Filter By</div>
            {/* Cultivator Donors */}
            <select
              value={selectedDonorId}
              onChange={(e) => setSelectedDonorId(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="">All Donors</option>
              {cultivatorDonors.map((d) => (
                <option key={d.donorId} value={d.donorId}>
                  {d.donorName}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="">All Statuses</option>
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Purpose (use .value) */}
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="">All Purposes</option>
              {donationPurposes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.value}
                </option>
              ))}
            </select>

            {/* Payment Mode (use .value) */}
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="">All Payment Modes</option>
              {paymentModes.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.value}
                </option>
              ))}
            </select>

            {/* Sort controls */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="date">Sort By: Date</option>
              <option value="amount">Sort By: Amount</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>

            {/* Clear filters */}
            <button
              type="button"
              onClick={() => {
                setSelectedDonorId("");
                setSelectedStatus("");
                setSelectedPurpose("");
                setSelectedPaymentMode("");
                setSortBy("date");
                setSortOrder("desc");
              }}
              className="px-3 py-2 rounded-md bg-red-500 text-white
                hover:bg-red-600 transition-colors
                focus:outline-none focus:ring-0"
            >
              Clear
            </button>
          </div>
          <DonationsTable
            data={donationsData}
            uiFilter={uiFilter}
            onEdit={handleEdit}
          />
        </>
      )}

      {activeTab === "reports" && (
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

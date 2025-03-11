import React, { useState, useEffect } from "react";
import DateFilter from "../../components/DateFilter";
import DonationSummaryTable from "./DonationSummaryTable";
import DonationsTable from "../../components/DonationsTable";
import {
  fetchDonations,
  fetchDonationSummary,
  getDonorCultivatorFromLocalStorage,
} from "../../utils/services";
import DonateNowPopup from "../donorHomePage/DonateNowPopup";
import { RiAddCircleFill } from "react-icons/ri";
import EditDonationPopup from "../adminPage/EditDonationPopup";
import { editDonation } from "../../utils/services";
import SuccessPopup from "../../components/SuccessPopup";

const DonorCultivatorHomePage = () => {
  const [filter, setFilter] = useState({
    type: "all",
    month: "",
    startDate: "",
    endDate: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [donationsData, setDonationsData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summaryData, setSummaryData] = useState({ purpose: [], zone: [] });
  const [showAddDonationPopup, setShowAddDonationPopup] = useState(false);

  const [editingDonation, setEditingDonation] = useState(null);

  const handleEditDonation = async (updatedDonation) => {
    try {
      await editDonation(updatedDonation.id, updatedDonation);
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.id === updatedDonation.id ? updatedDonation : donation
        )
      );
      console.log("Donation updated successfully");
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
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchDonationsData(newFilter);
    if (newFilter.startDate && newFilter.endDate) {
      fetchDonationSummaryData(newFilter);
    }
  };

  const fetchDonationsData = async (filter) => {
    const filterDto = {
      donorCultivatorId: null,
      fromDate: filter.startDate,
      toDate: filter.endDate,
    };

    try {
      const donations = await fetchDonations(filterDto);
      setDonationsData(donations);
      console.log("Donations:", donations[0]);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const fetchDonationSummaryData = async (filter) => {
    const params = {
      cultivatorId: 1,
      dateFrom: filter.startDate,
      dateTo: filter.endDate,
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

      setSummaryData({
        purpose: formattedPurposeSummary,
        zone: formattedZoneSummary,
      });
    } catch (error) {
      console.error("Error fetching donation summary:", error);
    }
  };

  const handleAddDonation = () => {
    setShowAddDonationPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddDonationPopup(false);
  };

  return (
    <div className="p-6 relative bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Hare Krishna {getDonorCultivatorFromLocalStorage().name}
        </h1>
      </div>

      {/* View All Donors Button */}
      <button
        onClick={() => (window.location.href = "/donor-list")}
        className="mt-4 mb-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-xl"
      >
        View All Donors
      </button>

      {/* Date Filter */}
      <DateFilter onFilterChange={handleFilterChange} />

      {/* Summary Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <DonationSummaryTable
          data={summaryData.purpose}
          columnName1="Purpose"
          columnName2="Amount"
        />
        <DonationSummaryTable
          data={summaryData.zone}
          columnName1="Zone"
          columnName2="Amount"
        />
      </div>

      {/* Donations Table */}
      <DonationsTable data={donationsData} onEdit={handleEdit} />

      {editingDonation && (
        <EditDonationPopup
          donation={editingDonation}
          onSave={handleEditDonation}
          onClose={() => setEditingDonation(null)}
        />
      )}

      {/* Floating "+" Button */}
      <button
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

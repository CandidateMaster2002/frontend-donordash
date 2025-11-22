import React, { useState, useEffect } from "react";
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
import HareKrishnaLoader from "../../components/HareKrishnaLoader";
import { set } from "date-fns";

const DonorCultivatorHomePage = () => {
  const [filter, setFilter] = useState({
    type: "all",
    month: "",
    startDate: "",
    endDate: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [donationsData, setDonationsData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summaryData, setSummaryData] = useState({ purpose: [], zone: [] });
  const [showAddDonationPopup, setShowAddDonationPopup] = useState(false);

  const [editingDonation, setEditingDonation] = useState(null);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchDonationsData(newFilter);
    if (newFilter.startDate && newFilter.endDate) {
      fetchDonationSummaryData(newFilter);
    }
  };
  const fetchDonationsData = async (filter) => {
    setLoading(true);
    try {
      const filterDto = {
        donorCultivatorId: getDonorCultivatorIdFromLocalStorage(),
        fromDate: filter.startDate,
        toDate: filter.endDate,
      };

      // console.log("Filter DTO:", filterDto);

      const donations = await fetchDonations(filterDto);
      setDonationsData(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
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

  return loading ? (
    <HareKrishnaLoader />
  ) : (
    <div className="p-6 relative bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Hare Krishna {getDonorCultivatorFromLocalStorage().name}
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => navigate("/donor-list")}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-xl"
        >
          View All Donors
        </button>

        <button
          onClick={() =>
            navigate("/donor-signup", {
              state: {
                preselectedCultivatorId: getDonorCultivatorIdFromLocalStorage(),
              }, // send via state
            })
          }
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-xl"
        >
          Add a Donor
        </button>

        <button
          onClick={() => navigate("/unapproved-donations")}
          className="px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-xl"
        >
          Unapproved Donations
        </button>
      </div>

      <DateFilter onFilterChange={handleFilterChange} />

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

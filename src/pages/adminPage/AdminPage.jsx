import React, { useEffect, useState } from "react";
import {
  getDonorSupervisorIdForAdminFromLocalStorage,
  fetchDonations,
} from "../../utils/services";
import DonationsTable from "./DonationsTable";
import DonationStatusFilters from "./DonationStatusFilters";
import EditDonationPopup from "./EditDonationPopup";
import { editDonation } from "../../utils/services";
import { RiAddCircleFill } from "react-icons/ri";
import DonateNowPopup from "../donorHomePage/DonateNowPopup";
import SuccessPopup from "../../components/SuccessPopup";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("master");
  const [donations, setDonations] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [editingDonation, setEditingDonation] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const closePopup = () => {
    setShowAddDonationPopup(false);
  };

  const handleAddDonation = () => {
    setShowAddDonationPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddDonationPopup(false);
  };

  const [showAddDonationPopup, setShowAddDonationPopup] = useState(false);

  useEffect(() => {
    if (selectedFilter === "All") {
      setData(donations);
    } else {
      setData(
        donations.filter((donation) => donation.status === selectedFilter)
      );
    }
  }, [donations, selectedFilter]);

  const fetchAndSetDonations = async () => {
    try {
      const donorCultivatorId = getDonorSupervisorIdForAdminFromLocalStorage();
      const fetchedDonations = await fetchDonations({ donorCultivatorId });
      setDonations(fetchedDonations);
    } catch (err) {
      console.error("Error fetching donations:", err.message);
    }
  };

  useEffect(() => {
    fetchAndSetDonations();
  }, []);

  const handleEdit = (row) => {
    setEditingDonation(row);
  };

  const handleActiveTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "pending") {
      setSelectedFilter("Pending");
    } else {
      setSelectedFilter("All");
    }
  };

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

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex lg:flex-col bg-gray-100 p-4 lg:w-1/4">
        <button
          onClick={() => handleActiveTabChange("master")}
          className={`p-4 w-full text-left ${
            activeTab === "master"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Master Donations
        </button>
        {/* <button
          onClick={() => handleActiveTabChange("pending")}
          className={`p-4 w-full text-left ${
            activeTab === "pending"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Pending Donations
        </button> */}
      </div>
      <div className="flex-1 p-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {activeTab === "pending" ? "Pending Donations" : "Master Donations"}
          </h2>

          {activeTab === "master" && (
            <DonationStatusFilters
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          )}

          <DonationsTable data={data} onEdit={handleEdit} />

          {editingDonation && (
            <EditDonationPopup
              donation={editingDonation}
              onSave={handleEditDonation}
              onClose={() => setEditingDonation(null)}
            />
          )}
        </div>
      </div>

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

export default AdminPage;

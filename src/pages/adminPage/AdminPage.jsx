import React, { useEffect, useState } from "react";
import { fetchDonations, editDonation } from "../../utils/services";
import DonationsTable from "./DonationsTable";
import DonationStatusFilters from "./DonationStatusFilters";
import EditDonationPopup from "./EditDonationPopup";
import DonateNowPopup from "../donorHomePage/DonateNowPopup";
import SuccessPopup from "../../components/SuccessPopup";
import { RiAddCircleFill } from "react-icons/ri";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("master");
  const [donations, setDonations] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [editingDonation, setEditingDonation] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddDonationPopup, setShowAddDonationPopup] = useState(false);

  const [cultivators, setCultivators] = useState([]);
  const [selectedCultivators, setSelectedCultivators] = useState([]);

  const closePopup = () => setShowAddDonationPopup(false);
  const handleAddDonation = () => setShowAddDonationPopup(true);

  const handleEdit = (row) => {
    setEditingDonation(row);
  };

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

  const handleActiveTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedFilter(tab === "pending" ? "Pending" : "All");
  };

  const fetchAndSetDonations = async () => {
    try {
      const fetchedDonations = await fetchDonations({});
      setDonations(fetchedDonations);
    } catch (err) {
      console.error("Error fetching donations:", err.message);
    }
  };

  // Extract unique cultivator names
  useEffect(() => {
    const uniqueNames = [
      ...new Set(donations.map((d) => d.donorCultivatorName).filter(Boolean)),
    ];
    setCultivators(uniqueNames);
  }, [donations]);

  // Apply filters
  useEffect(() => {
    let filtered = [...donations];

    if (selectedFilter !== "All") {
      filtered = filtered.filter((d) => d.status === selectedFilter);
    }

    if (selectedCultivators.length > 0) {
      filtered = filtered.filter((d) =>
        selectedCultivators.includes(d.donorCultivatorName)
      );
    }
    console.log("Filtered Donations:", filtered);
    setData(filtered);
  }, [donations, selectedFilter, selectedCultivators]);

  useEffect(() => {
    fetchAndSetDonations();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Side Navigation */}
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">
          {activeTab === "pending" ? "Pending Donations" : "Master Donations"}
        </h2>

        {activeTab === "master" && (
          <>
            <DonationStatusFilters
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />

            {/* Cultivator Checkbox Filter */}
            <div className="mb-4">
              <label className="font-semibold block mb-2">
                Filter by Cultivator(s):
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                {cultivators.map((name) => (
                  <label key={name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={name}
                      checked={selectedCultivators.includes(name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCultivators((prev) => [...prev, name]);
                        } else {
                          setSelectedCultivators((prev) =>
                            prev.filter((c) => c !== name)
                          );
                        }
                      }}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
              {selectedCultivators.length > 0 && (
                <button
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={() => setSelectedCultivators([])}
                >
                  Clear selection
                </button>
              )}
            </div>
          </>
        )}

        {/* Table */}
        <DonationsTable data={data} onEdit={handleEdit} />

        {/* Edit Popup */}
        {editingDonation && (
          <EditDonationPopup
            donation={editingDonation}
            onSave={handleEditDonation}
            onClose={() => setEditingDonation(null)}
          />
        )}
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

      {/* Success Popup */}
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

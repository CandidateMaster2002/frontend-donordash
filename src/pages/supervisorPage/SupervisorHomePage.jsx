import React, { useState, useEffect } from "react";
import DateFilter from "../../components/DateFilter";
import DonationSummaryTable from "../../components/DonationSummaryTable";
import DonationsTable from "../../components/DonationsTable";
import { fetchDonationSummaryData, getDonorSupervisorIdForAdminFromLocalStorage } from "../../utils/services";
import {
  fetchDonations,
  getDonationSupervisorFromLocalStorage,
  getDonationSupervisorIdFromLocalStorage,
} from "../../utils/services";
import SortByButtons from "../../components/SortByButtons";
import { data } from "autoprefixer";
import DonationSummary from "../../components/DonationSummary";


const SupervisorHomePage = () => {
  const [filter, setFilter] = useState({
    type: "all",
    month: "",
    startDate: "",
    endDate: "",
  });

  const [donationsData, setDonationsData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summaryData, setSummaryData] = useState({ purpose: [], zone: [] ,paymentMode: [],cultivator: []});

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
      donationSupervisorId: getDonorSupervisorIdForAdminFromLocalStorage(),
      fromDate: filter.startDate,
      toDate: filter.endDate,
      status:"Verified"
    };

    try {
      const donations = await fetchDonations(filterDto);
      setDonationsData(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };


   const [sortOption, setSortOption] = useState("amount");


  useEffect(() => {
    fetchDonationSummaryData(
      filter,
      null,
      setSummaryData
    );
  }, [filter]);


  return (
    <div className="p-6 relative bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Hare Krishna {getDonationSupervisorFromLocalStorage().name}
        </h1>
      </div>

      {/* Date Filter */}
      <DateFilter onFilterChange={handleFilterChange} />

      <DonationSummary donationsData={donationsData}/>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <DonationSummaryTable
          data={summaryData.cultivator}
          columnName1="Name"
          columnName2="Amount"
        />
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


      
      <SortByButtons
        setSortOption={setSortOption}
        sortOption={sortOption}
      />

      {/* Donations Table */}
      <DonationsTable data={donationsData} showStatus={false} showEditDonation={false} showCutivatorName={true} sortOption={sortOption}/>
    
    </div>
  );
};

export default SupervisorHomePage;


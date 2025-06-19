import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDonors, getDonorCultivatorIdFromLocalStorage } from '../../utils/services';
import { FaIndianRupeeSign } from "react-icons/fa6";

const DonorListPage = () => {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const params = { donorCultivator: getDonorCultivatorIdFromLocalStorage() };
        console.log(params);
        const donorData = await getDonors(params);
        setDonors(donorData);
      } catch (error) {
        console.error('Error fetching donors:', error.message);
      }
    };

    fetchDonors();
  }, []);

  const handleShowDonorProfile = (donorId) => {
    navigate(`/donor-profile/${donorId}`);
  };

  // 🧠 Filtered donors based on search
  const filteredDonors = donors.filter((donor) =>
    donor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">Donor List</h1>

      {/* 🔍 Search Field */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search donor by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Table Headings */}
      <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-4 *:text-center">
        <div className="font-semibold">Name</div>
        <div className="font-semibold">Profile</div>
        {/* <div className="font-semibold">Address</div> */}
      </div>

      {/* Donor Rows */}
      <ul className="bg-white rounded-b-lg shadow-md">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <li
              key={donor?.id}
              className="grid grid-cols-2 gap-4 items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all"
            >
              <div className="text-center text-gray-700 font-medium">{donor.name}</div>

              <button
                onClick={() => handleShowDonorProfile(donor.id)}
                className="flex justify-center text-purple-600 hover:text-purple-800 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>


 {/* <div className="text-center text-gray-700 font-medium">{donor.mobileNumber}</div> */}
             
            </li>
          ))
        ) : (
          <li className="text-center p-4 text-gray-500">No donors found</li>
        )}
      </ul>
    </div>
  );
};

export default DonorListPage;

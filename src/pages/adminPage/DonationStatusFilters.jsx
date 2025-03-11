import React from 'react';

const paymentStatuses = ['All', 'Pending', 'Verified', 'Failed', 'Cancelled'];

const DonationStatusFilters = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex flex-wrap justify-start gap-2 md:gap-4">
        {paymentStatuses.map(filter => (
          <button
            key={filter}
            className={`px-4 py-2 text-sm md:text-base rounded-lg transition duration-300 
              ${selectedFilter === filter ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}
            `}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DonationStatusFilters;

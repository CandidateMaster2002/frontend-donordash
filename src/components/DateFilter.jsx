import React, { useState } from 'react';

const DateFilter = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState('all');
  const [month, setMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterChange = (type) => {
    let newStartDate = '';
    let newEndDate = '';

    if (type === 'all') {
      newStartDate = '2025-01-01';
      newEndDate = new Date().toISOString().split('T')[0];
    }

    setFilterType(type);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onFilterChange({ type, month, startDate: newStartDate, endDate: newEndDate });
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    const [year, month] = selectedMonth.split('-');
    const newStartDate = `${year}-${month}-01`;
    const newEndDate = new Date(year, month, 0).toISOString().split('T')[0];

    setMonth(selectedMonth);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onFilterChange({ type: 'month', month: selectedMonth, startDate: newStartDate, endDate: newEndDate });
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    onFilterChange({ type: 'range', month, startDate: event.target.value, endDate });
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    onFilterChange({ type: 'range', month, startDate, endDate: event.target.value });
  };

  return (
    <div className="py-4 max-w-lg mx-auto">
      {/* Filter Type Buttons */}
      <div className="flex justify-around mb-6 *:text-xl">
        <button
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            filterType === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleFilterChange('all')}
        >
          All Dates
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            filterType === 'month'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleFilterChange('month')}
        >
          Select Month
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            filterType === 'range'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleFilterChange('range')}
        >
          Date Range
        </button>
      </div>
  
      {/* Month Selector */}
      {filterType === 'month' && (
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
            Select Month:
          </label>
          <input
            type="month"
            id="month"
            value={month}
            onChange={handleMonthChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      )}
  
      {/* Date Range Selector */}
      {filterType === 'range' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date:
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date:
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
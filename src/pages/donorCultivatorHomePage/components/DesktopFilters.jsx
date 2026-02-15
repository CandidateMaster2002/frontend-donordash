import React from 'react';

// DesktopFilters: visible from md and up
const DesktopFilters = ({
  selectedDonorId,
  setSelectedDonorId,
  selectedStatus,
  setSelectedStatus,
  selectedPurpose,
  setSelectedPurpose,
  selectedPaymentMode,
  setSelectedPaymentMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  cultivatorDonors = [],
  paymentStatuses = [],
  donationPurposes = [],
  paymentModes = [],
  onClear,
}) => {
  return (
    <div className="hidden md:flex flex-wrap gap-3 items-center justify-center text-gray-800 dark:text-gray-800">
      <div className="font-semibold text-lg mr-2 text-gray-800 dark:text-gray-800">
        Filter By
      </div>

      <select
        value={selectedDonorId}
        onChange={(e) => setSelectedDonorId(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
      >
        <option value="">All Donors</option>
        {cultivatorDonors.map((d) => (
          <option key={d.donorId} value={d.donorId}>
            {d.donorName}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
      >
        <option value="">All Statuses</option>
        {paymentStatuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={selectedPurpose}
        onChange={(e) => setSelectedPurpose(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
      >
        <option value="">All Purposes</option>
        {donationPurposes.map((p) => (
          <option key={p.value} value={p.value}>
            {p.value}
          </option>
        ))}
      </select>

      <select
        value={selectedPaymentMode}
        onChange={(e) => setSelectedPaymentMode(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
      >
        <option value="">All Payment Modes</option>
        {paymentModes.map((m) => (
          <option key={m.value} value={m.value}>
            {m.value}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
      >
        <option value="date">Sort By: Date</option>
        <option value="amount">Sort By: Amount</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>

      <button
        type="button"
        onClick={onClear}
        className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-0"
      >
        Clear
      </button>
    </div>
  );
};

export default DesktopFilters;

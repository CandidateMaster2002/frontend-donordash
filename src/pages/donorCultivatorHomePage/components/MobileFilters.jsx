import React from 'react';

// MobileFilters: slide-over panel visible on small screens
export const MobileFilters = ({
  isOpen,
  onClose,
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
  if (!isOpen) return null;
  const topValue = '70px';
  return (
    <div
      id="mobile-filters-panel"
      className="fixed inset-0 z-50 flex md:hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        className="fixed right-0 w-full max-w-sm bg-white p-4 overflow-auto shadow-xl"
        style={{
          top: topValue,
          height: `calc(100% - ${topValue})`, // fills the rest of viewport
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">Filter By</div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Close filters"
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <select
            value={selectedDonorId}
            onChange={(e) => setSelectedDonorId(e.target.value)}
            className="px-3 py-2 rounded-md border w-full"
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
            className="px-3 py-2 rounded-md border w-full"
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
            className="px-3 py-2 rounded-md border w-full"
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
            className="px-3 py-2 rounded-md border w-full"
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
            className="px-3 py-2 rounded-md border w-full"
          >
            <option value="date">Sort By: Date</option>
            <option value="amount">Sort By: Amount</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 rounded-md border w-full"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClear}
              className="flex-1 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;

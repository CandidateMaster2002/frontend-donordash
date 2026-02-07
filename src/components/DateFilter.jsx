import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const DateFilter = ({ filter, onFilterChange, loading }) => {
  const [draft, setDraft] = useState(filter);

  const handleFilterChange = (newType) => {
    if (newType === "all") {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);

      setDraft({
        type: newType,
        month: "",
        startDate: "",
        endDate: "",
      });
      onFilterChange({
        type: "all",
        month: "",
        startDate: lastMonth.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      });
      return;
    }

    setDraft({
      type: newType,
      month: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleMonthChange = (e) => {
    setDraft((d) => ({ ...d, month: e.target.value }));
  };

  const handleStartDateChange = (e) => {
    setDraft((d) => ({ ...d, startDate: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setDraft((d) => ({ ...d, endDate: e.target.value }));
  };

  const handleApply = () => {
    if (draft.type === "month") {
      const [y, m] = draft.month.split("-");
      const start = `${y}-${m}-01`;
      const end = new Date(y, m, 0).toISOString().split("T")[0];

      onFilterChange({ ...draft, startDate: start, endDate: end });
      return;
    }

    if (draft.type === "range") {
      if (!draft.startDate || !draft.endDate)
        return toast.error("Select both dates");

      if (new Date(draft.startDate) > new Date(draft.endDate))
        return toast.error("Invalid range");

      onFilterChange(draft);
    }
  };
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="py-4 max-w-lg mx-auto">
      {/* Filter Type Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-3 w-full text-lg">
        <div className="font-semibold text-lg whitespace-nowrap text-center sm:text-left">
          Filter By Date
        </div>

        <button
          type="button"
          className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
            draft.type === "all"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          Last Month
        </button>

        <button
          type="button"
          className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
            draft.type === "month"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => handleFilterChange("month")}
        >
          Select Month
        </button>

        <button
          type="button"
          className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
            draft.type === "range"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => handleFilterChange("range")}
        >
          Date Range
        </button>
      </div>

      {/* Month Selector */}
      {draft.type === "month" && (
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Month
          </label>

          <input
            type="month"
            value={draft.month}
            onChange={handleMonthChange}
            className="w-full p-2 border rounded-md
                       focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          <button
            type="button"
            disabled={loading}
            onClick={handleApply}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded shadow
              ${
                loading
                  ? "bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
              }`}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      )}

      {/* Date Range Selector */}
      {draft.type === "range" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={draft.startDate}
              onChange={handleStartDateChange}
              className="w-full rounded-md border px-3 py-2
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={draft.endDate}
              onChange={handleEndDateChange}
              className="w-full rounded-md border px-3 py-2
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleApply}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded shadow
              ${
                loading
                  ? "bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
              }`}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;

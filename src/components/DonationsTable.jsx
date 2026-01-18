import React from "react";
import { FaDownload, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/services";
import { getStatusStyles } from "../utils/services";
import { MdEdit } from "react-icons/md";
import { getReceiptByDonationId } from "../utils/services";
import { useNavigate } from "react-router-dom";

const DonationsTable = ({
  data,
  uiFilter,
  onEdit,
  showStatus = true,
  showEditDonation = true,
  showCutivatorName = false,
}) => {
  // console.log("Data :", data);

  const navigate = useNavigate();
  const handleReceiptClick = async (donationId) => {
    try {
      const pdfData = await getReceiptByDonationId(donationId);
      // console.log("PDF Data:", pdfData);
      if (
        !pdfData ||
        !pdfData.receiptNumber ||
        !pdfData.receiptNumber.startsWith("ISK")
      ) {
        alert("Receipt number is missing. Cannot generate receipt.");
        return;
      }
      // console.log("PDF Data:", pdfData);
      navigate("/receipt", { state: { pdfData } });
    } catch (error) {
      console.error("Error fetching receipt data:", error);
    }
  };

  const sortData = (data, sortOption) => {
    if (sortOption === "cultivator") {
      return [...data].sort((a, b) => {
        if (a.donorCultivatorName === b.donorCultivatorName) {
          return b.amount - a.amount; // Sort by amount within the same cultivator
        }
        return a.donorCultivatorName.localeCompare(b.donorCultivatorName); // Sort by cultivator name
      });
    } else if (sortOption === "amount") {
      return [...data].sort((a, b) => b.amount - a.amount); // Sort by amount (highest to lowest)
    } else if (sortOption === "date") {
      return [...data].sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      ); // Sort by date (latest first)
    }
    return data;
  };

  let sortedData = sortData(data, uiFilter.sortBy || "date");

  let result = Array.isArray(sortedData) ? [...sortedData] : [];

  const getDonorId = (row) => row?.donorId ?? null;

  //apply UI-only filters conditionally
  if (uiFilter.donorId != null && uiFilter.donorId !== "") {
    const donorIdStr = String(uiFilter.donorId);
    result = result.filter((row) => String(getDonorId(row)) === donorIdStr);
  }

  if (uiFilter.status != null && uiFilter.status !== "") {
    result = result.filter(
      (row) => String(row.status) === String(uiFilter.status)
    );
  }

  if (uiFilter.purpose != null && uiFilter.purpose !== "") {
    result = result.filter(
      (row) => String(row.purpose) === String(uiFilter.purpose)
    );
  }

  if (uiFilter.paymentMode != null && uiFilter.paymentMode !== "") {
    result = result.filter(
      (row) => String(row.paymentMode) === String(uiFilter.paymentMode)
    );
  }

  //handle sort order (DESC is default)
  if (uiFilter.sortOrder === "asc") {
    result.reverse();
  }
  sortedData = result;

  return (
    <div className="overflow-x-auto overflow-y-auto max-w-full bg-white dark:bg-white">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Payment Date</th>
            <th className="py-3 px-4 text-left">Donor</th>
            {showCutivatorName && (
              <th className="py-3 px-4 text-left">Cultivator</th>
            )}
            <th className="py-3 px-4 text-left">Amount</th>
            <th className="py-3 px-4 text-left">Mode</th>
            <th className="py-3 px-4 text-left">Purpose</th>
            {showStatus && <th className="py-3 px-4 text-left">Status</th>}
            <th className="py-3 px-4 text-left">Receipt</th>
            {showEditDonation && <th className="py-3 px-4 text-left">Edit</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-50 transition-all"
            >
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {formatDate(row.paymentDate)}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.donorName}
              </td>
              {showCutivatorName && (
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                  {row.donorCultivatorName}
                </td>
              )}
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                ₹ {row.amount}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.paymentMode}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.purpose}
              </td>
              {showStatus && (
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusStyles(
                      row.status
                    )} text-gray-800 dark:text-gray-800`}
                  >
                    {row.status}
                  </span>
                </td>
              )}
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                <FaDownload
                  className={`inline-block mr-2 ${
                    row.status === "Verified"
                      ? "cursor-pointer text-purple-600 dark:text-purple-600"
                      : "text-gray-400 dark:text-gray-400"
                  }`}
                  onClick={
                    row.status === "Verified"
                      ? () => handleReceiptClick(row.id)
                      : undefined
                  }
                />
              </td>
              {showEditDonation && (
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                  <FaEdit
                    className={`inline-block mr-2 ${
                      row.status === "Verified" || row.status === "Pending"
                        ? "cursor-pointer text-purple-600 dark:text-purple-600"
                        : "text-gray-400 dark:text-gray-400"
                    }`}
                    onClick={
                      row.status === "Verified" || row.status === "Pending"
                        ? () => onEdit(row)
                        : undefined
                    }
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;

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
  const totalColumns =
    6 +
    (showCutivatorName ? 1 : 0) +
    (showStatus ? 1 : 0) +
    (showEditDonation ? 1 : 0);

  return (
    <div className="w-full bg-white dark:bg-white">
      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Payment Date
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Donor</th>
              {showCutivatorName && (
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Cultivator
                </th>
              )}
              <th className="py-3 px-4 text-left whitespace-nowrap">Amount</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Mode</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Purpose</th>
              {showStatus && (
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Status
                </th>
              )}
              <th className="py-3 px-4 text-left whitespace-nowrap">Receipt</th>
              {showEditDonation && (
                <th className="py-3 px-4 text-left whitespace-nowrap">Edit</th>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="py-10 text-center text-gray-500 text-lg font-medium"
                >
                  No donations found for the current filter
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 border-b">
                    {formatDate(row.paymentDate)}
                  </td>
                  <td className="py-3 px-4 border-b">{row.donorName}</td>

                  {showCutivatorName && (
                    <td className="py-3 px-4 border-b">
                      {row.donorCultivatorName}
                    </td>
                  )}

                  <td className="py-3 px-4 border-b font-semibold">
                    ₹ {row.amount}
                  </td>
                  <td className="py-3 px-4 border-b">{row.paymentMode}</td>
                  <td className="py-3 px-4 border-b">{row.purpose}</td>

                  {showStatus && (
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusStyles(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  )}

                  <td className="py-3 px-4 border-b">
                    <FaDownload
                      className={`${
                        row.status === "Verified"
                          ? "cursor-pointer text-purple-600"
                          : "text-gray-400"
                      }`}
                      onClick={
                        row.status === "Verified"
                          ? () => handleReceiptClick(row.id)
                          : undefined
                      }
                    />
                  </td>

                  {showEditDonation && (
                    <td className="py-3 px-4 border-b">
                      <FaEdit
                        className={`${
                          row.status === "Verified" || row.status === "Pending"
                            ? "cursor-pointer text-purple-600"
                            : "text-gray-400"
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-3">
        {sortedData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No donations found for the current filter
          </div>
        ) : (
          sortedData.map((row) => (
            <div
              key={row.id}
              className="border rounded-xl shadow-sm p-4 space-y-2"
            >
              <div className="text-sm text-gray-500">
                {formatDate(row.paymentDate)}
              </div>

              <div className="font-semibold text-lg">{row.donorName}</div>

              {showCutivatorName && (
                <div className="text-sm">
                  <span className="font-medium">Cultivator:</span>{" "}
                  {row.donorCultivatorName}
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span className="font-semibold">₹ {row.amount}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Mode</span>
                <span>{row.paymentMode}</span>
              </div>

              <div className="text-sm">
                <span className="font-medium">Purpose:</span> {row.purpose}
              </div>

              {showStatus && (
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusStyles(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-2">
                <FaDownload
                  className={`${
                    row.status === "Verified"
                      ? "cursor-pointer text-purple-600"
                      : "text-gray-400"
                  }`}
                  onClick={
                    row.status === "Verified"
                      ? () => handleReceiptClick(row.id)
                      : undefined
                  }
                />

                {showEditDonation && (
                  <FaEdit
                    className={`${
                      row.status === "Verified" || row.status === "Pending"
                        ? "cursor-pointer text-purple-600"
                        : "text-gray-400"
                    }`}
                    onClick={
                      row.status === "Verified" || row.status === "Pending"
                        ? () => onEdit(row)
                        : undefined
                    }
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonationsTable;

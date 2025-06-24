import React from "react";
import { FaDownload, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/services";
import { getStatusStyles } from "../utils/services";
import { MdEdit } from "react-icons/md";
import { getReceiptByDonationId } from "../utils/services";
import { useNavigate } from "react-router-dom";

const DonationsTable = ({ data,onEdit,showStatus=true,showEditDonation=true,sortOption="date",showCutivatorName=false}) => {

  const navigate = useNavigate();
  const handleReceiptClick = async (donationId) => {
    try {
      const pdfData = await getReceiptByDonationId(donationId);
      console.log("PDF Data:", pdfData);
      navigate("/receipt", { state: { pdfData } });
      console.log(pdfData);
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
      return [...data].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)); // Sort by date (latest first)
    }
    return data;
  };

  const sortedData = sortData(data, sortOption);

  return (
    <div className="overflow-x-auto overflow-y-auto max-w-full">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Payment Date</th>
            <th className="py-3 px-4 text-left">Donor</th>
            {showCutivatorName &&  <th className="py-3 px-4 text-left">Cultivator</th>}
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
            <tr key={row.id} className="hover:bg-gray-50 transition-all">
              <td className="py-3 px-4 border-b">
                {formatDate(row.paymentDate)}
              </td>
              <td className="py-3 px-4 border-b">{row.donorName}</td>
             {showCutivatorName && <td className="py-3 px-4 border-b">{row.donorCultivatorName}</td>}
              <td className="py-3 px-4 border-b">₹ {row.amount}</td>
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
                  className={`inline-block mr-2 ${
                    row.status === "Verified"
                      ? "cursor-pointer  text-purple-600"
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
                    className={`inline-block mr-2 ${
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;

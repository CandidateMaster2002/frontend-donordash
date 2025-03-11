import React from "react";
import { FaDownload, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/services";
import { getStatusStyles } from "../utils/services";
import { MdEdit } from "react-icons/md";
import { getReceiptByDonationId } from "../utils/services";
import { useNavigate } from "react-router-dom";

const DonationsTable = ({ data,onEdit }) => {
  const navigate = useNavigate();
  const handleReceiptClick = async (donationId) => {
    try {
      const receiptData = await getReceiptByDonationId(donationId);
      navigate("/receipt", { state: { receiptData } });
    } catch (error) {
      console.error("Error fetching receipt data:", error);
    }
  };

  return (
    <div className="overflow-x-auto overflow-y-auto max-w-full">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Payment Date</th>
            <th className="py-3 px-4 text-left">Donor</th>
            <th className="py-3 px-4 text-left">Amount</th>
            <th className="py-3 px-4 text-left">Mode</th>
            <th className="py-3 px-4 text-left">Purpose</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Receipt</th>
            <th className="py-3 px-4 text-left">Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-all">
              <td className="py-3 px-4 border-b">
                {formatDate(row.paymentDate)}
              </td>
              <td className="py-3 px-4 border-b">{row.donorName}</td>
              <td className="py-3 px-4 border-b">₹ {row.amount}</td>
              <td className="py-3 px-4 border-b">{row.paymentMode}</td>
              <td className="py-3 px-4 border-b">{row.purpose}</td>
              <td className="py-3 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${getStatusStyles(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;

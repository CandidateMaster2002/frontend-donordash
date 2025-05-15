import { useState } from "react";
import { FaDownload, FaEdit } from "react-icons/fa";
import { formatDate } from "../../utils/services";
import { getReceiptByDonationId } from "../../utils/services";
import { useNavigate } from "react-router-dom";
import StatusChangeConfirmationBox from "../../components/StatusChangeConfirmationBox";
import React from "react";
import SuccessPopup from "../../components/SuccessPopup";

const DonationsTable = ({ data, onEdit }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleStatusChange = (donation, e) => {
    setNewStatus(e.target.value);
    setSelectedDonation(donation);
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setNewStatus("");
    setSelectedDonation(null);
  };

  const handleConfirm = (status, transactionId) => {
    setShowConfirmation(false);
    setSelectedDonation(null);

    // Simulating successful status change
    setSuccessMessage(
      `The donation status has been changed from ${
        selectedDonation.status
      } to ${status}.`
    );
    setShowSuccessPopup(true);
  };

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
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Donor</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Mode</th>
            <th className="py-2 px-4 border-b">Purpose</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Cultivator</th>
            <th className="py-2 px-4 border-b">Receipt</th>
            <th className="py-2 px-4 border-b">Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">
                {formatDate(row.paymentDate)}
              </td>
              <td className="py-2 px-4 border-b">{row.donorName}</td>
              <td className="py-2 px-4 border-b">{row.amount}</td>
              <td className="py-2 px-4 border-b">{row.paymentMode}</td>
              <td className="py-2 px-4 border-b">{row.purpose}</td>
              <td className="py-2 px-4 border-b">
                {row.status === "Pending" ? (
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row, e)}
                    className="border p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : row.status === "Verified" ? (
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row, e)}
                    className="border p-1"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  row.status
                )}
              </td>
              <td className="py-2 px-4 border-b">{row.donorCultivatorName}</td>
              <td className="py-2 px-4 border-b">
                <FaDownload
                  className={`inline-block mr-2 ${
                    row.status === "Verified"
                      ? "cursor-pointer"
                      : "text-gray-400"
                  }`}
                  onClick={
                    row.status === "Verified"
                      ? () => handleReceiptClick(row.id)
                      : undefined
                  }
                />
              </td>
              <td className="py-2 px-4 border-b">
                <FaEdit
                  className={`inline-block mr-2 ${
                    row.status === "Verified" || row.status === "Pending"
                      ? "cursor-pointer"
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

      {/* Status Change Confirmation Box */}
      {showConfirmation && selectedDonation && (
        <StatusChangeConfirmationBox
          donation={selectedDonation}
          newStatus={newStatus}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default DonationsTable;
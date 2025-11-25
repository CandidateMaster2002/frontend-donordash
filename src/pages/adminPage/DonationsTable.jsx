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
      `The donation status has been changed from ${selectedDonation.status} to ${status}.`
    );
    setShowSuccessPopup(true);
  };

  const handleReceiptClick = async (donationId) => {
    try {
      const pdfData = await getReceiptByDonationId(donationId);
      if (
        !pdfData ||
        !pdfData.receiptNumber ||
        !pdfData.receiptNumber.startsWith("ISK")
      ) {
        alert("Receipt number is missing. Cannot generate receipt.");
        return;
      }
      console.log("pdf Data:", pdfData);
      navigate("/receipt", { state: { pdfData } });
    } catch (error) {
      console.error("Error fetching receipt data:", error);
    }
  };

  // return (
  //   <div className="overflow-x-auto overflow-y-auto max-w-full">
  //     <table className="min-w-full bg-white">
  //       <thead>
  //         <tr>
  //           <th className="py-2 px-4 border-b">Payment Date</th>
  //           <th className="py-2 px-4 border-b">Donor</th>
  //           <th className="py-2 px-4 border-b">Amount</th>
  //           <th className="py-2 px-4 border-b">Mode</th>
  //           <th className="py-2 px-4 border-b">Purpose</th>
  //           <th className="py-2 px-4 border-b">Status</th>
  //           <th className="py-2 px-4 border-b">Cultivator</th>
  //           <th className="py-2 px-4 border-b">Receipt</th>
  //           <th className="py-2 px-4 border-b">Edit</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data.map((row, index) => (
  //           <tr key={index} className="text-center">
  //             <td className="py-2 px-4 border-b">
  //               {formatDate(row.paymentDate)}
  //             </td>
  //             <td className="py-2 px-4 border-b">{row.donorName}</td>
  //             <td className="py-2 px-4 border-b">{row.amount}</td>
  //             <td className="py-2 px-4 border-b">{row.paymentMode}</td>
  //             <td className="py-2 px-4 border-b">{row.purpose}</td>
  //             <td className="py-2 px-4 border-b">
  //               {row.status === "Pending" ? (
  //                 <select
  //                   value={row.status}
  //                   onChange={(e) => handleStatusChange(row, e)}
  //                   className="border p-1"
  //                 >
  //                   <option value="Pending">Pending</option>
  //                   <option value="Verified">Verified</option>
  //                   <option value="Cancelled">Cancelled</option>
  //                 </select>
  //               ) : row.status === "Verified" ? (
  //                 <select
  //                   value={row.status}
  //                   onChange={(e) => handleStatusChange(row, e)}
  //                   className="border p-1"
  //                 >
  //                   <option value="Verified">Verified</option>
  //                   <option value="Cancelled">Cancelled</option>
  //                 </select>
  //               ) : (
  //                 row.status
  //               )}
  //             </td>
  //             <td className="py-2 px-4 border-b">{row.donorCultivatorName}</td>
  //             <td className="py-2 px-4 border-b">
  //               <FaDownload
  //                 className={`inline-block mr-2 ${
  //                   row.status === "Verified"
  //                     ? "cursor-pointer"
  //                     : "text-gray-400"
  //                 }`}
  //                 onClick={
  //                   row.status === "Verified"
  //                     ? () => handleReceiptClick(row.id)
  //                     : undefined
  //                 }
  //               />
  //             </td>
  //             <td className="py-2 px-4 border-b">
  //               <FaEdit
  //                 className={`inline-block mr-2 ${
  //                   row.status === "Verified" || row.status === "Pending"
  //                     ? "cursor-pointer"
  //                     : "text-gray-400"
  //                 }`}
  //                 onClick={
  //                   row.status === "Verified" || row.status === "Pending"
  //                     ? () => onEdit(row)
  //                     : undefined
  //                 }
  //               />
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {/* Status Change Confirmation Box */}
  //     {showConfirmation && selectedDonation && (
  //       <StatusChangeConfirmationBox
  //         donation={selectedDonation}
  //         newStatus={newStatus}
  //         onCancel={handleCancel}
  //         onConfirm={handleConfirm}
  //       />
  //     )}

  //     {/* Success Popup */}
  //     {showSuccessPopup && (
  //       <SuccessPopup
  //         message={successMessage}
  //         onClose={() => setShowSuccessPopup(false)}
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="overflow-x-auto overflow-y-auto max-w-full bg-white dark:bg-white">
      <table className="min-w-full bg-white dark:bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Payment Date
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Donor
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Mode
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Purpose
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Status
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Cultivator
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Receipt
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {formatDate(row.paymentDate)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.donorName}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.amount}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.paymentMode}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.purpose}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200">
                {row.status === "Pending" ? (
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row, e)}
                    className="border border-gray-300 dark:border-gray-300 p-1 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : row.status === "Verified" ? (
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row, e)}
                    className="border border-gray-300 dark:border-gray-300 p-1 bg-white dark:bg-white text-gray-800 dark:text-gray-800"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className="text-gray-800 dark:text-gray-800">
                    {row.status}
                  </span>
                )}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200 text-gray-800 dark:text-gray-800">
                {row.donorCultivatorName}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200">
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
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-200">
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

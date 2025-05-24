import React, { useState } from "react";
import { donationPurposes } from "../../constants/constants";
import { paymentModes } from "../../constants/constants";

const EditDonationPopup = ({ donation, onSave, onClose }) => {
  const [isVerified, setIsVerified] = useState(donation.status === "Verified");
  const [formData, setFormData] = useState(donation);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Donation</h2>
        <form onSubmit={handleSubmit}>
          {!isVerified && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {paymentModes.map((mode) => (
                    <option key={mode.id} value={mode.value}>
                      {mode.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={
                    formData.paymentDate
                      ? formData.paymentDate.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              {formData.paymentMode !== "Cash" && (
                <div className="mb-4">
                  <label className="block mb-2">Transaction Id</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
            </>
          )}
          <div className="mb-4">
            <label className="block mb-2">Purpose</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {donationPurposes.map((purpose) => (
                <option key={purpose.id} value={purpose.value}>
                  {purpose.value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 p-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationPopup;

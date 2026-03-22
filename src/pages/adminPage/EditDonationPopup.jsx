import React, { useState } from 'react';
import { donationPurposes } from '../../constants/constants';
import { paymentModes } from '../../constants/constants';

const EditDonationPopup = ({ donation, onSave, onClose }) => {
  const [isVerified, setIsVerified] = useState(donation.status === 'Verified');
  const [formData, setFormData] = useState(donation);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Donation</h2>

        <form onSubmit={handleSubmit}>
          {!isVerified && (
            <>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {paymentModes.map((mode) => (
                    <option key={mode.id} value={mode.value}>
                      {mode.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={
                    formData.paymentDate
                      ? formData.paymentDate.split('T')[0]
                      : ''
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.paymentMode !== 'Cash' && (
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">
                    Transaction Id
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-gray-700">
                  Cancel Donation
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancel</option>
                </select>
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Purpose</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mr-4 p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`p-2 rounded text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed opacity-70'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationPopup;

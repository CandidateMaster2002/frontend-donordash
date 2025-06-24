import React, { useState } from 'react';
import { editDonation, changeDonationStatus,requiredTransactionIdForStatusChange } from '../utils/services';

const StatusChangeConfirmationBox = ({ donation, newStatus, onCancel, onConfirm }) => {
  const [transactionId, setTransactionId] = useState(donation.transactionId || '');
  const [showTransactionInput, setShowTransactionInput] = useState(requiredTransactionIdForStatusChange(donation,newStatus));
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
  };

  const handleSaveTransactionId = async () => {
    if (transactionId.trim()) {
      try {
        await editDonation(donation.id, { transactionId: transactionId });
        setIsSaveDisabled(false);
        setShowTransactionInput(false);
        handleConfirm();
      } catch (error) {
        alert('Failed to save Transaction ID');
        console.error('Error saving transaction ID:', error);
      }
    }
  };

  const handleConfirm = async () => {
    if (requiredTransactionIdForStatusChange(donation,newStatus)&& !transactionId.trim()) {
      setShowTransactionInput(true);
      return;
    }

    try {
      await changeDonationStatus(donation.id, newStatus);
      
      onConfirm(newStatus, transactionId);
    } catch (error) {
      alert('Failed to change donation status');
      console.error('Error changing donation status:', error);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Change Donation Status</h2>
        <p>Are you sure you want to change the status from {donation.status} to {newStatus}?</p>
        {showTransactionInput && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={handleTransactionIdChange}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleSaveTransactionId}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save And Verify
            </button>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="mr-4 p-2 bg-gray-300 rounded">
            No
          </button>
          <button
            onClick={handleConfirm}
            className={`p-2 bg-blue-500 text-white rounded 
            
            `}
            // disabled={newStatus === 'Verified' && isSaveDisabled}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeConfirmationBox;
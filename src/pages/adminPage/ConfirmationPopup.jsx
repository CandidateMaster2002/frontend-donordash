import React from 'react';

const ConfirmationPopup = ({ currentStatus, newStatus, onConfirm, onCancel }) => {

  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Status Change</h2>
        <p>Are you sure you want to change the status from <strong>{currentStatus}</strong> to <strong>{newStatus}</strong>?</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-500"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
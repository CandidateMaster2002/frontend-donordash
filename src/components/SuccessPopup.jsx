import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPopup = ({ message, onClose }) => {
  // Automatically close the popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      {/* Popup Container */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4">
        {/* Tick Icon */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-6xl text-white animate-bounce" />
        </div>

        {/* Success Heading */}
        <h2 className="text-2xl font-bold text-white mb-4">Success</h2>

        {/* Custom Message */}
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;

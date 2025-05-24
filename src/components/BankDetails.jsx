import React from 'react';
import { bankDetails } from '../constants/constants';
import { FiCopy } from 'react-icons/fi';
import qrImage from '../assets/images/iskcon_dhanbad_payment_qr.jpeg';

const BankDetails = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if needed
  };

  const details = [
    { label: "A/C Name", value: bankDetails.accountName },
    { label: "A/C No", value: bankDetails.accountNo },
    { label: "IFSC Code", value: bankDetails.ifsc },
    { label: "UPI ID", value: bankDetails.upiId },
    { label: "Gpay/Phonepe/Paytm", value: bankDetails.mobileNumber },
  ];

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md bg-purple-50">
      <h2 className="text-xl font-bold mb-4 text-center">Bank Details</h2>
      
      <div className="space-y-2">
        {details.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm font-medium text-gray-600 min-w-[100px]">{item.label}:</span>
              <span className="font-medium flex-1 truncate">{item.value}</span>
              <button 
                onClick={() => copyToClipboard(item.value)}
                className="text-gray-400 hover:text-blue-500 ml-2"
                aria-label={`Copy ${item.label}`}
              >
                <FiCopy size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code */}
      {bankDetails.qrImage && (
        <div className="mt-3 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-1">Scan QR Code</p>
          <img 
            src={qrImage} 
            alt="UPI QR Code" 
            className="w-28 h-28 object-contain border rounded p-1"
          />
        </div>
      )}
    </div>
  );
};

export default BankDetails;
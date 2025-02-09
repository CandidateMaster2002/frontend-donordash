import React, { useState } from 'react';

const CustomAmountInput = ({ submitCustomAmount }) => {
    const [customAmount, setCustomAmount] = useState('');

    const handleInputChange = (e) => {
        setCustomAmount(e.target.value);
    };

    const handleDonateClick = () => {
        submitCustomAmount(customAmount);
    };

    return (
        <div className="flex items-center mt-4">
            <input
                type="number"
                value={customAmount}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 mr-2"
                placeholder="Enter amount"
            />
            <button
                onClick={handleDonateClick}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Donate
            </button>
        </div>
    );
};

export default CustomAmountInput;
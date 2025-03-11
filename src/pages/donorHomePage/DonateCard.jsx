import React,{useState} from 'react';
import { donationAmounts } from '../../constants/constants';
import CustomAmountInput from '../../components/CustomAmountInput';

const DonateCard = ({ donationPurpose, openPopup,imgAddress }) => {
    const [showCustomInput, setShowCustomInput] = useState(false);

    const handleDonateClick = (amount) => {
        openPopup(donationPurpose, amount);
    };

    const handleChoiceClick = () => {
        setShowCustomInput(true);
    };

    const submitCustomAmount = (amount) => {
        openPopup(donationPurpose, amount);
        setShowCustomInput(false);
    };

    return (
        <div className="bg-purple-200 p-4 rounded shadow-md">
            <img src={imgAddress} alt="Donation" className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2 text-purple-900">{donationPurpose}</h3>
            <div className="mt-4">
                {donationAmounts.map((amount) => (
                    <button
                        key={amount.id}
                        onClick={() => handleDonateClick(amount.value)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded mr-2 mb-2"
                    >
                        {amount.value}
                    </button>
                ))}
                {showCustomInput ? (
                    <CustomAmountInput submitCustomAmount={submitCustomAmount} />
                ) : (
                    <button
                        onClick={handleChoiceClick}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded"
                    >
                        Choice
                    </button>
                )}
            </div>
        </div>
    );
};

export default DonateCard;
import React,{useState} from 'react';
import { donationAmounts } from '../../constants/constants';
import CustomAmountInput from '../../components/CustomAmountInput';


const DonateCard = ({ donationPurpose, openPopup }) => {
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
        <div className="bg-white p-4 rounded shadow-md">
            <img src="your-image-url.jpg" alt="Donation" className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{donationPurpose}</h3>
            <div className="mt-4">
                {donationAmounts.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => handleDonateClick(amount)}
                        className="bg-blue-500 text-white py-2 px-4 rounded mr-2 mb-2"
                    >
                        {amount}
                    </button>
                ))}
                {showCustomInput ? (
                    <CustomAmountInput submitCustomAmount={submitCustomAmount} />
                ) : (
                    <button
                        onClick={handleChoiceClick}
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Choice
                    </button>
                )}
            </div>
        </div>
    );
};

export default DonateCard;
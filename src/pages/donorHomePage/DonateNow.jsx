import React, { useState } from 'react';
import DonateCard from './DonateCard';
import { donationPurposes } from '../../constants/constants';
import DonateNowPopup from './DonateNowPopup';

const DonateNow = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);

    const openPopup = (purpose, amount) => {
        setSelectedPurpose(purpose);
        setSelectedAmount(amount);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedPurpose(null);
        setSelectedAmount(null);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {donationPurposes.map((donationPurpose, index) => (
                    <DonateCard
                        key={index}
                        donationPurpose={donationPurpose}
                        openPopup={openPopup}
                    />
                ))}
            </div>
            {isPopupOpen && (
                <DonateNowPopup
                    amount={selectedAmount}
                    purpose={selectedPurpose}
                    closePopup={closePopup}
                />
            )}
        </div>
    );
};

export default DonateNow;
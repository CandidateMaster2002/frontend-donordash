import React, { useState } from 'react';
import DonateCard from './DonateCard';
import { donationPurposes } from '../../constants/constants';
import DonateNowPopup from './DonateNowPopup';
import SuccessPopup from '../../components/SuccessPopup';

const DonateNow = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {donationPurposes.map((donationPurpose, index) => (
                    <DonateCard
                        donationPurpose={donationPurpose.value}
                        openPopup={openPopup}
                        imgAddress={donationPurpose.imgAddress}
                    />
                )
                )}
            </div>
            {isPopupOpen && (
                <DonateNowPopup
                    amount={selectedAmount}
                    purpose={selectedPurpose}
                    closePopup={closePopup}
                    setShowSuccessPopup={setShowSuccessPopup}
                    setSuccessMessage={setSuccessMessage}
                />
            )}
             {showSuccessPopup && (
      <SuccessPopup
        message={successMessage}
        onClose={() => setShowSuccessPopup(false)}
      />
    )}
        </div>
    );
};

export default DonateNow;
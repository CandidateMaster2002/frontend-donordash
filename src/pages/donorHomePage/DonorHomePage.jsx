import React, { useState } from 'react';
import DonorResponsiveNavbar from './DonorResponsiveNavbar';
import DonateCard from './DonateCard';
import { donationPurposes } from '../../constants/constants';
import DonateNowPopup from './DonateNowPopup';

const DonorHomePage = () => {
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
            <h1 className='text-xl'> Hare Krishna Donor_Name</h1>
            <div>
                <DonorResponsiveNavbar />
                <div>
                    {donationPurposes.map((donationPurpose, index) => (
                        <DonateCard
                            key={index}
                            donationPurpose={donationPurpose}
                            openPopup={openPopup}
                        />
                    ))}
                </div>
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

export default DonorHomePage;
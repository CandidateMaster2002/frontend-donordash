import React, { useState } from 'react';
import DonateNow from './DonateNow';
import DonationHistory from './DonationHistory';
import DonorResponsiveNavbar from './DonorResponsiveNavbar';
import { getDonorFromLocalStorage } from '../../utils/services';

const DonorHomePage = () => {
  const [selectedPage, setSelectedPage] = useState('Donate Now');
 

  const donor=getDonorFromLocalStorage();

  const renderPage = () => {
    switch (selectedPage) {
      case 'Donate Now':
        return <DonateNow />;
      case 'Donation History':
        return <DonationHistory />;
      default:
        return <DonateNow />;
    }
  };

  return (
    
    <div className="flex flex-col min-h-screen">
      <header className="bg-purple-300 text-white py-4">
        <h1 className="text-center text-2xl font-bold">Hare Krishna &nbsp;
          <span className='text-purple-900'>
          {donor?.name}
          </span> 
          </h1>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <DonorResponsiveNavbar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <main className="flex-1 p-4">
          {/* <DonateNow/> */}
          {/* <DonationHistory/> */}
          {renderPage()}
        </main>
      </div>
     
    </div>
  );
};

export default DonorHomePage;
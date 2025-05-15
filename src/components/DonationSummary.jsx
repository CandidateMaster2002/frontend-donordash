import React from 'react'
import { calculateTotalDonationAmount, calculateAverageDonation, calculateMedianDonation, calculateHighestDonation } from '../utils/mathFunctions'


const DonationSummary = ({donationsData}) => {
  return (
       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold p-4 text-center rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Donation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         
          <div>
            <p>Total Donation Amount:</p>
            <p className="text-3xl">
              ₹ {calculateTotalDonationAmount(donationsData).toFixed(2)}
            </p>
          </div>
           <div>
            <p>Total Number of Donations:</p>
            <p className="text-3xl">{donationsData?.length || 0}</p>
          </div>
           <div>
            <p>Highest Donation:</p>
            <p className="text-3xl">
              ₹ {calculateHighestDonation(donationsData).toFixed(2)}
            </p>
          </div>
          <div>
            <p>Average Donation:</p>
            <p className="text-3xl">
              ₹ {calculateAverageDonation(donationsData).toFixed(2)}
            </p>
          </div>
          <div>
            <p>Median Donation:</p>
            <p className="text-3xl">
              ₹ {calculateMedianDonation(donationsData).toFixed(2)}
            </p>
          </div>
         
        </div>
      </div>
  )
}

export default DonationSummary

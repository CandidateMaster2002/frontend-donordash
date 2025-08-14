import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { getDonationsByDonorId, getDonorIdFromLocalStorage,getReceiptByDonationId,formatDate } from '../../utils/services';
import { FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DateFilter from '../../components/DateFilter';
import DonationStatusFilters from '../adminPage/DonationStatusFilters';

const DonationHistory = () => {
  const headings = ['Payment Date', 'Amount', 'Payment Mode', 'Purpose', 'Status', 'Receipt'];

  const [donationsByDonorId, setDonationsByDonorId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donorId = getDonorIdFromLocalStorage();
        const donations = await getDonationsByDonorId(donorId);
        setDonationsByDonorId(donations);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };

    fetchDonations();
  }, []);

  const totalPages = Math.ceil(donationsByDonorId.length / rowsPerPage);



    const handleReceiptClick = async (donationId) => {
      try {
        const pdfData = await getReceiptByDonationId(donationId);
        console.log("PDF Data:", pdfData);
        navigate("/receipt", { state: { pdfData } });
        console.log(pdfData);
      } catch (error) {
        console.error("Error fetching receipt data:", error);
      }
    };
  

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentRows = donationsByDonorId
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((donation) => ({
      date:formatDate(donation.paymentDate),
      amount: `₹ ${donation.amount}`,
      paymentMode: donation.paymentMode,
      purpose: donation.purpose,
      status: donation.status,
      downloadReceipt: (
        <FaDownload
          className={`inline-block mr-2 ${
            donation.status === 'Verified' ? 'cursor-pointer' : 'text-gray-400'
          }`}
          onClick={
            donation.status === 'Verified'
              ? () => handleReceiptClick(donation.id)
              : undefined
          }
        />
      ),
    }));

  return (
    <div className="overflow-x-auto overflow-y-auto max-w-full">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">Donation History</h1>

      {/* <DateFilter/>
      <DonationStatusFilters/> */}
      <Table
        headings={headings}
        rows={currentRows}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DonationHistory;
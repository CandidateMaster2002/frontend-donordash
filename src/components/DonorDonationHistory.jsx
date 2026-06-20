import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  getDonationsByDonorId,
  getReceiptByDonationId,
  formatDate,
  getStatusStyles,
} from '../utils/services';

const ROWS_PER_PAGE = 10;

const DonorDonationHistory = ({
  donorId,
  showTitle = true,
  className = '',
  embedded = false,
}) => {
  const [donations, setDonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!donorId) {
      setDonations([]);
      setCurrentPage(1);
      return;
    }

    const fetchDonations = async () => {
      setLoading(true);
      try {
        const donationsData = await getDonationsByDonorId(donorId);
        setDonations(Array.isArray(donationsData) ? donationsData : []);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [donorId]);

  const totalPages = Math.max(1, Math.ceil(donations.length / ROWS_PER_PAGE));

  const paginatedDonations = donations.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleReceiptClick = async (donationId) => {
    try {
      const url = `/receipt?donationId=${encodeURIComponent(donationId)}`;
      const newTab = window.open(url, '_blank');

      if (newTab) {
        try {
          newTab.opener = null;
        } catch (e) {
          // ignore
        }
        return;
      }

      const pdfData = await getReceiptByDonationId(donationId);
      if (
        !pdfData ||
        !pdfData.receiptNumber ||
        !pdfData.receiptNumber.startsWith('ISK')
      ) {
        alert('Receipt number is missing. Cannot generate receipt.');
        return;
      }
      navigate('/receipt', { state: { pdfData } });
    } catch (error) {
      console.error('Error fetching receipt data:', error);
    }
  };

  const renderReceiptIcon = (donation) => (
    <FaDownload
      className={`${
        donation.status === 'Verified'
          ? 'cursor-pointer text-purple-600'
          : 'text-gray-400'
      }`}
      onClick={
        donation.status === 'Verified'
          ? () => handleReceiptClick(donation.id)
          : undefined
      }
      aria-label={
        donation.status === 'Verified' ? 'Download receipt' : 'Receipt unavailable'
      }
    />
  );

  const sectionClass = embedded
    ? `mt-8 sm:mt-10 border-t border-gray-200 dark:border-gray-200 pt-6 sm:pt-8 ${className}`
    : className;

  return (
    <section className={sectionClass}>
      {showTitle && (
        <h2 className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-600 mb-4">
          Donation History
        </h2>
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading donations...</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Payment Date
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Payment Mode
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Purpose
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDonations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-gray-500 text-lg font-medium"
                    >
                      No donations found
                    </td>
                  </tr>
                ) : (
                  paginatedDonations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50 transition-colors bg-white dark:bg-white"
                    >
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                        {formatDate(donation.paymentDate)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 font-semibold">
                        ₹ {donation.amount}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                        {donation.paymentMode}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                        {donation.purpose}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${getStatusStyles(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                        {renderReceiptIcon(donation)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginatedDonations.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-base font-medium">
                No donations found
              </p>
            ) : (
              paginatedDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-200 bg-white dark:bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-800">
                        ₹ {donation.amount}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {formatDate(donation.paymentDate)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-1 rounded-full text-xs ${getStatusStyles(
                        donation.status
                      )}`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-700">
                    <p>
                      <span className="font-medium">Mode:</span>{' '}
                      {donation.paymentMode}
                    </p>
                    <p>
                      <span className="font-medium">Purpose:</span>{' '}
                      {donation.purpose}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    {renderReceiptIcon(donation)}
                  </div>
                </div>
              ))
            )}
          </div>

          {donations.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-full sm:w-auto bg-gray-300 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="py-2 px-4 text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto bg-gray-300 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default DonorDonationHistory;

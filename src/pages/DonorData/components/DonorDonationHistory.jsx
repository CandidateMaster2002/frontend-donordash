import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  getDonationsByDonorId,
  getReceiptByDonationId,
  formatDate,
  getStatusStyles,
} from '../../../utils/services';

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
    ? `mt-8 sm:mt-10 border-t border-gray-200 dark:border-gray-200 pt-6 sm:pt-8 w-full bg-white dark:bg-white text-gray-800 dark:text-gray-800 ${className}`
    : `w-full bg-white dark:bg-white text-gray-800 dark:text-gray-800 ${className}`;

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

          {/* Mobile View Table */}
          {paginatedDonations.length === 0 ? (
            <div className="md:hidden p-4">
              <div className="text-center text-gray-500 py-10 text-base font-medium">
                No donations found
              </div>
            </div>
          ) : (
            <div className="md:hidden p-2">
              <style>{`
                /* Hide scrollbars but keep scrolling */

                /* WebKit (Chrome, Safari, Edge Chromium) */
                .mobile-table-scroll::-webkit-scrollbar {
                  height: 0;
                  width: 0;
                }

                /* Firefox */
                .mobile-table-scroll {
                  scrollbar-width: none;
                }

                /* Old Edge / IE */
                .mobile-table-scroll {
                  -ms-overflow-style: none;
                }
              `}</style>
              <div
                className="relative overflow-auto border bg-white dark:bg-white shadow-sm mobile-table-scroll"
                style={{ maxHeight: '70vh', msOverflowStyle: 'none' }}
              >
                <table className="min-w-max w-full table-fixed text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-20">
                        Date
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-right w-22">
                        Amount
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-24">
                        Mode
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-36">
                        Purpose
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-center w-24">
                        Status
                      </th>
                      <th className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-center w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="bg-white dark:bg-white last:border-b"
                      >
                        <td className="px-2 py-3 text-xs text-gray-600 dark:text-gray-600 border-l border-gray-200 dark:border-gray-200 first:border-l-0">
                          {donation.paymentDate
                            ? new Intl.DateTimeFormat('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              }).format(new Date(donation.paymentDate))
                            : ''}
                        </td>
                        <td className="px-2 py-3 text-right font-medium border-l border-gray-200 dark:border-gray-200">
                          ₹ {donation.amount}
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-700 truncate border-l border-gray-200 dark:border-gray-200">
                          {donation.paymentMode}
                        </td>
                        <td
                          className="px-2 py-3 text-sm text-gray-700 dark:text-gray-700 truncate border-l border-gray-200 dark:border-gray-200"
                          title={donation.purpose}
                        >
                          {donation.purpose}
                        </td>
                        <td className="px-2 py-3 text-center border-l border-gray-200 dark:border-gray-200">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusStyles(donation.status)}`}
                            title={donation.status}
                          >
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center border-l border-gray-200 dark:border-gray-200">
                          <div className="inline-flex items-center justify-center w-full">
                            {renderReceiptIcon(donation)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

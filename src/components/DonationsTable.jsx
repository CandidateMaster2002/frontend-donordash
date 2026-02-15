import React from 'react';
import { FaDownload, FaEdit } from 'react-icons/fa';
import { formatDate } from '../utils/services';
import { getStatusStyles } from '../utils/services';
import { MdEdit } from 'react-icons/md';
import { getReceiptByDonationId } from '../utils/services';
import { useNavigate } from 'react-router-dom';

const DonationsTable = ({
  data,
  uiFilter,
  onEdit,
  showStatus = true,
  showEditDonation = true,
  showCultivatorName = false,
}) => {
  // console.log("Data :", data);
  var headerHeight = '0px';
  const navigate = useNavigate();
  const handleReceiptClick = async (donationId) => {
    try {
      const pdfData = await getReceiptByDonationId(donationId);
      // console.log("PDF Data:", pdfData);
      if (
        !pdfData ||
        !pdfData.receiptNumber ||
        !pdfData.receiptNumber.startsWith('ISK')
      ) {
        alert('Receipt number is missing. Cannot generate receipt.');
        return;
      }
      pdfData.purpose = 'General';
      // console.log("PDF Data:", pdfData);
      navigate('/receipt', { state: { pdfData } });
    } catch (error) {
      console.error('Error fetching receipt data:', error);
    }
  };

  const sortData = (data, sortOption) => {
    if (sortOption === 'cultivator') {
      return [...data].sort((a, b) => {
        if (a.donorCultivatorName === b.donorCultivatorName) {
          return b.amount - a.amount; // Sort by amount within the same cultivator
        }
        return a.donorCultivatorName.localeCompare(b.donorCultivatorName); // Sort by cultivator name
      });
    } else if (sortOption === 'amount') {
      return [...data].sort((a, b) => b.amount - a.amount); // Sort by amount (highest to lowest)
    } else if (sortOption === 'date') {
      return [...data].sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      ); // Sort by date (latest first)
    }
    return data;
  };

  let sortedData = sortData(data, uiFilter.sortBy || 'date');

  let result = Array.isArray(sortedData) ? [...sortedData] : [];

  const getDonorId = (row) => row?.donorId ?? null;

  //apply UI-only filters conditionally
  if (uiFilter.donorId != null && uiFilter.donorId !== '') {
    const donorIdStr = String(uiFilter.donorId);
    result = result.filter((row) => String(getDonorId(row)) === donorIdStr);
  }

  if (uiFilter.status != null && uiFilter.status !== '') {
    result = result.filter(
      (row) => String(row.status) === String(uiFilter.status)
    );
  }

  if (uiFilter.purpose != null && uiFilter.purpose !== '') {
    result = result.filter(
      (row) => String(row.purpose) === String(uiFilter.purpose)
    );
  }

  if (uiFilter.paymentMode != null && uiFilter.paymentMode !== '') {
    result = result.filter(
      (row) => String(row.paymentMode) === String(uiFilter.paymentMode)
    );
  }

  //handle sort order (DESC is default)
  if (uiFilter.sortOrder === 'asc') {
    result.reverse();
  }
  sortedData = result;
  const totalColumns =
    6 +
    (showCultivatorName ? 1 : 0) +
    (showStatus ? 1 : 0) +
    (showEditDonation ? 1 : 0);

  return (
    <div className="w-full bg-white dark:bg-white text-gray-800 dark:text-gray-800">
      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          {/* header: keep gradient but force white text (same in both modes) */}
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Payment Date
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Donor</th>
              {showCultivatorName && (
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Cultivator
                </th>
              )}
              <th className="py-3 px-4 text-left whitespace-nowrap">Amount</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Mode</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Purpose</th>
              {showStatus && (
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Status
                </th>
              )}
              <th className="py-3 px-4 text-left whitespace-nowrap">Receipt</th>
              {showEditDonation && (
                <th className="py-3 px-4 text-left whitespace-nowrap">Edit</th>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="py-10 text-center text-gray-500 text-lg font-medium"
                >
                  No donations found for the current filter
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors bg-white dark:bg-white"
                >
                  <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                    {formatDate(row.paymentDate)}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                    {row.donorName}
                  </td>

                  {showCultivatorName && (
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                      {row.donorCultivatorName}
                    </td>
                  )}

                  <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200 font-semibold">
                    ₹ {row.amount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                    {row.paymentMode}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                    {row.purpose}
                  </td>

                  {showStatus && (
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusStyles(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  )}

                  <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                    <FaDownload
                      className={`${
                        row.status === 'Verified'
                          ? 'cursor-pointer text-purple-600'
                          : 'text-gray-400'
                      }`}
                      onClick={
                        row.status === 'Verified'
                          ? () => handleReceiptClick(row.id)
                          : undefined
                      }
                    />
                  </td>

                  {showEditDonation && (
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-200">
                      <FaEdit
                        className={`${
                          row.status === 'Verified' || row.status === 'Pending'
                            ? 'cursor-pointer text-purple-600'
                            : 'text-gray-400'
                        }`}
                        onClick={
                          row.status === 'Verified' || row.status === 'Pending'
                            ? () => onEdit(row)
                            : undefined
                        }
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      {sortedData.length === 0 ? (
        <div className="md:hidden p-4">
          <div className="text-center text-gray-500 py-10">
            No donations found for the current filter
          </div>
        </div>
      ) : (
        <div className="md:hidden p-2">
          {/* scroll styling kept; force white backgrounds/text for parity */}
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
                  <th
                    className="sticky left-0 z-40 bg-blue-900 text-white px-2 py-2 text-left w-14"
                    style={{ top: headerHeight }}
                  >
                    ID
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-14"
                    style={{ top: headerHeight }}
                  >
                    Date
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-32"
                    style={{ top: headerHeight }}
                  >
                    Donor
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-right w-22"
                    style={{ top: headerHeight }}
                  >
                    Amount
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-20"
                    style={{ top: headerHeight }}
                  >
                    Mode
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-left w-36"
                    style={{ top: headerHeight }}
                  >
                    Purpose
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-center w-24"
                    style={{ top: headerHeight }}
                  >
                    Status
                  </th>

                  <th
                    className="sticky top-0 z-30 bg-blue-900 text-white px-2 py-2 text-center w-20"
                    style={{ top: headerHeight }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {sortedData.map((row, idx) => (
                  <tr
                    key={row.id || `${row.donorId}-${idx}`}
                    className="bg-white dark:bg-white last:border-b"
                  >
                    <td
                      className="sticky left-0 z-30 bg-blue-50 dark:bg-blue-50 text-blue-800 dark:text-blue-800 px-2 py-3 truncate font-medium text-xs border-l border-gray-200 dark:border-gray-200 first:border-l-0"
                      title={String(row.donorId)}
                    >
                      {row.donorId}
                    </td>

                    <td className="px-2 py-3 text-xs text-gray-600 dark:text-gray-600 border-l border-gray-200 dark:border-gray-200">
                      {row.paymentDate
                        ? new Intl.DateTimeFormat('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          }).format(new Date(row.paymentDate))
                        : ''}
                    </td>

                    <td
                      className="px-2 py-3 text-sm font-semibold truncate border-l border-gray-200 dark:border-gray-200"
                      title={row.donorName}
                    >
                      {row.donorName}
                      {showCultivatorName && row.donorCultivatorName && (
                        <div
                          className="text-xs text-gray-500 dark:text-gray-500 font-normal truncate"
                          title={row.donorCultivatorName}
                        >
                          {row.donorCultivatorName}
                        </div>
                      )}
                    </td>

                    <td className="px-2 py-3 text-right font-medium border-l border-gray-200 dark:border-gray-200">
                      ₹ {row.amount}
                    </td>

                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-700 truncate border-l border-gray-200 dark:border-gray-200">
                      {row.paymentMode}
                    </td>

                    <td
                      className="px-2 py-3 text-sm text-gray-700 dark:text-gray-700 truncate border-l border-gray-200 dark:border-gray-200"
                      title={row.purpose}
                    >
                      {row.purpose}
                    </td>

                    <td className="px-2 py-3 text-center border-l border-gray-200 dark:border-gray-200">
                      {showStatus ? (
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusStyles(row.status)}`}
                          title={row.status}
                        >
                          {row.status}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-2 py-3 text-center border-l border-gray-200 dark:border-gray-200">
                      <div className="inline-flex items-center gap-3">
                        <FaDownload
                          className={`text-lg ${row.status === 'Verified' ? 'cursor-pointer text-purple-600' : 'text-gray-300'}`}
                          onClick={() =>
                            row.status === 'Verified' &&
                            handleReceiptClick(row.id)
                          }
                        />
                        {showEditDonation && (
                          <FaEdit
                            className={`text-lg ${row.status === 'Verified' || row.status === 'Pending' ? 'cursor-pointer text-purple-600' : 'text-gray-300'}`}
                            onClick={() =>
                              (row.status === 'Verified' ||
                                row.status === 'Pending') &&
                              onEdit(row)
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsTable;

import React from "react";

const DonationSummaryTable = ({ data, columnName1, columnName2 }) => {
  const sortedData =
    data && data.length > 0
      ? [...data].sort((a, b) => b.amount - a.amount)
      : [];

  const totalAmount = sortedData.reduce(
    (sum, row) => sum + (row.amount || 0),
    0
  );

  return (
    <div className="bg-white dark:bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">{columnName1}</th>
            <th className="py-3 px-4 text-left">{columnName2}</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-all">
              <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                {row.description}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                ₹{row.amount}
              </td>
            </tr>
          ))}

          {/* ✅ Total Row */}
          {sortedData.length > 0 && (
            <tr className="bg-gray-100 font-semibold">
              <td className="py-3 px-4 text-gray-900">Total</td>
              <td className="py-3 px-4 text-gray-900">₹{totalAmount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationSummaryTable;

import React from 'react';

const Table = ({ headings, rows, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="relative overflow-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-blue-500 text-white">
          <tr>
            {headings.map((heading, index) => (
              <th key={index} className="py-2 px-4 border-b border-gray-300 sticky top-0 left-0 z-10 bg-blue-500">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`py-2 px-4 border-b border-gray-300 ${cellIndex === 0 ? 'sticky left-0 z-10 bg-white' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
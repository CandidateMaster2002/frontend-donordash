import React from 'react';

const Table = ({ headings, rows, currentPage, totalPages, onPageChange }) => {

  console.log(rows[0])
  return (
    <div>
      <table className="min-w-full bg-white">
        <thead className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
          <tr>
            {headings.map((heading, index) => (
              <th key={index} className="text-white py-2 px-4 font-bold uppercase text-sm text-left">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="py-2 px-4">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
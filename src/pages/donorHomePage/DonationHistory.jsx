import React, { useState } from 'react';
import Table from '../../components/Table';
import {data} from '../../constants/constants';

const DonationHistory = () => {
  const headings = ['Date', 'Amount', 'Payment Mode', 'Connected To', 'Status', 'Download Receipt'];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentRows = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Donation History</h1>
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
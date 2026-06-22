import React, { useState, useRef, useEffect } from 'react';
import { FaFileExcel, FaFilePdf, FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { formatDate } from '../utils/services';

/**
 * DownloadDonations — renders a dropdown button that lets the user
 * download the currently-visible donations as Excel (.xlsx) or PDF.
 *
 * Props:
 *   data  – the filtered/sorted array rendered in DonationsTable
 *   showCultivatorName – if true, include the cultivator column
 */
const DownloadDonations = ({ data = [], showCultivatorName = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ─── helpers ─── */
  const buildRows = () =>
    data.map((row) => {
      const base = {
        'Payment Date': row.paymentDate ? formatDate(row.paymentDate) : '',
        Donor: row.donorName || '',
        Amount: row.amount ?? '',
        Mode: row.paymentMode || '',
        Purpose: row.purpose || '',
        Status: row.status || '',
      };
      if (showCultivatorName) {
        base['Cultivator'] = row.donorCultivatorName || '';
      }
      return base;
    });

  /* ─── Excel ─── */
  const downloadExcel = () => {
    const rows = buildRows();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-size columns
    const colKeys = Object.keys(rows[0] || {});
    ws['!cols'] = colKeys.map((key) => ({
      wch: Math.max(
        key.length,
        ...rows.map((r) => String(r[key] ?? '').length)
      ) + 2,
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Donations');
    XLSX.writeFile(wb, 'Donations.xlsx');
    setOpen(false);
  };

  /* ─── PDF ─── */
  const downloadPDF = () => {
    const rows = buildRows();
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const colKeys = Object.keys(rows[0] || {});
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const colWidth = usableWidth / colKeys.length;
    const rowHeight = 8;
    const headerHeight = 10;

    // Title
    doc.setFontSize(14);
    doc.setTextColor(107, 33, 168); // purple-700
    doc.text('Donations Report', margin, margin + 4);

    let y = margin + 12;

    // Header row
    doc.setFontSize(8);
    doc.setFillColor(107, 33, 168);
    doc.rect(margin, y, usableWidth, headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    colKeys.forEach((key, i) => {
      doc.text(key, margin + i * colWidth + 2, y + 7);
    });
    y += headerHeight;

    // Data rows
    doc.setTextColor(55, 55, 55);
    rows.forEach((row, rIdx) => {
      if (y + rowHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        // reprint header on new page
        doc.setFillColor(107, 33, 168);
        doc.rect(margin, y, usableWidth, headerHeight, 'F');
        doc.setTextColor(255, 255, 255);
        colKeys.forEach((key, i) => {
          doc.text(key, margin + i * colWidth + 2, y + 7);
        });
        y += headerHeight;
        doc.setTextColor(55, 55, 55);
      }

      if (rIdx % 2 === 0) {
        doc.setFillColor(245, 243, 255); // light purple tint
        doc.rect(margin, y, usableWidth, rowHeight, 'F');
      }

      colKeys.forEach((key, i) => {
        const val = String(row[key] ?? '');
        doc.text(val.substring(0, 28), margin + i * colWidth + 2, y + 5.5);
      });
      y += rowHeight;
    });

    doc.save('Donations.pdf');
    setOpen(false);
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-gradient-to-r from-purple-600 to-blue-600 text-white
                   font-semibold shadow-md hover:shadow-lg hover:scale-[1.03]
                   transition-all duration-200 focus:outline-none focus:ring-2
                   focus:ring-purple-400 focus:ring-offset-2"
        id="download-donations-btn"
      >
        <FaDownload className="text-sm" />
        Download
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl
                      border border-gray-200 overflow-hidden z-50
                      animate-[fadeIn_150ms_ease-out]"
        >
          <button
            onClick={downloadExcel}
            className="flex items-center gap-3 w-full px-4 py-3 text-left
                       text-gray-700 hover:bg-purple-50 transition-colors"
            id="download-excel-btn"
          >
            <FaFileExcel className="text-green-600 text-lg" />
            <span className="font-medium">Excel (.xlsx)</span>
          </button>

          <hr className="border-gray-100" />

          <button
            onClick={downloadPDF}
            className="flex items-center gap-3 w-full px-4 py-3 text-left
                       text-gray-700 hover:bg-purple-50 transition-colors"
            id="download-pdf-btn"
          >
            <FaFilePdf className="text-red-500 text-lg" />
            <span className="font-medium">PDF (.pdf)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadDonations;

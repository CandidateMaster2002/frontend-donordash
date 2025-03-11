import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";

/**
 * @param {string} componentId - The ID of the component element to be downloaded.
 * @param {string} [fileName="report.pdf"] - The name of the downloaded PDF file.
 */


export const downloadAsPdf = (componentId, fileName = "report.pdf") => {
  const element = document.getElementById(componentId);

  if (!element) {
    console.error("Component not found!");
    return;
  }

  const originalOverflow = element.style.overflow;
  const originalWidth = element.style.width;

  element.style.overflow = "unset";
  element.style.width = "700px";
  // element.style.height = "150mm"; // Half of A4 height

  setTimeout(() => {
    const options = {
      margin: 10,
      filename: fileName,
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      html2canvas: { scale: 4 }, // Increase scale for better resolution
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().from(element).set(options).save().then(() => {
      // Restore original styles after PDF generation
      element.style.overflow = originalOverflow;
      element.style.width = originalWidth;
    });
  }, 100);
};
import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyPDFDocument from "./MyPDFDocument";

const FormAndDownload = () => {
  const [formData, setFormData] = useState({
    receiptNumber: "",
    receiptDate: "",
    amountWords: "",
    amountNumber: "",
    name: "",
    address: "",
    pincode: "",
    mobile: "",
    email: "",
    pan: "",
    paymentMode: "",
    paymentDetails: "",
    donationPurpose: "",
  });

  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [documentData, setDocumentData] = useState(null);

  const handleGeneratePDF = () => {
    setDocumentData({ ...formData });
    setShowDownloadLink(true);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setShowDownloadLink(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ISKCON Dhanbad Donation Receipt Form</h2>

      <fieldset className="form-section">
        <legend>Receipt Details</legend>
        <input
          className="form-input"
          placeholder="Donor Receipt No."
          value={formData.receiptNumber}
          onChange={handleChange("receiptNumber")}
        />
        <input
          className="form-input"
          type="date"
          placeholder="Date"
          value={formData.receiptDate}
          onChange={handleChange("receiptDate")}
        />
      </fieldset>

      <fieldset className="form-section">
        <legend>Donation Amount</legend>
        <input className="form-input" placeholder="Amount in Words" value={formData.amountWords} onChange={handleChange("amountWords")} />
        <input className="form-input" placeholder="Amount in Numbers" value={formData.amountNumber} onChange={handleChange("amountNumber")} />
      </fieldset>

      <fieldset className="form-section">
        <legend>Donor Details</legend>
        <input className="form-input" placeholder="Full Name" value={formData.name} onChange={handleChange("name")} />
        <textarea className="form-input" placeholder="Full Address" value={formData.address} onChange={handleChange("address")} rows={2} />
        <input className="form-input" placeholder="Pincode" value={formData.pincode} onChange={handleChange("pincode")} />
        <input className="form-input" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange("mobile")} />
        <input className="form-input" placeholder="Email Address" value={formData.email} onChange={handleChange("email")} />
        <input className="form-input" placeholder="PAN Number" value={formData.pan} onChange={handleChange("pan")} />
      </fieldset>

      <fieldset className="form-section">
        <legend>Payment Info</legend>
        <select className="form-input" value={formData.paymentMode} onChange={handleChange("paymentMode")}>
          <option value="">-- Select Mode of Payment --</option>
          <option value="Cheque">Cheque</option>
          <option value="Online">Online</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
        </select>
        <input className="form-input" placeholder="Cheque / Transaction Details" value={formData.paymentDetails} onChange={handleChange("paymentDetails")} />
        <select className="form-input" value={formData.donationPurpose} onChange={handleChange("donationPurpose")}>
          <option value="">-- Select Purpose of Donation --</option>
          <option value="Corpus">Corpus</option>
          <option value="General">General</option>
          <option value="Others">Others</option>
        </select>
      </fieldset>

      <div className="button-section">
        <button className="form-button" onClick={handleGeneratePDF}>
        Generate PDF
      </button>

      {showDownloadLink && (
        <div>
          <PDFDownloadLink
            document={<MyPDFDocument formData={documentData} />}
            fileName={`ISKCON_Dhanbad_${formData.receiptNumber}.pdf`}
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : <button className="form-button">Download PDF</button>
            }
          </PDFDownloadLink>
        </div>
      )}
      </div>
    </div>
  );
};

export default FormAndDownload;

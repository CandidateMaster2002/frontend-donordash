// src/components/MyPDFDocument.jsx
import React from "react";
import { Document } from "@react-pdf/renderer";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";

const MyPDFDocument = ({ receiptData }) => (
  <Document>
    <PageOne formData={receiptData} />
    <PageTwo />
  </Document>
);

export default MyPDFDocument;

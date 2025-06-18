import React from "react";
import iskconDhanbadLogo from "../../assets/images/iskcon_dhanbad_logo-removebg.png";
import signatureImage from "../../assets/images/signature.jpg";
import { formatNumberWithCommas, numberToWords } from "./constants";
import { formatDateDDMMYYYY } from "../../utils/services";
import { useLocation } from "react-router-dom";
import { handleClickdownloadAsPdf } from "./services";
import MyPDFDocument from "./MyPDFDocument";

const colors = {
  lightBlue: "#dbf1fc",
  yellow: "#fffcdd",
  pink: "#cda4c5",
  blue: "#3d4694",
};

const Receipt = () => {
  const { receiptData } = useLocation().state;
  console.log(receiptData);
  const {
    paymentDate,
    amount,
    donorName,
    donorAddress,
    donorPIN,
    pan,
    mobile,
    email,
    verifiedDate,
    paymentMode,
    transactionID,
    receiptNumber,
  } = receiptData;

  // Format the amount with commas
  const formattedAmount = formatNumberWithCommas(amount);

  // Convert the amount to words
  const amountInWords = numberToWords(parseInt(amount));

  return (
    // <>dd</>
    <MyPDFDocument receiptData={receiptData}/>
  )


};

export default Receipt;

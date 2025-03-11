import React from "react";
import iskconDhanbadLogo from "../../assets/images/iskcon_dhanbad_logo-removebg.png";
import signatureImage from "../../assets/images/signature.jpg";
import { formatNumberWithCommas, numberToWords } from "./constants";
import { formatDateDDMMYYYY } from "../../utils/services";
import { useLocation } from "react-router-dom";
import { handleClickdownloadAsPdf } from "./services";

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
    <div>
      <div className="flex items-center mx-auto max-w-fit m-2">
        <button
          onClick={() => handleClickdownloadAsPdf(receiptData)}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Download PDF
        </button>
      </div>
      <div
        id="receiptPdf"
        className="flex border border-2 flex-col items-center bg-pink-50 max-w-fit items-center mx-auto *:pb-1"
      >
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-900">
            International Society for Krishna Consciousness (ISKCON)
          </h1>
          <h4 className="text-sm text-blue-900">
            Founder-Acharya: His Divine Grace A.C. Bhaktivedanta Swami
            Prabhupada
          </h4>
        </div>

        {/* Logo, Address, and Receipt Number/Date Section */}
        <div className="flex flex-col md:flex-row items-center gap-x-2 w-full max-w-3xl">
          {/* ISKCON Logo - 10% width */}
          <div className="w-[17%] flex justify-center bg-pink-50">
            <img
              src={iskconDhanbadLogo}
              alt="ISKCON Dhanbad Logo"
              className="w-28 h-28"
              style={{ borderColor: colors.pink }}
            />
          </div>

          {/* Temple Address - 50% width */}
          <div
            className="w-[50%] border-2 rounded-lg text-center pb-1"
            style={{ borderColor: colors.pink, backgroundColor: colors.yellow }}
          >
            <p className="text-sm text-gray-800">
              Extension Center: Dhruv Singh Colony <br /> Rahargora , Dhaiya, Dhanbad <br /> Jharkhand, PIN - 826004
            </p>
            <p className="text-sm text-gray-800">📞 Mobile No: 7644070770/9903013399</p>
            <p className="text-sm text-gray-800">✉️ Email: acc.iskcondhanbad@gmail.com</p>
          </div>

          {/* Receipt Number and Date Box - 40% width */}
          <div
            className="w-[33%] flex flex-col items-center justify-center border-2 p-2 rounded-lg"
            style={{
              borderColor: colors.pink,
              backgroundColor: colors.lightBlue,
            }}
          >
            <h2 className="font-semibold text-sm text-pink-600">
              Permanent Receipt No.:
            </h2>
            <p className="text-md font-bold text-gray-700">{receiptNumber}</p>
            <div
              className="p-1 rounded-lg mt-1 flex items-center justify-center"
              style={{
              borderColor: colors.pink,
              // backgroundColor: colors.yellow,
              }}
            >
              <p className="text-lg font-bold text-blue-800">
              Date: {formatDateDDMMYYYY(paymentDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Donation Amount Section */}
        <div
          className="w-full max-w-3xl rounded-lg mb-1"
          style={{ backgroundColor: colors.lightBlue }}
        >
          <h2 className="text-pink-600 font-bold text-center text-md mb-1">
            Donation Amount
          </h2>
          <div className="flex justify-between">

            <p className={`text-md font-bold text-blue-800`}>Rupees {amountInWords} Only</p>
            <p className="text-black font-bold text-lg">₹ {formattedAmount}</p>
          </div>
        </div>

        {/* Donor and Payment Details Section */}
        <div className="flex flex-col md:flex-row gap-x-2 w-full max-w-3xl">
          {/* Donor Details */}
          <div
            className="flex-1 border-2 rounded-lg p-1"
            style={{
              borderColor: colors.pink,
              backgroundColor: colors.lightBlue,
            }}
          >
            
            <h2
              className="text-center font-bold text-md rounded-md text-pink-600"
            >
              Donor Details
            </h2>
            <p className="text-lg mt-1">
              <span className="text-gray-700 font-semibold">Name:</span> <span className="text-blue-800 font-bold">
                {donorName}
                </span>
            </p>
            <p className="text-md text-gray-700">
              <span className="font-semibold">Address:</span>
              <span className="text-blue-800 font-semibold">

               {donorAddress},{" "}
              {donorPIN}
              </span>
            </p>
            <p className="text-md">
              <span className="text-gray-700 font-semibold">Mobile: </span> <span className="text-blue-800 font-semibold">
                {mobile}
                </span>
            </p>
            <p className="text-md">
              <span className="text-gray-700 font-semibold">PAN: </span> <span className="text-blue-800 font-semibold">
                {pan|| " "}
                </span>
            </p>
          </div>
            {/* Payment Details */}
            <div
            className="flex-1 border-2 rounded-lg p-1"
            style={{
              borderColor: colors.pink,
              backgroundColor: colors.lightBlue,
            }}
            >
            <h2
              className="text-center font-bold text-md  rounded-md mb-2 text-pink-600"
            >
              Payment Details
            </h2>
            <p className="text-lg mt-1">
              <span className="text-gray-700 font-semibold">Payment Mode:</span> <span className="text-blue-800 font-bold">{paymentMode}</span>
            </p>
            <p className="text-md text-gray-700">
              <span className="font-semibold">Transaction ID:</span> <span className="text-blue-800 font-semibold">{transactionID}</span>
            </p>
            <p className="text-md">
              <span className="text-gray-700 font-semibold">Paid On:</span> <span className="text-blue-800 font-semibold">{verifiedDate}</span>
            </p>
            <p className="text-md">
              <span className="text-gray-700 font-semibold">Amount:</span> <span className="text-blue-800 font-semibold">₹ {formattedAmount}</span>
            </p>
            </div>
        </div>

      
      {/* Authorized Signatory Section */}
      <div className="flex justify-end w-full max-w-3xl">
          <div
            className="border-2 rounded-lg text-center w-1/2"
            style={{ borderColor: colors.pink, backgroundColor: colors.yellow }}
          >
            <h2 className="font-bold text-sm text-blue-900">
              Authorized Signatory
            </h2>
            <div className="flex justify-center">
              <img
                src={signatureImage}
                alt="Signature"
                className="h-16 rounded-lg"
                style={{ borderColor: colors.pink }}
              />
            </div>
          </div>
        </div>


        {/* Footer Section */}
        <div
          className="border-2 rounded-lg  text-center w-full max-w-3xl mt-1"
          style={{ borderColor: colors.pink, backgroundColor: colors.yellow }}
        >
          <p className="text-sm text-gray-800">
            <span className="font-semibold">Registered Office:</span> Hare
            Krishna Land, Juhu, Mumbai - 400049.
          </p>
          <p className="text-sm text-gray-800">
            Registered under Maharashtra Public Trust Act 1950, vide
            Registration No. F-2179 (Bom). PAN: AAATI0017
          </p>
        </div>
      </div>

    
    </div>
  );
};

export default Receipt;




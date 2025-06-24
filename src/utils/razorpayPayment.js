import axiosInstance from "./myAxios";
import {
  CREATE_ORDER,
  VERIFY_PAYMENT,
  DONATE,
} from "../constants/apiEndpoints";
import { changeDonationStatus } from "./services";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};



const handleStatusChange = async (id,newStatus) => {
  try {
    await changeDonationStatus(id, newStatus);
  } catch (error) {
    alert("Failed to change donation status");
  }
};

export const handleRazorpayPayment = async (donationData,donorData) => {
  const isScriptLoaded = await loadRazorpayScript();

  if (!isScriptLoaded) {
    throw new Error("Razorpay SDK failed to load. Are you online?");
  }

  try {
    const orderResponse = await axiosInstance.post(CREATE_ORDER, {
      amount: donationData.amount * 100, // Amount in paise
      donorId: donationData.donorId,

    });

    if (!orderResponse.data) {
      throw new Error("Server error. Unable to create order.");
    }

    const { orderId, key, amount: orderAmount, currency } = orderResponse.data;

    return new Promise((resolve, reject) => {
      const options = {
        key,
        amount: orderAmount,
        currency,
        name: "Donation",
        description: "Donation for a good cause",
        order_id: orderId,
        handler: async (response) => {
          try {
            const paymentVerification = await axiosInstance.post(
              VERIFY_PAYMENT,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (paymentVerification.data === "Payment Successful") {
              donationData.transactionId = response.razorpay_payment_id;
              donationData.paymentDate = new Date().toISOString();

              const donateResponse = await axiosInstance.post(
                DONATE,
                donationData
              );
              handleStatusChange(donateResponse?.data?.id, "Verified");
              resolve(donateResponse);
            } else {
              reject(new Error("Payment Failed"));
            }
          } catch (error) {
            reject(new Error("Payment verification failed: " + error.message));
          }
        },
        prefill: {
          name: donorData.name || "Donor Name",
          email: donorData.email || "donor@example.com",
          contact: donorData.mobileNumber || "9999999999",
        },
        notes:donorData,
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        reject(
          new Error(response.error.description || "Payment was unsuccessful")
        );
      });

      paymentObject.open();
    });
  } catch (error) {
    throw new Error("Failed to create Razorpay order: " + error.message);
  }
};

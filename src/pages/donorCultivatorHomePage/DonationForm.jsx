import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DONORS_FILTER } from '../../constants/apiEndpoints';
import axiosInstance from '../../utils/myAxios';
import { donate } from '../../utils/services';

const DonationForm = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [donors, setDonors] = useState();
  const paymentMode = watch('paymentMode');

  
  const fetchDonors = async (obj) => {
    try {
      const params=obj;
      const response = await axiosInstance.get(DONORS_FILTER, { params });
      setDonors(response.data);
    } catch (err) {
      console.error('Error fetching donors:', err.message);
    } 
  };

  useEffect(() => {
    fetchDonors();
  },[]);

  const addDonation = async (donationData) => {
    try {
      const response = await donate(donationData);
      onClose();
    } catch (error) {
      console.error('Donation failed:', error.message);
      alert('Donation failed1: ' + error.message);
    }
  };

  const onSubmit = (data) => {
    const donationData = {
      amount: data.amount,
      purpose: data.purpose,
      paymentMode: data.paymentMode,
      transactionId: paymentMode === 'Bank Transfer' || paymentMode === 'Cheque' ? data.transactionId : null,
      donorId: data.donorId, // Use the selected donorId from the form
      createdAt: new Date().toISOString(),
    };
  
    addDonation(donationData);
  };

  if (!isOpen) return null;

 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Add Donation</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              {...register('amount', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.amount && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          {/* Purpose Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose of Donation</label>
            <select
              {...register('purpose', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="" disabled>Select purpose</option>
              <option value="Charity">Charity</option>
              <option value="Relief">Relief</option>
              <option value="Education">Education</option>
            </select>
            {errors.purpose && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          {/* Donor Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donor Name</label>
            <select
  {...register('donorId', { required: true })}
  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
>
  <option value="" disabled>Select donor</option>
  {donors && donors.map((donor) => (
    <option key={donor.id} value={donor.id}>{donor.name}</option>
  ))}
</select>
            {errors.donorName && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              {...register('date', { required: true })}
              defaultValue={new Date().toISOString().substr(0, 10)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.date && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          {/* Payment Method Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
            <select
              {...register('paymentMode', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="" disabled>Select payment method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
            {errors.paymentMode && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          {/* Transaction ID Field (Conditional) */}
          {(paymentMode === 'Bank Transfer' || paymentMode === 'Cheque') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID</label>
              <input
                type="text"
                {...register('transactionId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          )}

          {/* Remark Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remark</label>
            <input
              type="text"
              {...register('remark')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
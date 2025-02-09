import React from 'react';
import { useForm } from 'react-hook-form';
import { donationPurposes, paymentMethods } from '../../constants/constants';
import { validations } from '../../utils/validations';

const DonateNowPopup = ({ amount, purpose, closePopup }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            purpose: purpose,
            paymentMethod: '',
        }
    });

    const onSubmit = (data) => {
        // Handle payment logic here
        console.log(`Paying ${amount} for ${data.purpose} using ${data.paymentMethod}`);
        closePopup();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={closePopup}>
                    &times;
                </button>
                <h3 className="text-2xl font-semibold mb-4 text-center">Donate Now</h3>
                <p className="mb-4 text-center text-lg">Amount: <span className="font-bold">${amount}</span></p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Purpose:</label>
                        <select
                            {...register('purpose')}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {donationPurposes.map((purpose, index) => (
                                <option key={index} value={purpose}>{purpose}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Payment Method:</label>
                        <select
                            {...register('paymentMethod', {
                                required: validations.paymentMethod.validation.required,
                            })}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Payment Method</option>
                            {paymentMethods.map((method, index) => (
                                <option key={index} value={method}>{method}</option>
                            ))}
                        </select>
                        {errors.paymentMethod && (
                            <span className="text-red-500 text-sm">{validations.paymentMethod.validation.errorMessages.required}</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Pay
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DonateNowPopup;
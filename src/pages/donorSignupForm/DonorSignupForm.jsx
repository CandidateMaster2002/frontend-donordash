import React from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { connectedToOptions, zoneOptions } from './dummyValues.jsx';
import SpecialDaysSection from './SpecialDaysSection';
import { validations } from '../../utils/validations.jsx';
import useFetchCityAndState from '../../hooks/useFetchCityAndState';

const DonorSignupForm = () => {
    const methods = useForm({
        defaultValues: {
            legalName: '',
            mobileNumber: '',
            email: '',
            fullPostalAddress: '',
            city: '',
            state: '',
            pincode: '',
            panNumber: '',
            connectedTo: '',
            zone: '',
            wantPrasadam: false,
            specialDays: [],
            password: '',
            confirmPassword: '',
        }
    });

    const pincode = useWatch({ control: methods.control, name: 'pincode' });

    useFetchCityAndState(pincode, methods.setValue);

    const onSubmit = (data) => {
        console.log(data);
    };

    const renderError = (field) => {
        const error = methods.formState.errors[field];
        if (error) {
            return <span className="text-red-500 text-sm">{validations[field].validation.errorMessages[error.type]}</span>;
        }
        return null;
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Donor Signup</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Legal Name</label>
                    <input type="text" {...methods.register('legalName', validations.legalName.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('legalName')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Mobile Number</label>
                    <input type="text" {...methods.register('mobileNumber', validations.mobileNumber.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('mobileNumber')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input type="email" {...methods.register('email', validations.email.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('email')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Full Postal Address</label>
                    <textarea {...methods.register('fullPostalAddress', validations.fullPostalAddress.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                    {renderError('fullPostalAddress')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Pincode</label>
                    <input type="text" {...methods.register('pincode', validations.pincode.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('pincode')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">City</label>
                    <input type="text" {...methods.register('city', validations.city.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">State</label>
                    <input type="text" {...methods.register('state', validations.state.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">PAN Number (optional)</label>
                    <input type="text" {...methods.register('panNumber', validations.panNumber.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('panNumber')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">To Whom You Are Connected</label>
                    <select {...methods.register('connectedTo', validations.connectedTo.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {connectedToOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {renderError('connectedTo')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zone (optional)</label>
                    <select {...methods.register('zone', validations.zone.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {zoneOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Password</label>
                    <input type="password" {...methods.register('password', validations.password.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('password')}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Confirm Password</label>
                    <input type="password" {...methods.register('confirmPassword', validations.confirmPassword.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {renderError('confirmPassword')}
                </div>
                <SpecialDaysSection />
                <div className="mt-6">
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</button>
                </div>
            </form>
        </FormProvider>
    );
};

export default DonorSignupForm;
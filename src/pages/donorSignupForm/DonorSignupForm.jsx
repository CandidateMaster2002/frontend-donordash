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
            return <span>{validations[field].validation.errorMessages[error.type]}</span>;
        }
        return null;
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div>
                    <label>Legal Name</label>
                    <input type="text" {...methods.register('legalName', validations.legalName.validation)} />
                    {renderError('legalName')}
                </div>
                <div>
                    <label>Mobile Number</label>
                    <input type="text" {...methods.register('mobileNumber', validations.mobileNumber.validation)} />
                    {renderError('mobileNumber')}
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" {...methods.register('email', validations.email.validation)} />
                    {renderError('email')}
                </div>
                <div>
                    <label>Full Postal Address</label>
                    <textarea {...methods.register('fullPostalAddress', validations.fullPostalAddress.validation)}></textarea>
                    {renderError('fullPostalAddress')}
                </div>
                <div>
                    <label>Pincode</label>
                    <input type="text" {...methods.register('pincode', validations.pincode.validation)} />
                    {renderError('pincode')}
                </div>
                <div>
                    <label>City</label>
                    <input type="text" {...methods.register('city', validations.city.validation)} disabled />
                </div>
                <div>
                    <label>State</label>
                    <input type="text" {...methods.register('state', validations.state.validation)} disabled />
                </div>
                <div>
                    <label>PAN Number (optional)</label>
                    <input type="text" {...methods.register('panNumber', validations.panNumber.validation)} />
                    {renderError('panNumber')}
                </div>
                <div>
                    <label>To Whom You Are Connected</label>
                    <select {...methods.register('connectedTo', validations.connectedTo.validation)}>
                        {connectedToOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {renderError('connectedTo')}
                </div>
                <div>
                    <label>Zone (optional)</label>
                    <select {...methods.register('zone', validations.zone.validation)}>
                        {zoneOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" {...methods.register('password', validations.password.validation)} />
                    {renderError('password')}
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" {...methods.register('confirmPassword', validations.confirmPassword.validation)} />
                    {renderError('confirmPassword')}
                </div>
                <SpecialDaysSection />
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
};

export default DonorSignupForm;
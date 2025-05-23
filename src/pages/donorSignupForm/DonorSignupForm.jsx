import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import SpecialDaysSection from './SpecialDaysSection';
import { validations } from '../../utils/validations';
import useFetchCityAndState from '../../hooks/useFetchCityAndState';
import { handleDonorSignup } from './handleDonorSignup';
import { useNavigate } from 'react-router-dom';
import { zones } from '../../constants/constants';
import { getRedirectPath, getAllDonorCultivators } from '../../utils/services';

const DonorSignupForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [donorCultivators, setDonorCultivators] = useState([]);
 
  useEffect(() => {
    const fetchDonorCultivators = async () => {
      try {
        const cultivators = await getAllDonorCultivators();
        setDonorCultivators(cultivators);
      } catch (error) {
        console.error('Error fetching donor cultivators:', error);
      }
    };

    fetchDonorCultivators();

    // const user = JSON.parse(localStorage.getItem('user'));
    // if (user) {
    //   navigate(getRedirectPath(user.userType));
    // }
  }, [navigate]);

  const methods = useForm({
    defaultValues: {
      name: '',
      mobileNumber: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      password: '',
      remark:'Not Mentioned',
      zone:'Other'
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      data.donorCultivatorId = parseInt(data.donorCultivatorId, 10);
      console.log('Form data before submission:', data);
      delete data.confirmPassword;
      if (data.panNumber === '') delete data.panNumber;
      await handleDonorSignup(data, navigate);
      methods.reset();
      // onSubmit(data, photo);
    } finally {
      setIsSubmitting(false);
    }
  };
 

  const pincode = useWatch({ control: methods.control, name: 'pincode' });

  useEffect(() => {
    methods.register('confirmPassword', {
      validate: value => value === methods.getValues('password') || 'Passwords do not match'
    });
  }, [methods]);

  useFetchCityAndState(pincode, methods.setValue);

  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
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
      <form onSubmit={methods.handleSubmit(onFormSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-5xl font-bold mb-8 text-center">Donor Registration</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Legal Name/वैध नाम</label>
          <input type="text" {...methods.register('name', validations.name.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('name')}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Mobile Number/मोबाइल नंबर</label>
          <input type="text" {...methods.register('mobileNumber', validations.mobileNumber.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('mobileNumber')}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email/ईमेल (optional)</label>
          <input type="email" {...methods.register('email', validations.email.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('email')}
        
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Full  Address/पूरा  पता</label>
          <textarea {...methods.register('address', validations.address.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          {renderError('address')}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Pincode/पिनकोड</label>
          <input type="text" {...methods.register('pincode', validations.pincode.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('pincode')}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">City/शहर</label>
          <input type="text" {...methods.register('city', validations.city.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">State/राज्य</label>
          <input type="text" {...methods.register('state', validations.state.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">PAN Number/पैन नंबर (optional)</label>
          <input type="text" {...methods.register('panNumber', validations.panNumber.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('panNumber')}
          <p className="text-sm">For 80G tax benefit PAN is compulsory</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Connected To/किससे जुड़े हैं ?</label>
          <select {...methods.register('donorCultivatorId', validations.connectedTo.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {donorCultivators.map((cultivator) => (
              <option key={cultivator.id} value={cultivator.id}>{cultivator.name}</option>
            ))}
          </select>
          {renderError('connectedTo')}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Zone/क्षेत्र</label>
          <select {...methods.register('zone', validations.zone.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {zones.map((zone) => (
              <option key={zone.id} value={zone.value}>{zone.value}</option>
            ))}
          </select>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Password/पासवर्ड</label>
          <input type="password" {...methods.register('password', validations.password.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('paasword')}
        </div>
  
          <label className="block text-gray-700 font-bold mb-2">Confirm Password/पासवर्ड की पुष्टि</label>
          <input type="password" {...methods.register('confirmPassword', validations.confirmPassword.validation)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          {renderError('confirmPassword')}
        </div>
        {/* <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div> */}

        <div className="mt-6">
          <button
            type="submit"
            className={`w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isSubmitting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

       
      </form>
    </FormProvider>
  );
};

export default DonorSignupForm;
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {
  getDonorById,
  fetchSpecialDaysByDonorId,
  editDonorById,
  getUserTypeFromLocalStorage,
} from '../../utils/services';
import useFetchCityAndState from '../../hooks/useFetchCityAndState';
import { validations } from '../../utils/validations';
import { zones } from '../../constants/constants';
import SuccessPopup from '../../components/SuccessPopup';
import DonorDonationHistory from './components/DonorDonationHistory';
import { toast } from 'react-toastify';

const DonorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [donor, setDonor] = useState(null);
  const [specialDays, setSpecialDays] = useState([]);
  const { id } = useParams();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const axiosConfig = { showLoader: 'fullscreen' };
        const donorData = await getDonorById(id, axiosConfig);
        setDonor(donorData);
        if (donorData.wantPrasadam) {
          const specialDaysData = await fetchSpecialDaysByDonorId(id);
          setSpecialDays(specialDaysData);
        }
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    fetchDonor();
  }, [id]);

  const getDefaultValues = () => ({
    legalName: donor?.donorName ?? '',
    type: donor?.type ?? '',
    totalDonatedAmount: donor?.totalDonatedAmount ?? 0,
    wantPrasadam: donor?.wantPrasadam ?? false,
    category: donor?.category ?? '',
    mobileNumber: donor?.mobileNumber ?? '',
    email: donor?.email ?? '',
    fullPostalAddress: donor?.address ?? '',
    city: donor?.city ?? '',
    state: donor?.state ?? '',
    pincode: donor?.pincode ?? '',
    panNumber: donor?.panNumber ?? '',
    connectedTo: donor?.cultivatorName ?? '',
    zone: donor?.zone ?? '',
    remark: donor?.remark ?? '',
    supervisor: donor?.supervisorName ?? '',
    specialDays: (specialDays ?? []).map((day) => ({
      ...day,
      date: new Date(day.date).toISOString().split('T')[0],
    })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specialDays',
  });

  useEffect(() => {
    if (donor) {
      reset(getDefaultValues());
    }
  }, [donor, specialDays, reset]);

  const pincode = watch('pincode');
  useFetchCityAndState(pincode, setValue);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const donorData = {
        name: data.legalName,
        type: data.type,
        totalDonatedAmount: data.totalDonatedAmount,
        wantPrasadam: data.wantPrasadam,
        category: data.category,
        email: data.email,
        mobileNumber: data.mobileNumber,
        state: data.state,
        city: data.city,
        zone: data.zone,
        pincode: data.pincode,
        address: data.fullPostalAddress,
        panNumber: data.panNumber,
        remark: data.remark,
        specialDays: data.specialDays,
      };

      await editDonorById(id, donorData);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error updating donor data:', error);
      toast.error(error.message || 'Failed to edit donor');
      reset(getDefaultValues());
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const inputClasses = (hasError, forceReadOnly = false) =>
    `w-full px-4 py-2 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
      isEditing && !forceReadOnly
        ? 'bg-white text-gray-800 focus:ring-purple-500 border-gray-300 shadow-sm'
        : 'bg-gray-50 text-gray-700 border-transparent cursor-default caret-transparent shadow-none'
    } ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`;

  const labelClasses =
    'block text-sm font-semibold text-gray-700 mb-1.5 tracking-wide';
  const sectionClasses =
    'bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 transition-colors duration-300';
  const sectionTitleClasses =
    'text-lg font-bold text-purple-700 mb-5 pb-2 border-b border-gray-100 flex items-center';

  return (
    <div className="min-h-screen bg-gray-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 transition-colors duration-300">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Donor Profile
          </h1>
          <div className="mt-4 sm:mt-0 flex gap-3 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    reset(getDefaultValues());
                    setIsEditing(false);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition-all ${
                    loading
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  <FaSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Details Section */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>
              <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                👤
              </span>
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className={labelClasses}>Legal Name</label>
                <input
                  type="text"
                  {...register('legalName', validations.name.validation)}
                  className={inputClasses(errors.legalName)}
                  readOnly={!isEditing}
                />
                {errors.legalName && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {validations.name.validation.errorMessages.required}
                  </span>
                )}
              </div>

              <div>
                <label className={labelClasses}>Type</label>
                <select
                  {...register('type')}
                  className={inputClasses(false)}
                  disabled={!isEditing}
                >
                  <option value="One Timer">One Timer</option>
                  <option value="Nitya Sevak">Nitya Sevak</option>
                </select>
              </div>

              {getUserTypeFromLocalStorage() !== 'donor' && (
                <div>
                  <label className={labelClasses}>Category</label>
                  <input
                    type="text"
                    {...register('category', validations.category?.validation)}
                    className={inputClasses(errors.category, true)}
                    readOnly
                  />
                  {errors.category && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {validations.category?.validation.errorMessages.required}
                    </span>
                  )}
                </div>
              )}

              <div>
                <label className={labelClasses}>PAN Number</label>
                <input
                  type="text"
                  {...register('panNumber', validations.panNumber.validation)}
                  className={inputClasses(errors.panNumber)}
                  readOnly={!isEditing}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.panNumber && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {
                      validations.panNumber.validation.errorMessages[
                        errors.panNumber.type
                      ]
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Address Section */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                📍
              </span>
              Contact & Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className={labelClasses}>Mobile Number</label>
                <input
                  type="text"
                  {...register(
                    'mobileNumber',
                    validations.mobileNumber.validation
                  )}
                  className={inputClasses(errors.mobileNumber)}
                  readOnly={!isEditing}
                />
                {errors.mobileNumber && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {
                      validations.mobileNumber.validation.errorMessages[
                        errors.mobileNumber.type
                      ]
                    }
                  </span>
                )}
              </div>

              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  type="email"
                  {...register('email', validations.email.validation)}
                  className={inputClasses(errors.email)}
                  readOnly={!isEditing}
                />
                {errors.email && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {
                      validations.email.validation.errorMessages[
                        errors.email.type
                      ]
                    }
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Full Postal Address</label>
                <textarea
                  {...register(
                    'fullPostalAddress',
                    validations.address.validation
                  )}
                  className={inputClasses(errors.fullPostalAddress)}
                  readOnly={!isEditing}
                  rows={3}
                />
                {errors.fullPostalAddress && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {validations.address.validation.errorMessages.required}
                  </span>
                )}
              </div>

              <div>
                <label className={labelClasses}>Pincode</label>
                <input
                  type="text"
                  {...register('pincode', validations.pincode.validation)}
                  className={inputClasses(errors.pincode)}
                  readOnly={!isEditing}
                />
                {errors.pincode && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {
                      validations.pincode.validation.errorMessages[
                        errors.pincode.type
                      ]
                    }
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>City</label>
                  <input
                    type="text"
                    {...register('city', validations.city.validation)}
                    className={`${inputClasses(errors.city, true)} bg-gray-50`}
                    readOnly
                  />
                </div>
                <div>
                  <label className={labelClasses}>State</label>
                  <input
                    type="text"
                    {...register('state', validations.state.validation)}
                    className={`${inputClasses(errors.state, true)} bg-gray-50`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cultivation Details Section */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>
              <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                🌱
              </span>
              Cultivation & Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className={labelClasses}>Total Amount Donated</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    {...register('totalDonatedAmount')}
                    className={`${inputClasses(false, true)} pl-8 font-semibold text-green-600`}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  Connected To (Cultivator)
                </label>
                <input
                  type="text"
                  {...register(
                    'connectedTo',
                    validations.connectedTo.validation
                  )}
                  className={`${inputClasses(errors.connectedTo, true)} bg-gray-50`}
                  readOnly
                />
                {errors.connectedTo && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {validations.connectedTo.validation.errorMessages.required}
                  </span>
                )}
              </div>

              <div>
                <label className={labelClasses}>Zone</label>
                <select
                  {...register('zone', validations.zone.validation)}
                  className={inputClasses(errors.zone)}
                  disabled={!isEditing}
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.value}>
                      {zone.value}
                    </option>
                  ))}
                </select>
                {errors.zone && (
                  <span className="text-sm text-red-500 mt-1 block">
                    Please select a zone
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Remarks</label>
                <textarea
                  {...register('remark', validations.remark?.validation)}
                  className={inputClasses(errors.remark)}
                  readOnly={!isEditing}
                  rows={2}
                  placeholder="Additional notes about the donor..."
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>
              <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">
                ✨
              </span>
              Preferences & Special Days
            </h2>
            <div className="space-y-5">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer transition-colors hover:bg-gray-100">
                <input
                  type="checkbox"
                  {...register('wantPrasadam')}
                  disabled={!isEditing}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-3 font-medium text-gray-700">
                  Wants Prasadam
                </span>
              </label>

              {watch('wantPrasadam') && (
                <div className="pl-2 border-l-4 border-purple-200 space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <input
                        type="date"
                        {...register(`specialDays.${index}.date`, {
                          required: true,
                        })}
                        className={inputClasses(
                          errors.specialDays?.[index]?.date
                        )}
                        readOnly={!isEditing}
                      />
                      <select
                        {...register(`specialDays.${index}.purpose`, {
                          required: true,
                        })}
                        className={inputClasses(
                          errors.specialDays?.[index]?.purpose
                        )}
                        disabled={!isEditing}
                      >
                        <option value="Anniversary">Anniversary</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Others">Others</option>
                      </select>

                      {watch(`specialDays.${index}.purpose`) === 'Others' && (
                        <input
                          type="text"
                          placeholder="Specify occasion"
                          {...register(`specialDays.${index}.otherPurpose`)}
                          className={inputClasses(
                            errors.specialDays?.[index]?.otherPurpose
                          )}
                          readOnly={!isEditing}
                        />
                      )}

                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Special Day"
                        >
                          <FaTimes size={18} />
                        </button>
                      )}
                    </div>
                  ))}

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          date: '',
                          purpose: 'Anniversary',
                          otherPurpose: '',
                        })
                      }
                      className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      <span className="bg-purple-100 p-1 rounded-full mr-2">
                        +
                      </span>
                      Add Special Day
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        <DonorDonationHistory donorId={id} embedded showTitle />
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          message="Successfully updated donor data!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default DonorProfilePage;

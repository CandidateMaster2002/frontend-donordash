import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa"; // Icons for buttons
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getDonorById,
  fetchSpecialDaysByDonorId,
  editDonorById,
  getUserTypeFromLocalStorage,
} from "../../utils/services";
import useFetchCityAndState from "../../hooks/useFetchCityAndState";
import { validations } from "../../utils/validations";
import { zones } from "../../constants/constants";

const DonorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [donor, setDonor] = useState(null);
  const [specialDays, setSpecialDays] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const donorData = await getDonorById(id);
        setDonor(donorData);
        if (donorData.wantPrasadam) {
          const specialDaysData = await fetchSpecialDaysByDonorId(id);
          setSpecialDays(specialDaysData);
        }
      } catch (error) {
        console.error("Error fetching donor data:", error);
      }
    };

    fetchDonor();
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialDays",
  });

  useEffect(() => {
    if (donor) {
      setValue("legalName", donor.name);
      setValue("wantPrasadam", donor.wantPrasadam);
      setValue("category", donor.category);
      setValue("mobileNumber", donor.mobileNumber);
      setValue("email", donor.email);
      setValue("fullPostalAddress", donor.address);
      setValue("city", donor.city);
      setValue("state", donor.state);
      setValue("pincode", donor.pincode);
      setValue("panNumber", donor.panNumber);
      setValue("connectedTo", donor.donorCultivator.name);
      setValue("zone", donor.zone);
      setValue("remark", donor.remark);
      setValue("supervisor", donor.donorCultivator.donationSupervisor.name);
      if(specialDays)
      setValue(
        "specialDays",
        specialDays?.map((day) => ({
          ...day,
          date: new Date(day.date).toISOString().split("T")[0],
        }))
      );
    }
  }, [donor, specialDays, setValue]);

  const pincode = watch("pincode");
  useFetchCityAndState(pincode, setValue);

  const onSubmit = async (data) => {
    try {
      const donorData = {
        name: data.legalName,
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating donor data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Donor Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legal Name
              </label>
              <input
                type="text"
                {...register("legalName", validations.name.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.legalName ? "border-red-500" : "border-gray-300"}`}
                readOnly={!isEditing}
              />
              {errors.legalName && (
                <span className="text-sm text-red-500">
                  {validations.name.validation.errorMessages.required}
                </span>
              )}
            </div>


          {getUserTypeFromLocalStorage() !== "donor" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                {...register("category", validations.category?.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.category ? "border-red-500" : "border-gray-300"}`}
                readOnly={!isEditing}
              />
              {errors.category && (
                <span className="text-sm text-red-500">
                  {validations.category?.validation.errorMessages.required}
                </span>
              )}
            </div>
          ) : (
            <></>
          )}
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                {...register(
                  "mobileNumber",
                  validations.mobileNumber.validation
                )}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${
                  errors.mobileNumber ? "border-red-500" : "border-gray-300"
                }`}
                readOnly={!isEditing}
              />
              {errors.mobileNumber && (
                <span className="text-sm text-red-500">
                  {
                    validations.mobileNumber.validation.errorMessages[
                      errors.mobileNumber.type
                    ]
                  }
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", validations.email.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.email ? "border-red-500" : "border-gray-300"}`}
                readOnly={!isEditing}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {
                    validations.email.validation.errorMessages[
                      errors.email.type
                    ]
                  }
                </span>
              )}
            </div>

            {/* Full Postal Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Postal Address
              </label>
              <textarea
                {...register(
                  "fullPostalAddress",
                  validations.address.validation
                )}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${
                  errors.fullPostalAddress
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                readOnly={!isEditing}
                rows={3}
              />
              {errors.fullPostalAddress && (
                <span className="text-sm text-red-500">
                  {validations.address.validation.errorMessages.required}
                </span>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                {...register("city", validations.city.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.city ? "border-red-500" : "border-gray-300"}`}
                readOnly
              />
              {errors.city && (
                <span className="text-sm text-red-500">
                  {validations.city.validation.errorMessages.required}
                </span>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                {...register("state", validations.state.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.state ? "border-red-500" : "border-gray-300"}`}
                readOnly
              />
              {errors.state && (
                <span className="text-sm text-red-500">
                  {validations.state.validation.errorMessages.required}
                </span>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                {...register("pincode", validations.pincode.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
                readOnly={!isEditing}
              />
              {errors.pincode && (
                <span className="text-sm text-red-500">
                  {
                    validations.pincode.validation.errorMessages[
                      errors.pincode.type
                    ]
                  }
                </span>
              )}
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number (optional)
              </label>
              <input
                type="text"
                {...register("panNumber", validations.panNumber.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.panNumber ? "border-red-500" : "border-gray-300"}`}
                readOnly={!isEditing}
              />
              {errors.panNumber && (
                <span className="text-sm text-red-500">
                  {
                    validations.panNumber.validation.errorMessages[
                      errors.panNumber.type
                    ]
                  }
                </span>
              )}
            </div>

            {/* Connected To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connected To
              </label>
              <input
                type="text"
                {...register("connectedTo", validations.connectedTo.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.connectedTo ? "border-red-500" : "border-gray-300"}`}
                readOnly
              />
              {errors.connectedTo && (
                <span className="text-sm text-red-500">
                  {validations.connectedTo.validation.errorMessages.required}
                </span>
              )}
            </div>

            {/* Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone (optional)
              </label>
              <select
                {...register("zone", validations.zone.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.zone ? "border-red-500" : "border-gray-300"}`}
                disabled={!isEditing}
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.value}>
                    {zone.value}
                  </option>
                ))}
              </select>
            </div>
            {/* Supervisor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor
              </label>
              <input
                type="text"
                {...register("supervisor")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } border-gray-300`}
                readOnly
              />
            </div>

            {/* Remark */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <textarea
                {...register("remark", validations.remark?.validation)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isEditing ? "focus:ring-blue-500" : "focus:ring-gray-300"
                } ${errors.remark ? "border-red-500" : "border-gray-300"}`}
                readOnly={!isEditing}
                rows={3}
              />
              {errors.remark && (
                <span className="text-sm text-red-500">
                  {validations.remark?.validation.errorMessages.required}
                </span>
              )}
            </div>

            {/* Want Prasadam */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Want Prasadam
              </label>
              <input
                type="checkbox"
                {...register("wantPrasadam")}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isEditing}
              />
            </div>

            {/* Special Days */}
            {watch("wantPrasadam") && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Days
                </label>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 mb-4"
                  >
                    <input
                      type="date"
                      {...register(`specialDays.${index}.date`, {
                        required: true,
                      })}
                      className={`w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isEditing
                          ? "focus:ring-blue-500"
                          : "focus:ring-gray-300"
                      } ${
                        errors.specialDays?.[index]?.date
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      readOnly={!isEditing}
                    />
                    <select
                      {...register(`specialDays.${index}.purpose`, {
                        required: true,
                      })}
                      className={`w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isEditing
                          ? "focus:ring-blue-500"
                          : "focus:ring-gray-300"
                      } ${
                        errors.specialDays?.[index]?.purpose
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={!isEditing}
                    >
                      <option value="Anniversary">Anniversary</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Others">Others</option>
                    </select>
                    {watch(`specialDays.${index}.purpose`) === "Others" && (
                      <input
                        type="text"
                        {...register(`specialDays.${index}.otherPurpose`)}
                        className={`w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          isEditing
                            ? "focus:ring-blue-500"
                            : "focus:ring-gray-300"
                        } ${
                          errors.specialDays?.[index]?.otherPurpose
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        readOnly={!isEditing}
                      />
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        date: "",
                        purpose: "Anniversary",
                        otherPurpose: "",
                      })
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add Special Day
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-8">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-2"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <FaSave className="mr-2" /> Save
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorProfilePage;

import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';

const SpecialDaysSection = () => {
    const { control, register, watch } = useFormContext();
    const { fields, append } = useFieldArray({
        control,
        name: 'specialDays',
    });

    const wantPrasadam = watch('wantPrasadam', false);

    const handleAddSpecialDay = () => {
        append({ date: '', purpose: '', otherPurpose: '' });
    };

    return (
        <div className="mt-4">
            <div className="mb-4">
                <input type="checkbox" {...register('wantPrasadam')} className="mr-2" />
                <label className="text-gray-700">Do you want prasadam on your special days (terms and conditions apply)</label>
            </div>
            {wantPrasadam && (
                <div>
                    {fields.map((item, index) => (
                        <div key={item.id} className="mb-4">
                            <input type="date" {...register(`specialDays.${index}.date`)} className="w-full px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <Controller
                                name={`specialDays.${index}.purpose`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div>
                                        <select {...field} className="w-full px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="">Select purpose</option>
                                            <option value="Birthday">Birthday</option>
                                            <option value="Anniversary">Anniversary</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        {field.value === 'Others' && (
                                            <input
                                                type="text"
                                                placeholder="Please specify"
                                                {...register(`specialDays.${index}.otherPurpose`)}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        )}
                                    </div>
                                )}
                            />
                            {index === fields.length - 1 && (
                                <button type="button" onClick={handleAddSpecialDay} className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Add Another Special Day</button>
                            )}
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <button type="button" onClick={handleAddSpecialDay} className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Add Special Day</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SpecialDaysSection;
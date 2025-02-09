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
        <div>
            <input type="checkbox" {...register('wantPrasadam')} />
            <label>Do you want prasadam on your special days (terms and conditions apply)</label>
            {wantPrasadam && (
                <div>
                    {fields.map((item, index) => (
                        <div key={item.id}>
                            <input type="date" {...register(`specialDays.${index}.date`)} />
                            <Controller
                                name={`specialDays.${index}.purpose`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div>
                                        <select {...field}>
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
                                            />
                                        )}
                                    </div>
                                )}
                            />
                            {index === fields.length - 1 && (
                                <button type="button" onClick={handleAddSpecialDay}>+</button>
                            )}
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <button type="button" onClick={handleAddSpecialDay}>+</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SpecialDaysSection;
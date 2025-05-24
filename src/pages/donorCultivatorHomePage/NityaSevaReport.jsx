import React, { useEffect, useState } from "react";
import { formatMonthShort } from "../../utils/dateMethods";
import { NITYA_SEVA_STATUS, UPDATE_NITYA_SEVA_STATUS } from "../../constants/apiEndpoints";
import axiosInstance from "../../utils/myAxios";

const NityaSevaReport = () => {
  const [nityaSevaData, setNityaSevaData] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});

  const fetchNityaSevaStatus = async (cultivatorId) => {
    const params = cultivatorId ? { cultivatorId } : {};
    const response = await axiosInstance.get(NITYA_SEVA_STATUS, { params });
    return response;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchNityaSevaStatus(1);
        setNityaSevaData(result.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [isUpdating]);

  const allMonths = Array.from(
    new Set(nityaSevaData.flatMap((donor) => donor.months.map((m) => m.month)))
  ).sort((a, b) => 
    new Date(b.split("-").reverse().join("-")) - 
    new Date(a.split("-").reverse().join("-"))
  );

    const sortedMonths = allMonths.sort(
    (a, b) =>
      new Date(b.split("-").reverse().join("-")) -
      new Date(a.split("-").reverse().join("-"))
  );

  const handleCheckboxChange = async (donorId, month, eventType, currentValue) => {
    const newValue = !currentValue;
    const updateKey = `${donorId}-${month}-${eventType}`;

    // Optimistic UI update
    setNityaSevaData(prevData => 
      prevData.map(donor => {
        if (donor.donorId === donorId) {
          const updatedMonths = donor.months.map(m => {
            if (m.month === month) {
              return { ...m, [eventType]: newValue };
            }
            return m;
          });
          return { ...donor, months: updatedMonths };
        }
        return donor;
      })
    );

    setIsUpdating(prev => ({ ...prev, [updateKey]: true }));

    try {
      await axiosInstance.post(UPDATE_NITYA_SEVA_STATUS, {
        donorId,
        month,
        eventType: eventType === 'nitya_seva' ? 'nitya_seva' : 'sweet_or_btg',
        finalValue: newValue
      });
    } catch (error) {
      console.error("Update failed:", error);
      // Revert on error
      setNityaSevaData(prevData => 
        prevData.map(donor => {
          if (donor.donorId === donorId) {
            const updatedMonths = donor.months.map(m => {
              if (m.month === month) {
                return { ...m, [eventType]: currentValue };
              }
              return m;
            });
            return { ...donor, months: updatedMonths };
          }
          return donor;
        })
      );
    } finally {
      setIsUpdating(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          Monthly Contributions Report
        </h1>

        <div className="relative shadow-lg rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <th className="px- py-3 text-left font-semibold sticky left-0 z-30 bg-gradient-to-r from-purple-600 to-blue-600">
                      Donor Name
                    </th>
                    {allMonths.map(month => (
                      <th key={month} colSpan={2} className="px-6 py-3 text-center font-semibold border-r border-purple-400 last:border-r-0 sticky top-0 z-20 bg-gradient-to-r from-purple-600 to-blue-600">
                        {formatMonthShort(month)}
                      </th>
                    ))}
                  </tr>
                  
                  <tr className="bg-gray-100 text-purple-800 font-medium">
                    <th className="px-4 py-2 text-center sticky left-0 z-30 bg-gray-100  ">
                      <div className="flex flex-col items-center">
                        <span className="text-sm">Total donors</span>
                        <span className="text-2xl font-bold text-purple-700">
                          {nityaSevaData.length}
                        </span>
                      </div>
                    </th>
                    {allMonths.map(month => (
                      <React.Fragment key={month}>
                        <th className="px-3 py-2 text-center text-sm border-r border-purple-200 sticky top-[48px] z-20 bg-gray-100">
                          Nitya Seva
                        </th>
                        <th className="px-3 py-2 text-center text-sm border-r border-purple-400 last:border-r-0 sticky top-[48px] z-20 bg-gray-100">
                          Sweet/ BTG
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>

                    <tr className="bg-gray-50 text-red-700 font-medium">
    <th className="px-4 py-2 text-center sticky left-0 z-30 bg-gray-50  ">
      Remaining
    </th>
    {sortedMonths.map((month) => {
      // Calculate unchecked counts for this month
      const monthData = nityaSevaData.flatMap(donor => 
        donor.months.filter(m => m.month === month)
      );
      
      const uncheckedNityaSeva = monthData.filter(m => !m.nityaSeva).length;
      const uncheckedSweetBtg = monthData.filter(m => !m.sweetOrBtg).length;
      
      return (
        <React.Fragment key={month}>
          <th className="px-3 py-2 text-center text-xl border-r border-purple-200 sticky top-[96px] z-20 bg-gray-50">
            {uncheckedNityaSeva}
          </th>
          <th className="px-3 py-2 text-center text-xl border-r border-purple-400 last:border-r-0 sticky top-[96px] z-20 bg-gray-50">
            {uncheckedSweetBtg}
          </th>
        </React.Fragment>
      );
    })}
  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {nityaSevaData.map(donor => (
                    <tr key={donor.donorId} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-blue-700 sticky left-0 z-10 bg-white  ">
                        {donor.donorName}
                      </td>
                      {allMonths.map(month => {
                        const monthData = donor.months.find(m => m.month === month) || { 
                          sweetOrBtg: false, 
                          nityaSeva: false 
                        };
                        return (
                          <React.Fragment key={month}>
                            <td className="px-2 py-2 text-center border-r border-purple-200">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={monthData.nityaSeva}
                                  onChange={() => handleCheckboxChange(
                                    donor.donorId, 
                                    month, 
                                    'nitya_seva', 
                                    monthData.nityaSeva
                                  )}
                                  disabled={isUpdating[`${donor.donorId}-${month}-nitya_seva`]}
                                  className={`mx-auto h-4 w-4 text-purple-600 focus:ring-purple-500 cursor-pointer ${
                                    isUpdating[`${donor.donorId}-${month}-nitya_seva`] ? 'opacity-50' : ''
                                  }`}
                                />
                                {isUpdating[`${donor.donorId}-${month}-nitya_seva`] && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center border-r border-purple-400 last:border-r-0">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={monthData.sweetOrBtg}
                                  onChange={() => handleCheckboxChange(
                                    donor.donorId, 
                                    month, 
                                    'sweet_or_btg', 
                                    monthData.sweetOrBtg
                                  )}
                                  disabled={isUpdating[`${donor.donorId}-${month}-sweet_or_btg`]}
                                  className={`mx-auto h-4 w-4 text-purple-600 focus:ring-purple-500 cursor-pointer ${
                                    isUpdating[`${donor.donorId}-${month}-sweet_or_btg`] ? 'opacity-50' : ''
                                  }`}
                                />
                                {isUpdating[`${donor.donorId}-${month}-sweet_or_btg`] && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NityaSevaReport;
import React from "react";
import { formatMonthShort } from "../../utils/dateMethods";
import { NITYA_SEVA_STATUS } from "../../constants/apiEndpoints";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/myAxios";

const NityaSevaReport = () => {
  const [nityaSevaData, setNityaSevaData] = useState([]);

  const fetchNityaSevaStatus = async (cultivatorId) => {
    const params = cultivatorId ? { cultivatorId } : {};
    const response = await axiosInstance.get(NITYA_SEVA_STATUS, { params });
    return response.nityaSevaData;
  };

  useEffect(() => {
    console.log("Fetching Nitya Seva data...");
    const fetchData = async () => {
      try {
        const result = await fetchNityaSevaStatus(1);
        console.log("Fetched Nitya Seva data:", result);
        setNityaSevaData(result);
      } catch (error) {
        // handle error if needed
      }
    };
    fetchData();
  }, []);

//   const nnnityaSevaData = [
//     {
//       donorId: 22,
//       donorName: "Jane Doe",
//       months: [
//         {
//           month: "05-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2024",
//           sweetOrBtg: false,
//           nityaSeva: true,
//         },
//         {
//           month: "09-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "10-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "11-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "12-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "01-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "02-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "03-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "04-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "05-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//       ],
//     },
//     {
//       donorId: 24,
//       donorName: "Bob Smith",
//       months: [
//         {
//           month: "05-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2024",
//           sweetOrBtg: false,
//           nityaSeva: true,
//         },
//         {
//           month: "09-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "10-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "11-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "12-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "01-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "02-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "03-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "04-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "05-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//       ],
//     },
//     {
//       donorId: 26,
//       donorName: "David Williams",
//       months: [
//         {
//           month: "05-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2024",
//           sweetOrBtg: false,
//           nityaSeva: true,
//         },
//         {
//           month: "09-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "10-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "11-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "12-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "01-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "02-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "03-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "04-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "05-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//       ],
//     },
//     {
//       donorId: 60,
//       donorName: "John Doendnd",
//       months: [
//         {
//           month: "05-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2024",
//           sweetOrBtg: false,
//           nityaSeva: true,
//         },
//         {
//           month: "09-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "10-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "11-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "12-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "01-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "02-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "03-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "04-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "05-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//       ],
//     },
//     {
//       donorId: 64,
//       donorName: "harsh agrawal",
//       months: [
//         {
//           month: "05-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2024",
//           sweetOrBtg: false,
//           nityaSeva: true,
//         },
//         {
//           month: "09-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "10-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "11-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "12-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "01-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "02-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "03-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "04-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "05-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//       ],
//     },
//     {
//       donorId: 130,
//       donorName: "harshhhhhhdd aegggrawalddd",
//       months: [
//         {
//           month: "05-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2024",
//           sweetOrBtg: false,
//           nityaSeva: true,
//         },
//         {
//           month: "09-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "10-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "11-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "12-2024",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "01-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "02-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "03-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "04-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "05-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "06-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "07-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//         {
//           month: "08-2025",
//           sweetOrBtg: false,
//           nityaSeva: false,
//         },
//       ],
//     },
//   ];

  const allMonths = Array.from(
    new Set(nityaSevaData.flatMap((donor) => donor.months.map((m) => m.month)))
  );
  const sortedMonths = allMonths.sort(
    (a, b) =>
      new Date(b.split("-").reverse().join("-")) -
      new Date(a.split("-").reverse().join("-"))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          Monthly Contributions Report
        </h1>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full table-auto border-collapse">
            {/* First Header Row: Months */}
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <th className="px-4 py-3 text-left font-semibold sticky left-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600">
                  Donor Name
                </th>
                {sortedMonths.map((month) => (
                  <th
                    key={month}
                    colSpan={2}
                    className="px-6 py-3 text-center font-semibold border-r border-purple-400 last:border-r-0"
                  >
                    {formatMonthShort(month)}
                  </th>
                ))}
              </tr>

              {/* Second Header Row: Sub-Headers */}
              <tr className="bg-gray-100 text-purple-800 font-medium">
                <th className="px-4 py-2 text-left sticky left-0 z-10 bg-gray-100"></th>
                {sortedMonths.map((month) => (
                  <React.Fragment key={month}>
                    <th className="px-3 py-2 text-center text-sm border-r border-purple-200">
                      Nitya Seva
                    </th>
                    <th className="px-3 py-2 text-center text-sm border-r border-purple-400 last:border-r-0">
                      Sweet/BTG
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody className="divide-y divide-gray-200">
              {nityaSevaData.map((donor) => (
                <tr
                  key={donor.donorId}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-blue-700 sticky left-0 z-10 bg-white">
                    {donor.donorName}
                  </td>
                  {sortedMonths.map((month) => {
                    const monthData = donor.months.find(
                      (m) => m.month === month
                    ) || {
                      sweetOrBtg: false,
                      nityaSeva: false,
                    };
                    return (
                      <React.Fragment key={month}>
                        <td className="px-2 py-2 text-center border-r border-purple-200">
                          <input
                            type="checkbox"
                            checked={monthData.nityaSeva}
                            readOnly
                            className="mx-auto h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-2 py-2 text-center border-r border-purple-400 last:border-r-0">
                          <input
                            type="checkbox"
                            checked={monthData.sweetOrBtg}
                            readOnly
                            className="mx-auto h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
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
  );
};

export default NityaSevaReport;

import React from "react";

const DonationSummaryTable = ({ data, columnName1, columnName2 }) => {
  if (data && data.length > 0) data = data.sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">{columnName1}</th>
            <th className="py-3 px-4 text-left">{columnName2}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-all">
              <td className="py-3 px-4 border-b">{row.description}</td>
              <td className="py-3 px-4 border-b">₹{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationSummaryTable;

// import React from "react";

// const DonationSummaryTable = ({ data, columnName1, columnName2 }) => {
//   if (data && data.length > 0) data = data.sort((a, b) => b.amount - a.amount);

//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
//       <table className="min-w-full">
//         <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
//           <tr>
//             <th className="py-3 px-4 text-left text-sm font-medium">
//               {" "}
//               {columnName1}{" "}
//             </th>
//             <th className="py-3 px-4 text-left text-sm font-medium">
//               {" "}
//               {columnName2}{" "}
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {data?.map((row, index) => (
//             <tr
//               key={index}
//               className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
//             >
//               <td className="py-3 px-4 border-b border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200">
//                 {row.description}
//               </td>
//               <td className="py-3 px-4 border-b border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200">
//                 ₹{row.amount}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DonationSummaryTable;

import React from 'react';

const DonationsToApproveTable = ({ donations, loading, updatingId, onApprove }) => {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-blue-900">
        Donations to be Approved
      </h2>
      {loading ? (
        <p className="rounded-md bg-blue-50 px-4 py-3 text-blue-800">
          Loading donations to approve...
        </p>
      ) : donations.length === 0 ? (
        <p className="rounded-md bg-gray-50 px-4 py-3 text-gray-700">
          No donations to approve.
        </p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto table-scroll-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-center">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                <tr>
                  <th className="sticky left-0 z-20 bg-blue-900 px-4 py-3 text-sm font-semibold">#</th>
                  <th className="px-4 py-3 text-sm font-semibold">Donor</th>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Collected By
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">Amount</th>
                  <th className="px-4 py-3 text-sm font-semibold">Purpose</th>
                  <th className="px-4 py-3 text-sm font-semibold">Mode</th>
                  <th className="px-4 py-3 text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {donations.map((donation, index) => (
                  <tr key={donation.id} className="hover:bg-blue-50/40">
                    <td className="sticky left-0 z-10 bg-blue-50 px-4 py-3 font-semibold text-blue-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">{donation.donorName}</td>
                    <td className="px-4 py-3">{donation.collectedByName}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">
                      ₹{Number(donation.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">{donation.purpose}</td>
                    <td className="px-4 py-3">{donation.paymentMode}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onApprove(donation.id)}
                        disabled={updatingId === donation.id}
                        className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingId === donation.id
                          ? 'Approving...'
                          : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile View   */}
          <div className="md:hidden">
            <div className="relative overflow-x-auto table-scroll-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-[860px] w-full text-sm border-collapse">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                  <tr>
                    <th className="sticky left-0 z-20 bg-blue-900 px-2 py-2 text-left font-semibold">
                      #
                    </th>
                    <th className="px-2 py-2 text-left font-semibold">Donor</th>
                    <th className="px-2 py-2 text-left font-semibold">
                      Collected By
                    </th>
                    <th className="px-2 py-2 text-right font-semibold">
                      Amount
                    </th>
                    <th className="px-2 py-2 text-left font-semibold">
                      Purpose
                    </th>
                    <th className="px-2 py-2 text-left font-semibold">Mode</th>
                    <th className="px-2 py-2 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-800">
                  {donations.map((donation, index) => (
                    <tr key={donation.id} className="hover:bg-blue-50/40">
                      <td className="sticky left-0 z-10 bg-blue-50 px-2 py-2 font-semibold text-blue-900">
                        {index + 1}
                      </td>
                      <td className="truncate px-2 py-2">{donation.donorName}</td>
                      <td className="truncate px-2 py-2">{donation.collectedByName}</td>
                      <td className="px-2 py-2 text-right font-semibold text-emerald-700">
                        ₹{Number(donation.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="truncate px-2 py-2">{donation.purpose}</td>
                      <td className="truncate px-2 py-2">{donation.paymentMode}</td>
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => onApprove(donation.id)}
                          disabled={updatingId === donation.id}
                          className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingId === donation.id
                            ? 'Approving...'
                            : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <style>{`
        .table-scroll-hidden {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .table-scroll-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default DonationsToApproveTable;

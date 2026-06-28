import React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { donationPurposes } from '../../../constants/constants';
import { changeDonationStatus, donate } from '../../../utils/services';

const formatPaymentDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RazorpayDonationsTable = ({
  donations,
  donorCultivator,
  allDonors,
  cultivatorDonors,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onSubmit,
  onRefreshDonations,
  loading,
  error,
}) => {
  const [showAllDonors, setShowAllDonors] = useState(false);
  const [filterByRazorpayTag, setFilterByRazorpayTag] = useState(true);
  const [razorpaySearchQuery, setRazorpaySearchQuery] = useState('');
  const [searchTermByRow, setSearchTermByRow] = useState({});
  const [selectionByRow, setSelectionByRow] = useState({});
  const [remarkByRow, setRemarkByRow] = useState({});
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [submittingRowKey, setSubmittingRowKey] = useState(null);
  const [confirmSubmission, setConfirmSubmission] = useState(null);

  const donorOptions = useMemo(() => {
    return showAllDonors ? allDonors : cultivatorDonors;
  }, [showAllDonors, allDonors, cultivatorDonors]);

  const filteredDonations = useMemo(() => {
    if (!filterByRazorpayTag) {
      return donations;
    }

    const razorpayTag = donorCultivator?.razorpayTag;
    if (!razorpayTag) {
      return [];
    }

    return donations.filter((donation) => donation?.notes === razorpayTag);
  }, [donations, filterByRazorpayTag, donorCultivator]);

  const displayedDonations = useMemo(() => {
    const query = razorpaySearchQuery.trim().toLowerCase();
    if (!query) return filteredDonations;

    return filteredDonations.filter((donation) => {
      const rrn = String(donation?.rrn ?? '').toLowerCase();
      const transactionId = String(donation?.transactionId ?? '').toLowerCase();
      return rrn.includes(query) || transactionId.includes(query);
    });
  }, [filteredDonations, razorpaySearchQuery]);

  const getDonorId = (donor) => donor?.donorId ?? donor?.id ?? '';
  const getDonorLabel = (donor) =>
    `${donor?.username || donor?.donorName || 'Unknown'} - ${
      donor?.mobileNumber || 'NA'
    }`;

  const getRowKey = (donation, index) =>
    donation?.transactionId || donation?.rrn || `row-${index}`;

  const handleDonorSelect = (rowKey, donor) => {
    setSelectionByRow((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        donorId: getDonorId(donor),
      },
    }));
    setSearchTermByRow((prev) => ({
      ...prev,
      [rowKey]: getDonorLabel(donor),
    }));
    setActiveRowKey(null);
  };

  const handlePurposeSelect = (rowKey, purpose) => {
    setSelectionByRow((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        purpose,
      },
    }));
  };

  const getCreatedDonationId = (donateResponse) =>
    donateResponse?.data?.data?.donation?.id ??
    donateResponse?.data?.donation?.id ??
    null;

  const submitDonationRow = async (donation, rowKey) => {
    const selected = selectionByRow[rowKey] || {};
    const purposeMeta = donationPurposes.find(
      (purpose) => purpose.value === selected.purpose
    );
    const selectedDonorId = Number(selected.donorId);
    const selectedDonorBelongsToCultivator = cultivatorDonors.some(
      (donor) => Number(getDonorId(donor)) === selectedDonorId
    );
    const status = selectedDonorBelongsToCultivator ? 'Pending' : 'Unapproved';

    const userRemark = remarkByRow[rowKey] || '';

    const payload = {
      amount: Number(donation?.amount || 0),
      purpose: selected.purpose,
      paymentMode: 'Razorpay Link',
      transactionId: donation?.transactionId || null,
      status,
      remark: userRemark || donation?.notes || '',
      donorId: selectedDonorId,
      createdAt: new Date().toISOString(),
      paymentDate: donation?.paymentDate || new Date().toISOString(),
      collectedById: donorCultivator?.id,
      notGenerateReceipt: false,
      isUnclaimedRazorpayDonation: true,
      costCenter: purposeMeta?.costCenter || '',
    };

    try {
      if (!donorCultivator?.id) {
        throw new Error('Donor cultivator id is missing.');
      }
      setSubmittingRowKey(rowKey);
      const donateResponse = await donate(payload);
      const createdDonationId = getCreatedDonationId(donateResponse);

      if (status === 'Pending') {
        if (!createdDonationId) {
          throw new Error(
            'Donation created but ID missing for auto-verification.'
          );
        }
        await changeDonationStatus(createdDonationId, 'Verified');
      }

      toast.success(
        status === 'Pending'
          ? 'Donation submitted and verified successfully.'
          : 'Donation submitted successfully with Unapproved status.'
      );
      if (onRefreshDonations) {
        await onRefreshDonations();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit Razorpay donation.');
    } finally {
      setSubmittingRowKey(null);
    }
  };

  const handleSubmitRow = (donation, rowKey) => {
    const selected = selectionByRow[rowKey] || {};
    const selectedDonor = donorOptions.find(
      (donor) => String(getDonorId(donor)) === String(selected.donorId)
    );
    const selectedDonorBelongsToCultivator = cultivatorDonors.some(
      (donor) => String(getDonorId(donor)) === String(selected.donorId)
    );
    const status = selectedDonorBelongsToCultivator ? 'Pending' : 'Unapproved';

    setConfirmSubmission({
      donation,
      rowKey,
      donorName:
        selectedDonor?.username || selectedDonor?.donorName || 'Unknown',
      donorMobile: selectedDonor?.mobileNumber || 'NA',
      donorId: selected.donorId,
      purpose: selected.purpose,
      amount: Number(donation?.amount || 0),
      transactionId: donation?.transactionId || '-',
      paymentDate: donation?.paymentDate || '-',
      remark: remarkByRow[rowKey] || '',
      status,
      isDifferentCultivatorDonor: !selectedDonorBelongsToCultivator,
    });
  };

  const confirmAndSubmitRow = async () => {
    if (!confirmSubmission) return;
    const { donation, rowKey } = confirmSubmission;
    setConfirmSubmission(null);
    await submitDonationRow(donation, rowKey);
  };

  return (
    <>
      <div className="mt-6 mb-3">
        <h2 className="text-xl font-bold text-blue-900">
          Unclaimed Razorpay Donations
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Review unclaimed online donations by date range.
        </p>
      </div>
      <section className="mb-10 rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="px-5 py-4">
          <form
            onSubmit={onSubmit}
            className="mb-5 grid grid-cols-1 gap-3 rounded-xl bg-purple-50/40 p-3 sm:grid-cols-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:self-end">
              <button
                type="button"
                onClick={() => setShowAllDonors((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition sm:px-3.5 sm:text-[13px] ${
                  showAllDonors
                    ? 'border-blue-800 bg-blue-800 text-white hover:bg-blue-900'
                    : 'border-blue-200 bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    showAllDonors ? 'bg-white' : 'bg-blue-700'
                  }`}
                />
                {showAllDonors ? 'All Donors' : 'My Donors'}
              </button>
              <button
                type="button"
                onClick={() => setFilterByRazorpayTag((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition sm:px-3.5 sm:text-[13px] ${
                  filterByRazorpayTag
                    ? 'border-blue-800 bg-blue-800 text-white hover:bg-blue-900'
                    : 'border-blue-200 bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    filterByRazorpayTag ? 'bg-white' : 'bg-blue-700'
                  }`}
                />
                {filterByRazorpayTag ? 'My Donations' : 'All Donations'}
              </button>
            </div>
          </form>

          {error && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {!loading && filteredDonations.length === 0 ? (
            <p className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
              {filterByRazorpayTag
                ? donorCultivator?.razorpayTag
                  ? 'No Razorpay donations matched this cultivator tag.'
                  : 'This cultivator does not have a razorpayTag configured.'
                : 'No unclaimed Razorpay donations found for this date range.'}
            </p>
          ) : (
            <>
              <div className="mb-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-purple-50/60 px-4 py-3 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Search (RRN / Transaction ID)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5 19C15.1944 19 19 15.1944 19 10.5C19 5.80558 15.1944 2 10.5 2C5.80558 2 2 5.80558 2 10.5C2 15.1944 5.80558 19 10.5 19Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 22L17.8 17.8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={razorpaySearchQuery}
                        onChange={(e) => setRazorpaySearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setRazorpaySearchQuery('');
                          }
                        }}
                        placeholder="Type RRN or Transaction ID…"
                        className="w-full rounded-xl border border-gray-300 bg-white px-10 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                      {razorpaySearchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => setRazorpaySearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-white/70"
                          aria-label="Clear search"
                          title="Clear"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Showing{' '}
                      <span className="font-semibold text-gray-700">
                        {displayedDonations.length}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-gray-700">
                        {filteredDonations.length}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900">
                      Tip: Press <span className="font-bold">Esc</span> to clear
                    </span>
                  </div>
                </div>
              </div>

              {!loading && displayedDonations.length === 0 ? (
                <p className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  No Razorpay donations match your search. Try searching by RRN
                  or Transaction ID.
                </p>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto razorpay-horizontal-scroll">
                    <table className="min-w-[1500px] overflow-hidden rounded-xl border border-gray-200 text-left">
                      <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                        <tr>
                          <th className="sticky left-0 z-20 bg-blue-900 px-4 py-3 text-sm font-semibold">
                            Payment Date
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            RRN
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            Transaction ID
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            Donor
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            Purpose
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            Remarks
                          </th>
                          <th className="px-4 py-3 text-sm font-semibold">
                            Submit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {displayedDonations.map((donation, index) => (
                          <tr
                            key={getRowKey(donation, index)}
                            className="border-t border-gray-100 transition hover:bg-purple-50/40"
                          >
                            <td className="sticky left-0 z-10 whitespace-nowrap bg-blue-50 px-4 py-3 text-sm text-blue-900">
                              {formatPaymentDate(donation.paymentDate)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-700">
                              {donation.rrn || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-emerald-700">
                              ₹
                              {Number(donation.amount || 0).toLocaleString(
                                'en-IN'
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {donation.transactionId || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search donor"
                                  value={
                                    searchTermByRow[
                                      getRowKey(donation, index)
                                    ] || ''
                                  }
                                  onChange={(e) => {
                                    const rowKey = getRowKey(donation, index);
                                    setSearchTermByRow((prev) => ({
                                      ...prev,
                                      [rowKey]: e.target.value,
                                    }));
                                    setActiveRowKey(rowKey);
                                  }}
                                  onFocus={() =>
                                    setActiveRowKey(getRowKey(donation, index))
                                  }
                                  className="w-64 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-purple-500 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
                                />
                                {activeRowKey ===
                                  getRowKey(donation, index) && (
                                  <select
                                    size={6}
                                    className="absolute z-30 mt-1 w-64 rounded-md border border-gray-200 bg-white text-sm shadow-md donor-search-scroll text-gray-800 dark:bg-white dark:text-gray-800"
                                    onChange={(e) => {
                                      const selectedDonor = donorOptions.find(
                                        (d) =>
                                          String(getDonorId(d)) ===
                                          String(e.target.value)
                                      );
                                      if (selectedDonor) {
                                        handleDonorSelect(
                                          getRowKey(donation, index),
                                          selectedDonor
                                        );
                                      }
                                    }}
                                  >
                                    {donorOptions
                                      .filter((donor) =>
                                        getDonorLabel(donor)
                                          .toLowerCase()
                                          .includes(
                                            (
                                              searchTermByRow[
                                                getRowKey(donation, index)
                                              ] || ''
                                            ).toLowerCase()
                                          )
                                      )
                                      .map((donor) => (
                                        <option
                                          key={getDonorId(donor)}
                                          value={getDonorId(donor)}
                                          className="py-2"
                                        >
                                          {getDonorLabel(donor)}
                                        </option>
                                      ))}
                                  </select>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <select
                                value={
                                  selectionByRow[getRowKey(donation, index)]
                                    ?.purpose || ''
                                }
                                onChange={(e) =>
                                  handlePurposeSelect(
                                    getRowKey(donation, index),
                                    e.target.value
                                  )
                                }
                                className="w-56 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-purple-500 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
                              >
                                <option value="">Select Purpose</option>
                                {donationPurposes.map((purpose) => (
                                  <option
                                    key={purpose.id}
                                    value={purpose.value}
                                  >
                                    {purpose.value}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <input
                                type="text"
                                placeholder="Optional remarks"
                                value={
                                  remarkByRow[
                                    getRowKey(donation, index)
                                  ] || ''
                                }
                                onChange={(e) => {
                                  const rowKey = getRowKey(donation, index);
                                  setRemarkByRow((prev) => ({
                                    ...prev,
                                    [rowKey]: e.target.value,
                                  }));
                                }}
                                className="w-44 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-purple-500 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <button
                                onClick={() =>
                                  handleSubmitRow(
                                    donation,
                                    getRowKey(donation, index)
                                  )
                                }
                                disabled={
                                  submittingRowKey ===
                                    getRowKey(donation, index) ||
                                  !selectionByRow[getRowKey(donation, index)]
                                    ?.donorId ||
                                  !selectionByRow[getRowKey(donation, index)]
                                    ?.purpose
                                }
                                className="rounded-md bg-purple-700 px-3 py-1.5 text-white hover:bg-purple-800 disabled:opacity-50"
                              >
                                {submittingRowKey === getRowKey(donation, index)
                                  ? 'Submitting...'
                                  : 'Submit'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View   */}
                  <div className="md:hidden">
                    <div className="relative overflow-x-auto rounded-xl border border-gray-200 shadow-sm razorpay-horizontal-scroll">
                      <table className="min-w-[1500px] w-full text-sm border-collapse">
                        <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                          <tr>
                            <th className="w-[120px] px-3 py-2 text-left font-semibold bg-blue-900">
                              Payment Date
                            </th>
                            <th className="w-[90px] px-3 py-2 text-left font-semibold">
                              RRN
                            </th>
                            <th className="px-3 py-2 text-right font-semibold">
                              Amount
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                              Transaction ID
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                              Donor
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                              Purpose
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                              Remarks
                            </th>
                            <th className="w-[96px] px-3 py-2 text-center font-semibold">
                              Submit
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {displayedDonations.map((donation, index) => (
                            <tr
                              key={getRowKey(donation, index)}
                              className="hover:bg-purple-50/40"
                            >
                              <td className="w-[120px] whitespace-nowrap bg-blue-50 px-3 py-3 font-medium text-blue-900">
                                {formatPaymentDate(donation.paymentDate)}
                              </td>
                              <td className="w-[90px] px-3 py-3 text-gray-700">
                                {donation.rrn || '-'}
                              </td>
                              <td className="px-3 py-3 text-right font-semibold text-emerald-700">
                                ₹
                                {Number(donation.amount || 0).toLocaleString(
                                  'en-IN'
                                )}
                              </td>
                              <td className="px-3 py-3 text-gray-700">
                                {donation.transactionId || '-'}
                              </td>
                              <td className="px-3 py-3 text-gray-700">
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Search donor"
                                    value={
                                      searchTermByRow[
                                        getRowKey(donation, index)
                                      ] || ''
                                    }
                                    onChange={(e) => {
                                      const rowKey = getRowKey(donation, index);
                                      setSearchTermByRow((prev) => ({
                                        ...prev,
                                        [rowKey]: e.target.value,
                                      }));
                                      setActiveRowKey(rowKey);
                                    }}
                                    onFocus={() =>
                                      setActiveRowKey(
                                        getRowKey(donation, index)
                                      )
                                    }
                                    className="w-56 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-purple-500 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
                                  />
                                  {activeRowKey ===
                                    getRowKey(donation, index) && (
                                    <select
                                      size={6}
                                      className="absolute z-30 mt-1 w-56 rounded-md border border-gray-200 bg-white text-sm shadow-md donor-search-scroll text-gray-800 dark:bg-white dark:text-gray-800"
                                      onChange={(e) => {
                                        const selectedDonor = donorOptions.find(
                                          (d) =>
                                            String(getDonorId(d)) ===
                                            String(e.target.value)
                                        );
                                        if (selectedDonor) {
                                          handleDonorSelect(
                                            getRowKey(donation, index),
                                            selectedDonor
                                          );
                                        }
                                      }}
                                    >
                                      {donorOptions
                                        .filter((donor) =>
                                          getDonorLabel(donor)
                                            .toLowerCase()
                                            .includes(
                                              (
                                                searchTermByRow[
                                                  getRowKey(donation, index)
                                                ] || ''
                                              ).toLowerCase()
                                            )
                                        )
                                        .map((donor) => (
                                          <option
                                            key={getDonorId(donor)}
                                            value={getDonorId(donor)}
                                            className="py-2"
                                          >
                                            {getDonorLabel(donor)}
                                          </option>
                                        ))}
                                    </select>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-gray-700">
                                <select
                                  value={
                                    selectionByRow[getRowKey(donation, index)]
                                      ?.purpose || ''
                                  }
                                  onChange={(e) =>
                                    handlePurposeSelect(
                                      getRowKey(donation, index),
                                      e.target.value
                                    )
                                  }
                                  className="w-44 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-purple-500 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
                                >
                                  <option value="">Select Purpose</option>
                                  {donationPurposes.map((purpose) => (
                                    <option
                                      key={purpose.id}
                                      value={purpose.value}
                                    >
                                      {purpose.value}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-3 text-gray-700">
                                <input
                                  type="text"
                                  placeholder="Optional remarks"
                                  value={
                                    remarkByRow[
                                      getRowKey(donation, index)
                                    ] || ''
                                  }
                                  onChange={(e) => {
                                    const rowKey = getRowKey(donation, index);
                                    setRemarkByRow((prev) => ({
                                      ...prev,
                                      [rowKey]: e.target.value,
                                    }));
                                  }}
                                  className="w-36 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-purple-500 bg-white text-gray-800 dark:bg-white dark:text-gray-800"
                                />
                              </td>
                              <td className="w-[96px] px-3 py-3 text-center">
                                <button
                                  onClick={() =>
                                    handleSubmitRow(
                                      donation,
                                      getRowKey(donation, index)
                                    )
                                  }
                                  disabled={
                                    submittingRowKey ===
                                      getRowKey(donation, index) ||
                                    !selectionByRow[getRowKey(donation, index)]
                                      ?.donorId ||
                                    !selectionByRow[getRowKey(donation, index)]
                                      ?.purpose
                                  }
                                  className="rounded-md bg-purple-700 px-3 py-1.5 text-white hover:bg-purple-800 disabled:opacity-50"
                                >
                                  {submittingRowKey ===
                                  getRowKey(donation, index)
                                    ? 'Submitting...'
                                    : 'Submit'}
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
            </>
          )}
        </div>
        <style>{`
        .razorpay-horizontal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .razorpay-horizontal-scroll::-webkit-scrollbar {
          display: none;
        }

        .donor-search-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .donor-search-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </section>
      {confirmSubmission && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <h4 className="text-lg font-semibold text-gray-900">
              Confirm Razorpay Donation Submission
            </h4>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Donor:</span>{' '}
                {confirmSubmission.donorName} ({confirmSubmission.donorMobile})
              </p>
              <p>
                <span className="font-semibold">Donor ID:</span>{' '}
                {confirmSubmission.donorId}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹
                {Number(confirmSubmission.amount).toLocaleString('en-IN')}
              </p>
              <p>
                <span className="font-semibold">Purpose:</span>{' '}
                {confirmSubmission.purpose}
              </p>
              <p>
                <span className="font-semibold">Transaction ID:</span>{' '}
                {confirmSubmission.transactionId}
              </p>
              <p>
                <span className="font-semibold">Payment Date:</span>{' '}
                {formatPaymentDate(confirmSubmission.paymentDate)}
              </p>
              <p>
                <span className="font-semibold">Status to submit:</span>{' '}
                {confirmSubmission.status}
              </p>
              {confirmSubmission.remark && (
                <p>
                  <span className="font-semibold">Remarks:</span>{' '}
                  {confirmSubmission.remark}
                </p>
              )}
              {confirmSubmission.isDifferentCultivatorDonor && (
                <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-800">
                  Selected donor belongs to a different cultivator. This
                  donation will be submitted as{' '}
                  <span className="font-semibold">Unapproved</span>.
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmSubmission(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndSubmitRow}
                className="rounded-lg bg-blue-800 px-4 py-2 text-sm text-white hover:bg-blue-900"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RazorpayDonationsTable;

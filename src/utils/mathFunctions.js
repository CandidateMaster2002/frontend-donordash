
export const calculateTotalDonationAmount = (donationsData) => {
  return donationsData.reduce((total, donation) => total + (donation.amount || 0), 0);
};


export const calculateAverageDonation = (donationsData) => {
  const totalAmount = calculateTotalDonationAmount(donationsData);
  return donationsData.length ? totalAmount / donationsData.length : 0;
};


export const calculateMedianDonation = (donationsData) => {
  if (!donationsData.length) return 0;

  const sortedAmounts = donationsData
    .map((donation) => donation.amount || 0)
    .sort((a, b) => a - b);

  const mid = Math.floor(sortedAmounts.length / 2);
  return sortedAmounts.length % 2 !== 0
    ? sortedAmounts[mid]
    : (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2;
};


export const calculateHighestDonation = (donationsData) => {
  return donationsData.length
    ? Math.max(...donationsData.map((donation) => donation.amount || 0))
    : 0;
};
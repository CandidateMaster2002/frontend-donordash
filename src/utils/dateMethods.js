export const formatMonthShort = (monthStr) => {
  const [month, year] = monthStr.split('-');
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const shortMonth = monthNamesShort[parseInt(month, 10) - 1];
  const shortYear = year.slice(-2);

  return `${shortMonth} ${shortYear}`;
};
export default function formatMoney(cents = 0) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  // If amount is a whole number of dollars, remove decimal places
  if (cents % 100 === 0) {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 0;
  }

  const formatter = new Intl.NumberFormat('en-US', options);
  return formatter.format(cents / 100);
}

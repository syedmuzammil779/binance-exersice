export const formatPrice = (price) => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatAmount = (amount) => {
  if (amount < 0.001) {
    return amount.toFixed(5);
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  });
};

export const formatTotal = (total) => {
  if (total >= 1000) {
    return (total / 1000).toFixed(2) + 'K';
  }
  return total.toFixed(2);
};

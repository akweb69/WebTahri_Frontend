export const USD_TO_BDT = 110;

export const getSalePrice = (price, discount) =>
  +(price - (price * discount) / 100).toFixed(2);

export const getBDT = (usd) => Math.round(usd * USD_TO_BDT);

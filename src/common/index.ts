// @ts-nocheck
export const parseNumeric = (item: any): number => +item;
export const findItemByKeyValue = (item: any, key: string) => key in item;
export const getYearFromDate = (date: string) => date.split("/")[2].toString();
export const getMonthFromDate = (date: string) => date.split("/")[0].toString();

export const getDateDiffInDays = (date1: string, date2: string): number => {
  const dateDiff = (new Date(date1) as any) - (new Date(date2) as any);
  return Math.round(Math.abs(dateDiff / (24 * 60 * 60 * 1000)));
};

export const calculateNewAvg = (
  oldAvg: number,
  total: number,
  newNumber: number
) => {
  return Math.round((oldAvg * total + newNumber) / (total + 1));
};

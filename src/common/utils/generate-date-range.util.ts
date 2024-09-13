import { DateRange } from '../interfaces';

export const generateDateRange = (dateString: string): DateRange => {
  const date = new Date(dateString);
  return {
    start: new Date(date.setUTCHours(0, 0, 0, 0)),
    end: new Date(date.setUTCHours(23, 59, 59, 999)),
  };
};

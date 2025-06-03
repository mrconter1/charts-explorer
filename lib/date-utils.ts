import { TimeWindow } from '@/types/podcast';

export const getDateRange = (timeWindow: TimeWindow, currentDate: Date = new Date()): { startDate: Date; endDate: Date } => {
  const endDate = new Date(currentDate);
  const startDate = new Date(currentDate);

  switch (timeWindow) {
    case 'week':
      startDate.setDate(currentDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(currentDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(currentDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(currentDate.getFullYear() - 1);
      break;
    case 'all':
      startDate.setFullYear(2020); // Set to a very early date for "all" data
      break;
  }

  return { startDate, endDate };
};

export const navigateTimeWindow = (
  currentDate: Date,
  timeWindow: TimeWindow,
  direction: 'prev' | 'next'
): Date => {
  const newDate = new Date(currentDate);
  const multiplier = direction === 'prev' ? -1 : 1;

  switch (timeWindow) {
    case 'week':
      newDate.setDate(currentDate.getDate() + (7 * multiplier));
      break;
    case 'month':
      newDate.setMonth(currentDate.getMonth() + multiplier);
      break;
    case 'quarter':
      newDate.setMonth(currentDate.getMonth() + (3 * multiplier));
      break;
    case 'year':
      newDate.setFullYear(currentDate.getFullYear() + multiplier);
      break;
    case 'all':
      // For "all", we don't navigate
      return currentDate;
  }

  return newDate;
};

export const formatDateRange = (startDate: Date, endDate: Date, timeWindow: TimeWindow): string => {
  if (timeWindow === 'all') {
    return 'All Time';
  }

  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: timeWindow === 'year' ? 'numeric' : undefined
  };

  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);

  return `${start} - ${end}`;
};

export const getTimeWindowLabel = (timeWindow: TimeWindow): string => {
  switch (timeWindow) {
    case 'week':
      return 'Week';
    case 'month':
      return 'Month';
    case 'quarter':
      return 'Quarter';
    case 'year':
      return 'Year';
    case 'all':
      return 'All Time';
  }
}; 
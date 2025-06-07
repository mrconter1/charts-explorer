import { TimeWindow } from '@/types/podcast';
import { 
  getWeek, 
  getYear, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  format
} from 'date-fns';



export const getDateRange = (timeWindow: TimeWindow, currentDate: Date = new Date()): { startDate: Date; endDate: Date } => {
  switch (timeWindow) {
    case 'week': {
      const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
      return { startDate, endDate };
    }
    case 'month': {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      return { startDate, endDate };
    }
    case 'quarter': {
      const startDate = startOfQuarter(currentDate);
      const endDate = endOfQuarter(currentDate);
      return { startDate, endDate };
    }
    case 'year': {
      const startDate = startOfYear(currentDate);
      const endDate = endOfYear(currentDate);
      return { startDate, endDate };
    }
    case 'all': {
      const startDate = new Date(2020, 0, 1); // Set to a very early date for "all" data
      const endDate = new Date();
      return { startDate, endDate };
    }
  }
};

export const navigateTimeWindow = (
  currentDate: Date,
  timeWindow: TimeWindow,
  direction: 'prev' | 'next'
): Date => {
  const multiplier = direction === 'prev' ? -1 : 1;

  switch (timeWindow) {
    case 'week': {
      return addWeeks(currentDate, multiplier);
    }
    case 'month': {
      return addMonths(currentDate, multiplier);
    }
    case 'quarter': {
      return addQuarters(currentDate, multiplier);
    }
    case 'year': {
      return addYears(currentDate, multiplier);
    }
    case 'all': {
      // For "all", we don't navigate
      return currentDate;
    }
  }
};

export const formatDateRange = (startDate: Date, endDate: Date, timeWindow: TimeWindow, originalDate?: Date): string => {
  if (timeWindow === 'all') {
    return 'All Time';
  }

  switch (timeWindow) {
    case 'week': {
      // Use the original date to calculate week number
      const referenceDate = originalDate || endDate;
      const weekNumber = getWeek(referenceDate, { weekStartsOn: 1 });
      const year = getYear(referenceDate);
      return `Week ${weekNumber}, ${year}`;
    }
    case 'month': {
      return format(startDate, 'MMMM yyyy');
    }
    case 'quarter': {
      const quarter = Math.floor(startDate.getMonth() / 3) + 1;
      const year = getYear(startDate);
      return `Q${quarter} ${year}`;
    }
    case 'year': {
      return getYear(startDate).toString();
    }
    default: {
      const start = format(startDate, 'MMM d, yyyy');
      const end = format(endDate, 'MMM d, yyyy');
      return `${start} - ${end}`;
    }
  }
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
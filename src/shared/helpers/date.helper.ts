import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

export const getTimeDuration = (
  start: Date,
): { toSeconds: string; endDate: Date; duration: number } => {
  const endDate = new Date();
  const duration = endDate.getTime() - start.getTime();
  const toSeconds = (duration / 1000).toFixed(3);

  return { toSeconds, duration, endDate };
};

export const getLastNDays = (n: number): Date => {
  return dayjs().tz('America/Santiago').subtract(n, 'day').toDate();
};

export const getLastNDaysAtStartOfDay = (n: number): Date => {
  return dayjs()
    .tz('America/Santiago')
    .subtract(n, 'day')
    .startOf('day')
    .toDate();
};

export const getLastNDaysAtEndOfDay = (n: number): Date => {
  return dayjs()
    .tz('America/Santiago')
    .subtract(n, 'day')
    .endOf('day')
    .toDate();
};

export const getStartOfDay = (date?: Date): Date => {
  return dayjs(date).tz('America/Santiago').startOf('day').toDate();
};

export const getEndOfDay = (date?: Date): Date => {
  return dayjs(date).tz('America/Santiago').endOf('day').toDate();
};

export const getNextNDays = (n: number): Date => {
  return dayjs().tz('America/Santiago').add(n, 'day').toDate();
};

export const getPreviousNDays = (n: number): Date => {
  return dayjs().tz('America/Santiago').subtract(n, 'day').toDate();
};

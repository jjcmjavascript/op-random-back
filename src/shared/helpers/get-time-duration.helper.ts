export const getTimeDuration = (
  start: Date,
): { toSeconds: string; endDate: Date; duration: number } => {
  const endDate = new Date();
  const duration = endDate.getTime() - start.getTime();
  const toSeconds = (duration / 1000).toFixed(3);

  return { toSeconds, duration, endDate };
};

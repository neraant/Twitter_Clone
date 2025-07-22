const LOCATION = 'en-US';

export const formatTimeLong = (inputTime: string) => {
  return inputTime
    ? new Intl.DateTimeFormat(LOCATION, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(inputTime))
    : '';
};

export const formatTimeShort = (inputTime: string) => {
  return inputTime
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(inputTime))
    : '';
};

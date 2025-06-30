import { MONTHS } from './registerForm.constants';

export const getDaysInMonth = (month: string, year: string): string[] => {
  const monthIndex = MONTHS.indexOf(month);
  const y = parseInt(year);
  if (monthIndex === -1 || isNaN(y))
    return Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const daysInMonth = new Date(y, monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
};

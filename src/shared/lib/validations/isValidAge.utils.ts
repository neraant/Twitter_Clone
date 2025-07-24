import { MIN_AGE } from './validation.constants';
import { DAY_MAX, DAY_MIN, MONTHS } from './validation.constants';

export function isValidAge(
  birthYear: string | undefined,
  birthMonth: string | undefined,
  birthDay: string | undefined,
): boolean {
  if (!birthYear || !birthMonth || !birthDay) return true;

  const day = parseInt(birthDay, 10);
  const year = parseInt(birthYear, 10);

  if (isNaN(day) || isNaN(year)) return false;
  if (day < DAY_MIN || day > DAY_MAX) return false;

  const monthIndex = MONTHS.indexOf(birthMonth);
  if (monthIndex === -1) return false;

  const birthDate = new Date(year, monthIndex, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== monthIndex ||
    birthDate.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= MIN_AGE;
}

'use client';

import { useMemo, useState } from 'react';

import { getDaysInMonth, MONTHS } from '../lib';

const START_YEAR = 1900;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) =>
  (currentYear - i).toString(),
);

export const useDateSelector = () => {
  const [selected, setSelected] = useState({
    day: '',
    month: '',
    year: '',
  });

  const handleSelectDay = (day: string) => {
    setSelected((prev) => ({ ...prev, day }));
  };

  const handleSelectMonth = (month: string) => {
    setSelected((prev) => {
      const days = getDaysInMonth(month, prev.year);
      const newDay = days.includes(prev.day) ? prev.day : '';
      return {
        ...prev,
        month,
        day: newDay,
      };
    });
  };

  const handleSelectYear = (year: string) => {
    setSelected((prev) => {
      const days = getDaysInMonth(prev.month, year);
      const newDay = days.includes(prev.day) ? prev.day : '';
      return {
        ...prev,
        year,
        day: newDay,
      };
    });
  };

  const formatDate = ({
    day,
    month,
    year,
  }: {
    day: string;
    month: string;
    year: string;
  }) => {
    const monthIndex = MONTHS.indexOf(month);

    const formattedMonth = String(monthIndex + 1).padStart(2, '0');
    const formattedDay = day.padStart(2, '0');
    const dateOfBirth = `${year}-${formattedMonth}-${formattedDay}`;

    return dateOfBirth;
  };

  const daysOptions = useMemo(
    () => getDaysInMonth(selected.month, selected.year),
    [selected.month, selected.year],
  );

  return {
    selected,
    daysOptions,
    months: MONTHS,
    years: YEARS,
    handleSelectDay,
    handleSelectMonth,
    handleSelectYear,
    formatDate,
  };
};

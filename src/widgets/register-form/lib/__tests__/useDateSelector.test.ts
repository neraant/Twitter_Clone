import { act, renderHook } from '@testing-library/react';

import { useDateSelector } from '../useDateSelector';

jest.mock('../../lib', () => ({
  getDaysInMonth: jest.fn(),
  MONTHS: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
}));

import { getDaysInMonth } from '../../lib';

describe('useDateSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getDaysInMonth as jest.Mock).mockReturnValue(['1', '2', '3', '4', '5']);
  });

  it('should initialize with empty selected values', () => {
    const { result } = renderHook(() => useDateSelector());

    expect(result.current.selected).toEqual({
      day: '',
      month: '',
      year: '',
    });
  });

  it('should handle day selection', () => {
    const { result } = renderHook(() => useDateSelector());

    act(() => {
      result.current.handleSelectDay('15');
    });

    expect(result.current.selected.day).toBe('15');
  });

  it('should handle month selection and reset day if invalid', () => {
    (getDaysInMonth as jest.Mock).mockReturnValue(['1', '2', '3']);

    const { result } = renderHook(() => useDateSelector());

    act(() => {
      result.current.handleSelectDay('15');
      result.current.handleSelectMonth('February');
    });

    expect(result.current.selected.month).toBe('February');
    expect(result.current.selected.day).toBe('');
  });

  it('should handle month selection and keep day if valid', () => {
    (getDaysInMonth as jest.Mock).mockReturnValue(['1', '2', '15', '20']);

    const { result } = renderHook(() => useDateSelector());

    act(() => {
      result.current.handleSelectDay('15');
      result.current.handleSelectMonth('February');
    });

    expect(result.current.selected.month).toBe('February');
    expect(result.current.selected.day).toBe('15');
  });

  it('should handle year selection and reset day if invalid', () => {
    (getDaysInMonth as jest.Mock).mockReturnValue(['1', '2', '3']);

    const { result } = renderHook(() => useDateSelector());

    act(() => {
      result.current.handleSelectDay('15');
      result.current.handleSelectYear('2020');
    });

    expect(result.current.selected.year).toBe('2020');
    expect(result.current.selected.day).toBe('');
  });

  it('should handle year selection and keep day if valid', () => {
    (getDaysInMonth as jest.Mock).mockReturnValue(['1', '2', '15', '20']);

    const { result } = renderHook(() => useDateSelector());

    act(() => {
      result.current.handleSelectDay('15');
      result.current.handleSelectYear('2020');
    });

    expect(result.current.selected.year).toBe('2020');
    expect(result.current.selected.day).toBe('15');
  });

  it('should format date correctly', () => {
    const { result } = renderHook(() => useDateSelector());

    const formattedDate = result.current.formatDate({
      day: '5',
      month: 'March',
      year: '2020',
    });

    expect(formattedDate).toBe('2020-03-05');
  });

  it('should format date with padding', () => {
    const { result } = renderHook(() => useDateSelector());

    const formattedDate = result.current.formatDate({
      day: '1',
      month: 'January',
      year: '2020',
    });

    expect(formattedDate).toBe('2020-01-01');
  });

  it('should return daysOptions from getDaysInMonth', () => {
    (getDaysInMonth as jest.Mock).mockReturnValue(['1', '2', '3', '15']);

    const { result } = renderHook(() => useDateSelector());

    expect(result.current.daysOptions).toEqual(['1', '2', '3', '15']);
    expect(getDaysInMonth).toHaveBeenCalledWith('', '');
  });

  it('should update daysOptions when month or year changes', () => {
    const { result } = renderHook(() => useDateSelector());

    act(() => {
      result.current.handleSelectMonth('February');
      result.current.handleSelectYear('2020');
    });

    expect(getDaysInMonth).toHaveBeenCalledWith('February', '2020');
  });
});

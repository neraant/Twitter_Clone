import { getDaysInMonth } from '../getDaysInMonth.utils';

jest.mock('../registerForm.constants', () => ({
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

describe('getDaysInMonth', () => {
  it('should return 31 days for invalid month', () => {
    const result = getDaysInMonth('InvalidMonth', '2023');

    expect(result).toHaveLength(31);
    expect(result[0]).toBe('1');
    expect(result[30]).toBe('31');
  });

  it('should return 31 days for invalid year', () => {
    const result = getDaysInMonth('January', 'invalidYear');

    expect(result).toHaveLength(31);
    expect(result[0]).toBe('1');
    expect(result[30]).toBe('31');
  });

  it('should return 31 days for January', () => {
    const result = getDaysInMonth('January', '2023');

    expect(result).toHaveLength(31);
    expect(result[0]).toBe('1');
    expect(result[30]).toBe('31');
  });

  it('should return 28 days for February in non-leap year', () => {
    const result = getDaysInMonth('February', '2023');

    expect(result).toHaveLength(28);
    expect(result[0]).toBe('1');
    expect(result[27]).toBe('28');
  });

  it('should return 29 days for February in leap year', () => {
    const result = getDaysInMonth('February', '2024');

    expect(result).toHaveLength(29);
    expect(result[0]).toBe('1');
    expect(result[28]).toBe('29');
  });

  it('should return 30 days for April', () => {
    const result = getDaysInMonth('April', '2023');

    expect(result).toHaveLength(30);
    expect(result[0]).toBe('1');
    expect(result[29]).toBe('30');
  });

  it('should return 30 days for June', () => {
    const result = getDaysInMonth('June', '2023');

    expect(result).toHaveLength(30);
    expect(result[0]).toBe('1');
    expect(result[29]).toBe('30');
  });

  it('should return 30 days for September', () => {
    const result = getDaysInMonth('September', '2023');

    expect(result).toHaveLength(30);
    expect(result[0]).toBe('1');
    expect(result[29]).toBe('30');
  });

  it('should return 30 days for November', () => {
    const result = getDaysInMonth('November', '2023');

    expect(result).toHaveLength(30);
    expect(result[0]).toBe('1');
    expect(result[29]).toBe('30');
  });

  it('should return 31 days for December', () => {
    const result = getDaysInMonth('December', '2023');

    expect(result).toHaveLength(31);
    expect(result[0]).toBe('1');
    expect(result[30]).toBe('31');
  });
});

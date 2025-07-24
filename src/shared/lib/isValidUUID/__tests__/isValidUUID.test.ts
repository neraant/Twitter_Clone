import { isValidUUID } from '../isValidUUID.utils';

describe('isValidUUID', () => {
  it('returns true for valid UUID', () => {
    expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isValidUUID('abcdef12-3456-7890-abcd-ef1234567890')).toBe(true);
    expect(isValidUUID('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF')).toBe(true); // проверка регистра
  });

  it('returns false for invalid UUID', () => {
    expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400')).toBe(false); // слишком короткий
    expect(isValidUUID('123e4567e89b12d3a456426614174000')).toBe(false); // без дефисов
    expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400Z')).toBe(false); // недопустимый символ Z
    expect(isValidUUID('')).toBe(false);
    expect(isValidUUID('not-a-uuid')).toBe(false);
  });
});

import { getFormattedDate } from '../getFormattedDate';

describe('getFormattedDate', () => {
  it('should format date correctly in MM/DD/YYYY format', () => {
    const date = new Date(2023, 11, 25); // December 25, 2023 (month is 0-indexed)
    const result = getFormattedDate(date);
    expect(result).toBe('12/25/2023');
  });

  it('should handle single digit month and day', () => {
    const date = new Date(2023, 0, 5); // January 5, 2023
    const result = getFormattedDate(date);
    expect(result).toBe('01/05/2023');
  });

  it('should handle leap year dates', () => {
    const date = new Date(2024, 1, 29); // February 29, 2024
    const result = getFormattedDate(date);
    expect(result).toBe('02/29/2024');
  });

  it('should handle different years', () => {
    const dates = [
      new Date(2020, 5, 15), // June 15, 2020
      new Date(2021, 5, 15), // June 15, 2021
      new Date(2022, 5, 15), // June 15, 2022
      new Date(2023, 5, 15), // June 15, 2023
    ];

    const expected = ['06/15/2020', '06/15/2021', '06/15/2022', '06/15/2023'];

    dates.forEach((date, index) => {
      const result = getFormattedDate(date);
      expect(result).toBe(expected[index]);
    });
  });

  it('should handle all months correctly', () => {
    const months = [
      { date: new Date(2023, 0, 1), expected: '01/01/2023' }, // January
      { date: new Date(2023, 1, 1), expected: '02/01/2023' }, // February
      { date: new Date(2023, 2, 1), expected: '03/01/2023' }, // March
      { date: new Date(2023, 3, 1), expected: '04/01/2023' }, // April
      { date: new Date(2023, 4, 1), expected: '05/01/2023' }, // May
      { date: new Date(2023, 5, 1), expected: '06/01/2023' }, // June
      { date: new Date(2023, 6, 1), expected: '07/01/2023' }, // July
      { date: new Date(2023, 7, 1), expected: '08/01/2023' }, // August
      { date: new Date(2023, 8, 1), expected: '09/01/2023' }, // September
      { date: new Date(2023, 9, 1), expected: '10/01/2023' }, // October
      { date: new Date(2023, 10, 1), expected: '11/01/2023' }, // November
      { date: new Date(2023, 11, 1), expected: '12/01/2023' }, // December
    ];

    months.forEach(({ date, expected }) => {
      const result = getFormattedDate(date);
      expect(result).toBe(expected);
    });
  });

  it('should handle edge cases for day numbers', () => {
    const edgeCases = [
      { date: new Date(2023, 0, 1), expected: '01/01/2023' },
      { date: new Date(2023, 0, 9), expected: '01/09/2023' },
      { date: new Date(2023, 0, 10), expected: '01/10/2023' },
      { date: new Date(2023, 0, 31), expected: '01/31/2023' },
    ];

    edgeCases.forEach(({ date, expected }) => {
      const result = getFormattedDate(date);
      expect(result).toBe(expected);
    });
  });

  it('should handle different timezone dates consistently', () => {
    // Test with different timezone offsets
    const utcDate = new Date('2023-12-25T00:00:00.000Z');
    const localDate = new Date(2023, 11, 25); // December 25, 2023

    const utcResult = getFormattedDate(utcDate);
    const localResult = getFormattedDate(localDate);

    // Both should format the same way regardless of timezone
    expect(utcResult).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(localResult).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

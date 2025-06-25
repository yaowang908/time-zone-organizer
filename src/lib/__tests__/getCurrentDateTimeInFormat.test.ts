import getCurrentDateTimeInFormat from '../getCurrentDateTimeInFormat';

describe('getCurrentDateTimeInFormat', () => {
  it('should return formatted date and time for default parameters', () => {
    const result = getCurrentDateTimeInFormat();

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
    expect(typeof result.date).toBe('string');
    expect(typeof result.time).toBe('string');
  });

  it('should return formatted date and time for custom timezone', () => {
    const result = getCurrentDateTimeInFormat('America/Los_Angeles');

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
    expect(typeof result.date).toBe('string');
    expect(typeof result.time).toBe('string');
  });

  it('should return formatted date and time for custom date', () => {
    const customDate = new Date('2023-06-15T10:00:00.000Z');
    const result = getCurrentDateTimeInFormat('America/New_York', customDate);

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
    expect(typeof result.date).toBe('string');
    expect(typeof result.time).toBe('string');
  });

  it('should handle different timezones correctly', () => {
    const timezones = [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];

    timezones.forEach((timezone) => {
      const result = getCurrentDateTimeInFormat(timezone);

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
      expect(typeof result.date).toBe('string');
      expect(typeof result.time).toBe('string');
    });
  });

  it('should handle epoch date (new Date(0))', () => {
    const epochDate = new Date(0);
    const result = getCurrentDateTimeInFormat('America/New_York', epochDate);

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
    expect(typeof result.date).toBe('string');
    expect(typeof result.time).toBe('string');
  });

  it('should format date in long format (e.g., "December 25, 2023")', () => {
    const result = getCurrentDateTimeInFormat();

    // Date should be in format "Month Day, Year"
    expect(result.date).toMatch(/^[A-Za-z]+ \d{1,2}, \d{4}$/);
  });

  it('should format time in 12-hour format with AM/PM', () => {
    const result = getCurrentDateTimeInFormat();

    // Time should be in format "HH:MM AM/PM"
    expect(result.time).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
  });

  it('should handle edge case dates', () => {
    const edgeDates = [
      new Date('2023-01-01T00:00:00.000Z'),
      new Date('2023-12-31T23:59:59.000Z'),
      new Date('2024-02-29T12:00:00.000Z'), // Leap year
    ];

    edgeDates.forEach((date) => {
      const result = getCurrentDateTimeInFormat('America/New_York', date);

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
      expect(typeof result.date).toBe('string');
      expect(typeof result.time).toBe('string');
    });
  });

  it('should return consistent format for same input', () => {
    const timezone = 'America/New_York';
    const date = new Date('2023-12-25T15:30:00.000Z');

    const result1 = getCurrentDateTimeInFormat(timezone, date);
    const result2 = getCurrentDateTimeInFormat(timezone, date);

    expect(result1).toEqual(result2);
  });
});

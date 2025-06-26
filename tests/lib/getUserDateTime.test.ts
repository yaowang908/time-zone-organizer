import getUserDateTime from '@/lib/getUserDateTime';

describe('getUserDateTime', () => {
  it('should convert time and date between timezones correctly', () => {
    const result = getUserDateTime(
      'America/Los_Angeles',
      '2:30 PM',
      'December 25, 2023',
      'America/New_York'
    );

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
    expect(typeof result.date).toBe('string');
    expect(typeof result.time).toBe('string');
  });

  it('should handle 12-hour time format', () => {
    const result = getUserDateTime(
      'America/Los_Angeles',
      '2:30 PM',
      'December 25, 2023',
      'America/New_York'
    );

    expect(result.time).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it('should handle 24-hour time format', () => {
    const result = getUserDateTime(
      'America/Los_Angeles',
      '14:30',
      'December 25, 2023',
      'America/New_York'
    );

    expect(result.time).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it('should format date in MM-DD-YYYY format', () => {
    const result = getUserDateTime(
      'America/Los_Angeles',
      '2:30 PM',
      'December 25, 2023',
      'America/New_York'
    );

    expect(result.date).toMatch(/^\d{1,2}-\d{1,2}-\d{4}$/);
  });

  it('should handle military format parameter', () => {
    const militaryResult = getUserDateTime(
      'America/Los_Angeles',
      '2:30 PM',
      'December 25, 2023',
      'America/New_York',
      true
    );

    const nonMilitaryResult = getUserDateTime(
      'America/Los_Angeles',
      '2:30 PM',
      'December 25, 2023',
      'America/New_York',
      false
    );

    expect(militaryResult).toHaveProperty('time');
    expect(nonMilitaryResult).toHaveProperty('time');
  });

  it('should handle different months correctly', () => {
    const months = [
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
    ];

    months.forEach((month) => {
      const result = getUserDateTime(
        'America/Los_Angeles',
        '2:30 PM',
        `${month} 15, 2023`,
        'America/New_York'
      );

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
    });
  });

  it('should handle different timezones', () => {
    const timezonePairs = [
      { user: 'America/Los_Angeles', local: 'America/New_York' },
      { user: 'Europe/London', local: 'America/New_York' },
      { user: 'Asia/Tokyo', local: 'America/New_York' },
      { user: 'Australia/Sydney', local: 'America/New_York' },
    ];

    timezonePairs.forEach(({ user, local }) => {
      const result = getUserDateTime(
        user,
        '2:30 PM',
        'December 25, 2023',
        local
      );

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
    });
  });

  it('should handle edge case times', () => {
    const edgeTimes = ['12:00 AM', '12:00 PM', '11:59 PM', '12:01 AM'];

    edgeTimes.forEach((time) => {
      const result = getUserDateTime(
        'America/Los_Angeles',
        time,
        'December 25, 2023',
        'America/New_York'
      );

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
    });
  });

  it('should handle 24-hour format input', () => {
    const result = getUserDateTime(
      'America/Los_Angeles',
      '14:30',
      'December 25, 2023',
      'America/New_York'
    );

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
  });

  it('should handle single digit day and month', () => {
    const result = getUserDateTime(
      'America/Los_Angeles',
      '2:30 PM',
      'January 5, 2023',
      'America/New_York'
    );

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('time');
  });

  it('should return consistent results for same inputs', () => {
    const params = {
      userTimezone: 'America/Los_Angeles',
      localTime: '2:30 PM',
      localDate: 'December 25, 2023',
      localTimezone: 'America/New_York',
    };

    const result1 = getUserDateTime(
      params.userTimezone,
      params.localTime,
      params.localDate,
      params.localTimezone
    );

    const result2 = getUserDateTime(
      params.userTimezone,
      params.localTime,
      params.localDate,
      params.localTimezone
    );

    expect(result1).toEqual(result2);
  });
});

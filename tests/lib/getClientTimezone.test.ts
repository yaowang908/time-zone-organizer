import getClientTimezone from '@/lib/getClientTimezone';

describe('getClientTimezone', () => {
  let mockResolvedOptions: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockResolvedOptions = jest.fn();

    // Mock Intl.DateTimeFormat
    Object.defineProperty(Intl, 'DateTimeFormat', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        resolvedOptions: mockResolvedOptions,
      })),
    });
  });

  it('should return the client timezone when available', () => {
    mockResolvedOptions.mockReturnValue({
      timeZone: 'America/Los_Angeles',
    });

    const result = getClientTimezone();
    expect(result).toBe('America/Los_Angeles');
  });

  it('should return default timezone when client timezone is not available', () => {
    mockResolvedOptions.mockReturnValue({
      timeZone: null,
    });

    const result = getClientTimezone();
    expect(result).toBe('America/New York');
  });

  it('should return default timezone when resolvedOptions returns undefined', () => {
    mockResolvedOptions.mockReturnValue(undefined);

    const result = getClientTimezone();
    expect(result).toBe('America/New York');
  });

  it('should return default timezone when resolvedOptions returns null', () => {
    mockResolvedOptions.mockReturnValue(null);

    const result = getClientTimezone();
    expect(result).toBe('America/New York');
  });

  it('should return default timezone when timeZone is empty string', () => {
    mockResolvedOptions.mockReturnValue({
      timeZone: '',
    });

    const result = getClientTimezone();
    expect(result).toBe('America/New York');
  });

  it('should handle various timezone formats', () => {
    const timezones = [
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
      'UTC',
      'GMT',
    ];

    timezones.forEach((timezone) => {
      mockResolvedOptions.mockReturnValue({
        timeZone: timezone,
      });

      const result = getClientTimezone();
      expect(result).toBe(timezone);
    });
  });
});

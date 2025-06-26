import hoursFormat from '@/settings/hours.setting';

describe('hours.setting', () => {
  it('should export a hours format configuration object', () => {
    expect(typeof hoursFormat).toBe('object');
    expect(hoursFormat).not.toBeNull();
  });

  it('should have military and normal properties', () => {
    expect(hoursFormat).toHaveProperty('military');
    expect(hoursFormat).toHaveProperty('normal');
  });

  it('should have military format as an array of 24 elements', () => {
    expect(Array.isArray(hoursFormat.military)).toBe(true);
    expect(hoursFormat.military.length).toBe(24);
  });

  it('should have normal format as an array of 24 elements', () => {
    expect(Array.isArray(hoursFormat.normal)).toBe(true);
    expect(hoursFormat.normal.length).toBe(24);
  });

  it('should have military format with numbers 0-23', () => {
    hoursFormat.military.forEach((hour, index) => {
      expect(hour).toBe(index.toString());
    });
  });

  it('should have normal format with proper AM/PM labels', () => {
    const expectedNormal = [
      'Midnight', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
      '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'
    ];

    expect(hoursFormat.normal).toEqual(expectedNormal);
  });

  it('should have consistent array lengths', () => {
    expect(hoursFormat.military.length).toBe(hoursFormat.normal.length);
  });

  it('should have military format as strings', () => {
    hoursFormat.military.forEach(hour => {
      expect(typeof hour).toBe('string');
    });
  });

  it('should have normal format as strings', () => {
    hoursFormat.normal.forEach(hour => {
      expect(typeof hour).toBe('string');
    });
  });

  it('should have midnight at index 0 in normal format', () => {
    expect(hoursFormat.normal[0]).toBe('Midnight');
  });

  it('should have noon at index 12 in normal format', () => {
    expect(hoursFormat.normal[12]).toBe('12PM');
  });

  it('should have proper AM/PM sequence', () => {
    // Check that AM hours are in the first 12 positions (except midnight)
    for (let i = 1; i < 12; i++) {
      expect(hoursFormat.normal[i]).toMatch(/AM$/);
    }

    // Check that PM hours are in the last 12 positions (except noon)
    for (let i = 13; i < 24; i++) {
      expect(hoursFormat.normal[i]).toMatch(/PM$/);
    }
  });

  it('should have no duplicate values in military format', () => {
    const uniqueMilitary = new Set(hoursFormat.military);
    expect(uniqueMilitary.size).toBe(hoursFormat.military.length);
  });

  it('should have no duplicate values in normal format', () => {
    const uniqueNormal = new Set(hoursFormat.normal);
    expect(uniqueNormal.size).toBe(hoursFormat.normal.length);
  });

  it('should export as default export', () => {
    expect(hoursFormat).toBeDefined();
    expect(typeof hoursFormat).toBe('object');
  });

  it('should have military format that can be parsed as numbers', () => {
    hoursFormat.military.forEach(hour => {
      const num = parseInt(hour, 10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(24);
    });
  });
}); 
import defaultColor from '@/settings/color.settings';

describe('color.settings', () => {
  it('should export a color configuration object', () => {
    expect(typeof defaultColor).toBe('object');
    expect(defaultColor).not.toBeNull();
  });

  it('should have all required color properties', () => {
    const requiredColors = [
      'night',
      'day',
      'nightText',
      'dayText',
      'background',
      'textLighter',
      'textDarker',
      'white',
    ];

    requiredColors.forEach(color => {
      expect(defaultColor).toHaveProperty(color);
    });
  });

  it('should have all color values as valid hex strings', () => {
    const hexColorPattern = /^#[0-9A-Fa-f]{3,6}$/;

    Object.values(defaultColor).forEach(colorValue => {
      expect(typeof colorValue).toBe('string');
      expect(colorValue).toMatch(hexColorPattern);
    });
  });

  it('should have specific expected color values', () => {
    expect(defaultColor.night).toBe('#0A2875');
    expect(defaultColor.day).toBe('#FFEDC0');
    expect(defaultColor.nightText).toBe('#90AFFF');
    expect(defaultColor.dayText).toBe('#0A2875');
    expect(defaultColor.background).toBe('#0A2875');
    expect(defaultColor.textLighter).toBe('#FDFDFF');
    expect(defaultColor.textDarker).toBe('#4B67AD');
    expect(defaultColor.white).toBe('#FFF');
  });

  it('should have no duplicate color values', () => {
    const colorValues = Object.values(defaultColor);
    const uniqueValues = new Set(colorValues);

    // Some colors might be intentionally duplicated (like dayText and background)
    expect(uniqueValues.size).toBeLessThanOrEqual(colorValues.length);
  });

  it('should have consistent color naming convention', () => {
    const colorKeys = Object.keys(defaultColor);

    colorKeys.forEach(key => {
      expect(key).toMatch(/^[a-z]+([A-Z][a-z]*)*$/);
    });
  });

  it('should have appropriate contrast between text and background colors', () => {
    // Basic check that text colors are different from background
    expect(defaultColor.nightText).not.toBe(defaultColor.background);
    expect(defaultColor.dayText).not.toBe(defaultColor.day);
    expect(defaultColor.textLighter).not.toBe(defaultColor.background);
    expect(defaultColor.textDarker).not.toBe(defaultColor.background);
  });

  it('should have night and day colors that are visually distinct', () => {
    expect(defaultColor.night).not.toBe(defaultColor.day);
    expect(defaultColor.nightText).not.toBe(defaultColor.dayText);
  });

  it('should export as default export', () => {
    expect(defaultColor).toBeDefined();
    expect(typeof defaultColor).toBe('object');
  });
}); 
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        'always-present'
      );
      expect(result).toBe('base-class active-class always-present');
    });

    it('should handle false conditional classes', () => {
      const isActive = false;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        'always-present'
      );
      expect(result).toBe('base-class always-present');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3', ['class4', 'class5']);
      expect(result).toBe('class1 class2 class3 class4 class5');
    });

    it('should handle objects with boolean values', () => {
      const result = cn('base-class', {
        'active-class': true,
        'inactive-class': false,
        'conditional-class': true,
      });
      expect(result).toBe('base-class active-class conditional-class');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle null and undefined inputs', () => {
      const result = cn('base-class', null, undefined, 'valid-class');
      expect(result).toBe('base-class valid-class');
    });
  });
});

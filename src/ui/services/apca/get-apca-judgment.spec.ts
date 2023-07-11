import { describe, expect, test } from 'vitest';

import { getLegibilityCategory } from './get-apca-judgment.ts';

describe('getLegibilityCategory', () => {
  test('should return "Okay for any text" for values >= 90', () => {
    expect(getLegibilityCategory(90)).toBe('Fluent Text');
    expect(getLegibilityCategory(100)).toBe('Fluent Text');
  });

  test('should return "Okay for body text" for values between 75 and 89', () => {
    expect(getLegibilityCategory(75)).toBe('Body Text');
    expect(getLegibilityCategory(89)).toBe('Body Text');
  });

  test('should return "Okay for content text" for values between 60 and 74', () => {
    expect(getLegibilityCategory(60)).toBe('Content Text');
    expect(getLegibilityCategory(74)).toBe('Content Text');
  });

  test('should return "Okay for headlines" for values between 45 and 59', () => {
    expect(getLegibilityCategory(45)).toBe('Large Text');
    expect(getLegibilityCategory(59)).toBe('Large Text');
  });

  test('should return "Min for any text" for values between 30 and 44', () => {
    expect(getLegibilityCategory(30)).toBe('Non-Text');
    expect(getLegibilityCategory(44)).toBe('Non-Text');
  });

  test('should return "Not readable" for values between 15 and 29', () => {
    expect(getLegibilityCategory(15)).toBe('Not Readable');
    expect(getLegibilityCategory(29)).toBe('Not Readable');
  });

  test('should return "Not legal" for values between 0 and 14', () => {
    expect(getLegibilityCategory(0)).toBe('Invisible');
    expect(getLegibilityCategory(14)).toBe('Invisible');
  });

  test('should return "Invalid fill" for negative values', () => {
    expect(getLegibilityCategory(-5)).toBe('Invalid Value');
    expect(getLegibilityCategory(-100)).toBe('Invalid Value');
  });
});

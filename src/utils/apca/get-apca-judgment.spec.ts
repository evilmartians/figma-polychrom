import { describe, expect, test } from 'vitest';

import { getLegibilityCategory } from './get-apca-judgment.ts';

describe('getLegibilityCategory', () => {
  test('should return "Okay for any text" for values >= 90', () => {
    expect(getLegibilityCategory(90)).toBe('Okay for any text');
    expect(getLegibilityCategory(100)).toBe('Okay for any text');
  });

  test('should return "Okay for body text" for values between 75 and 89', () => {
    expect(getLegibilityCategory(75)).toBe('Okay for body text');
    expect(getLegibilityCategory(89)).toBe('Okay for body text');
  });

  test('should return "Okay for content text" for values between 60 and 74', () => {
    expect(getLegibilityCategory(60)).toBe('Okay for content text');
    expect(getLegibilityCategory(74)).toBe('Okay for content text');
  });

  test('should return "Okay for headlines" for values between 45 and 59', () => {
    expect(getLegibilityCategory(45)).toBe('Okay for headlines');
    expect(getLegibilityCategory(59)).toBe('Okay for headlines');
  });

  test('should return "Min for any text" for values between 30 and 44', () => {
    expect(getLegibilityCategory(30)).toBe('Min for any text');
    expect(getLegibilityCategory(44)).toBe('Min for any text');
  });

  test('should return "Not readable" for values between 15 and 29', () => {
    expect(getLegibilityCategory(15)).toBe('Not readable');
    expect(getLegibilityCategory(29)).toBe('Not readable');
  });

  test('should return "Not legal" for values between 0 and 14', () => {
    expect(getLegibilityCategory(0)).toBe('Not legal');
    expect(getLegibilityCategory(14)).toBe('Not legal');
  });

  test('should return "Invalid value" for negative values', () => {
    expect(getLegibilityCategory(-5)).toBe('Invalid value');
    expect(getLegibilityCategory(-100)).toBe('Invalid value');
  });
});

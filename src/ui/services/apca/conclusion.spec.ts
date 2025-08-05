import { describe, expect, test } from 'vitest';

import { getConclusionByScore } from './conclusion.ts';

describe('getConclusionByScore', () => {
  test('should return "Okay for any text" for values >= 90', () => {
    expect(getConclusionByScore(90)).toBe('Fluent Text');
    expect(getConclusionByScore(100)).toBe('Fluent Text');
  });

  test('should return "Okay for body text" for values between 75 and 89', () => {
    expect(getConclusionByScore(75)).toBe('Body Text');
    expect(getConclusionByScore(89)).toBe('Body Text');
  });

  test('should return "Okay for content text" for values between 60 and 74', () => {
    expect(getConclusionByScore(60)).toBe('Content Text');
    expect(getConclusionByScore(74)).toBe('Content Text');
  });

  test('should return "Okay for headlines" for values between 45 and 59', () => {
    expect(getConclusionByScore(45)).toBe('Large Text');
    expect(getConclusionByScore(59)).toBe('Large Text');
  });

  test('should return "Min for any text" for values between 30 and 44', () => {
    expect(getConclusionByScore(30)).toBe('Non-Text');
    expect(getConclusionByScore(44)).toBe('Non-Text');
  });

  test('should return "Not readable" for values between 15 and 29', () => {
    expect(getConclusionByScore(15)).toBe('Not Readable');
    expect(getConclusionByScore(29)).toBe('Not Readable');
  });

  test('should return "Invisible" for values between 0 and 14', () => {
    expect(getConclusionByScore(0)).toBe('Invisible');
    expect(getConclusionByScore(14)).toBe('Invisible');
  });

  test('should return "Invalid fill" for negative values', () => {
    expect(getConclusionByScore(-5)).toBe('Invalid Value');
    expect(getConclusionByScore(-100)).toBe('Invalid Value');
  });
});

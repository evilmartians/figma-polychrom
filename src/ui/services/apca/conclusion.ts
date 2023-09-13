export const conclusions = {
  'Fluent Text': 90,
  // eslint-disable-next-line perfectionist/sort-objects
  'Body Text': 75,
  'Content Text': 60,
  'Large Text': 45,
  'Non-Text': 30,
  'Not Readable': 15,
  // eslint-disable-next-line perfectionist/sort-objects
  Invisible: 0,
};

export const getConclusionByScore = (value: number): string => {
  const entries = Object.entries(conclusions);

  for (const [conclusion, conclusionValue] of entries) {
    if (value >= conclusionValue) {
      return conclusion;
    }
  }

  return 'Invalid Value';
};

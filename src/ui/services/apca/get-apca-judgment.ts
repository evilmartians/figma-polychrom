interface JudgmentCategory {
  lowerLimit: number;
  message: string;
}

const legibilityMap: JudgmentCategory[] = [
  { lowerLimit: 90, message: 'Fluent Text' },
  { lowerLimit: 75, message: 'Body Text' },
  { lowerLimit: 60, message: 'Content Text' },
  { lowerLimit: 45, message: 'Large Text' },
  { lowerLimit: 30, message: 'Non-Text' },
  { lowerLimit: 15, message: 'Not Readable' },
  { lowerLimit: 0, message: 'Invisible' },
];

export const getLegibilityCategory = (value: number): string => {
  for (const category of legibilityMap) {
    if (value >= category.lowerLimit) {
      return category.message;
    }
  }

  return 'Invalid Value';
};

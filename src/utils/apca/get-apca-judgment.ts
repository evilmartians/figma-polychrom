interface JudgmentCategory {
  lowerLimit: number;
  message: string;
}

const legibilityMap: JudgmentCategory[] = [
  { lowerLimit: 90, message: 'Okay for any text' },
  { lowerLimit: 75, message: 'Okay for body text' },
  { lowerLimit: 60, message: 'Okay for content text' },
  { lowerLimit: 45, message: 'Okay for headlines' },
  { lowerLimit: 30, message: 'Min for any text' },
  { lowerLimit: 15, message: 'Not readable' },
  { lowerLimit: 0, message: 'Not legal' },
];

export const getLegibilityCategory = (value: number): string => {
  for (const category of legibilityMap) {
    if (value >= category.lowerLimit) {
      return category.message;
    }
  }

  return 'Invalid value';
};

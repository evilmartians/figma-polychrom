import { type UIColor } from '~types/common.ts';
import { formatColorForTheme } from '~ui/components/ThemeVariablesProvider.tsx';
import { type ReactElement } from 'react';

interface Props {
  currentStyleNumber: number;
  id: string;
  primaryColor: UIColor;
  secondaryColor: UIColor;
}

export const SegmentedFontStyleDefinition = ({
  currentStyleNumber,
  id,
  primaryColor,
  secondaryColor,
}: Props): ReactElement => {
  const formattedCurrentStyleNumber = currentStyleNumber.toLocaleString(
    'en-US',
    {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }
  );

  const primaryFormatted = formatColorForTheme(primaryColor);
  const secondaryFormatted = formatColorForTheme(secondaryColor, 0.12);

  return (
    <style>
      {`
        @font-palette-values --segmented-${id} {
          font-family: Segmented;
          override-colors: 0 ${primaryFormatted}, 1 ${secondaryFormatted};
        }

        .segmented-${id} {
          font-family: Segmented;
          font-palette: --segmented-${id};
          font-feature-settings: 'ss${formattedCurrentStyleNumber}' on;
          font-variation-settings: 'wght' 600, 'wdth' 100, 'slnt' 5;
        }
      `}
    </style>
  );
};

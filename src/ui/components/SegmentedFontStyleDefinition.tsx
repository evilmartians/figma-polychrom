import { type ReactElement } from 'react';

interface Props {
  currentStyleNumber: number;
  id: string;
  primaryColor: string;
  secondaryColor: string;
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

  return (
    <style>
      {`
        @font-palette-values --segmented-${id} {
          font-family: Segmented;
          override-colors: 0 ${primaryColor}, 1 ${secondaryColor}1F;
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

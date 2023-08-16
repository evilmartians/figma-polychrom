import { type ReactElement } from 'react';

interface Props {
  id: string;
  primaryColor: string;
  secondaryColor: string;
}

export const SegmentedFontStyleDefinition = ({
  id,
  primaryColor,
  secondaryColor,
}: Props): ReactElement => {
  return (
    <style>
      {`
        @font-palette-values --segmented-${id} {
          font-family: Segmented;
          override-colors: 0 ${primaryColor}, 1 ${secondaryColor};
        }
        
        .segmented-${id} {
          font-family: Segmented;
          font-palette: --segmented-${id};
          font-feature-settings: 'ss01' on;
          font-variation-settings: 'wght' 600, 'wdth' 100, 'slnt' 5;
        }
      `}
    </style>
  );
};

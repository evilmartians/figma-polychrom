import { type UIColor } from '~types/common.ts';
import { formatColorForTheme } from '~ui/components/ThemeVariablesProvider.tsx';
import { createMemo, type JSX } from 'solid-js';

interface Props {
  currentStyleNumber: number;
  id: string;
  primaryColor: UIColor;
  secondaryColor: UIColor;
}

export const SegmentedFontStyleDefinition = (props: Props): JSX.Element => {
  const formattedCurrentStyleNumber = createMemo(() =>
    props.currentStyleNumber.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  );

  const primaryFormatted = createMemo(() => formatColorForTheme(props.primaryColor));
  const secondaryFormatted = createMemo(() => formatColorForTheme(props.secondaryColor, 0.12));

  return (
    <style>
      {`
        @font-palette-values --segmented-${props.id} {
          font-family: Segmented;
          override-colors: 0 ${primaryFormatted()}, 1 ${secondaryFormatted()};
        }

        .segmented-${props.id} {
          font-family: Segmented;
          font-palette: --segmented-${props.id};
          font-feature-settings: 'ss${formattedCurrentStyleNumber()}' on;
          font-variation-settings: 'wght' 600, 'wdth' 100, 'slnt' 5;
        }
      `}
    </style>
  );
};

import { CantCalculateMessage } from '~ui/components/infoMessages/CantCalculateMessage.tsx';
import {
  ThemeVariablesKeys,
  ThemeVariablesProvider,
} from '~ui/components/ThemeVariablesProvider.tsx';
import { type ContrastConclusion } from '~ui/types';
import { isEmpty } from '~utils/not-empty.ts';
import { createMemo, createSignal, type JSX, Show } from 'solid-js';

import { generateUIColors } from '../services/theme/generate-ui-colors.ts';
import { SegmentedFontStyleDefinition } from './SegmentedFontStyleDefinition.tsx';
import { SelectionContent } from './SelectionContent.tsx';

interface Props {
  id: string;
  isLast?: boolean;
  size: 'large' | 'small';
  userSelection: ContrastConclusion;
}

const SEGMENTED_FONT_STYLES = {
  INITIAL: 1,
  MAX: 2,
};

export const Selection = (props: Props): JSX.Element => {
  const [currentStyleNumber, setCurrentStyleNumber] = createSignal(
    SEGMENTED_FONT_STYLES.INITIAL,
  );

  const handleCurrentStyleNumberChange = (): void => {
    const newStyleNumber = currentStyleNumber() + 1;
    if (newStyleNumber > SEGMENTED_FONT_STYLES.MAX) {
      setCurrentStyleNumber(SEGMENTED_FONT_STYLES.INITIAL);
    } else {
      setCurrentStyleNumber(newStyleNumber);
    }
  };

  const uiColors = createMemo(() => {
    const { apca, bg, fg } = props.userSelection;
    if (isEmpty(fg) || isEmpty(bg) || isEmpty(apca)) return undefined;

    return generateUIColors(
      { hex: fg.hex, oklch: fg.oklch },
      { hex: bg.hex, oklch: bg.oklch }
    );
  });

  return (
    <Show
      fallback={<CantCalculateMessage />}
      when={() => !isEmpty(props.userSelection.apca) && !isEmpty(uiColors())}
    >
        <ThemeVariablesProvider theme={uiColors()!.theme}>
        <div
          classList={{
            'p-5': props.size === 'large',
            'px-5 pb-8 pt-2': props.size === 'small' && props.isLast === false,
            'px-5 py-3': props.size === 'small' && props.isLast === true,
            'rounded-2.5xl': true,
            'w-full': true,
          }}
          style={{ 'background-color': `var(${ThemeVariablesKeys.bg})` }}
        >
          <SegmentedFontStyleDefinition
            currentStyleNumber={currentStyleNumber()}
            id={props.id}
            primaryColor={uiColors()!.theme.fg}
            secondaryColor={uiColors()!.theme.secondary}
          />

          <SelectionContent
            apca={props.userSelection.apca}
            bg={props.userSelection.bg}
            fg={props.userSelection.fg}
            id={props.id}
            isLast={props.isLast}
            onApcaDoubleClick={handleCurrentStyleNumberChange}
            size={props.size}
          />
        </div>
      </ThemeVariablesProvider>
    </Show>
  );
};

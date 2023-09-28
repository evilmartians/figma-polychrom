import { isEmpty } from '~utils/not-empty.ts';
import clsx from 'clsx';
import { type Oklch } from 'culori/fn';
import { nanoid } from 'nanoid';
import { type ReactElement } from 'react';

import { generateUIColors } from '../services/theme/generate-ui-colors.ts';
import { SegmentedFontStyleDefinition } from './SegmentedFontStyleDefinition.tsx';
import { SelectionContent } from './SelectionContent.tsx';

const CantCalculateMessage = (): ReactElement => (
  <p className="mx-auto mb-4 flex select-none items-end justify-center py-4 text-center font-martianMono text-xxs text-secondary-75">
    Can&apos;t calc
  </p>
);

interface Props {
  isLast?: boolean;
  size: 'large' | 'small';
  userSelection: {
    apca: number;
    bg: { hex: string; oklch: Oklch };
    fg: { hex: string; oklch: Oklch };
  };
}

export const Selection = ({
  isLast,
  size,
  userSelection: { apca, bg, fg },
}: Props): ReactElement => {
  if (isEmpty(apca)) {
    return <CantCalculateMessage />;
  }

  const uiColors = generateUIColors(
    { hex: fg.hex, oklch: fg.oklch },
    { hex: bg.hex, oklch: bg.oklch }
  );

  if (isEmpty(uiColors)) {
    return <CantCalculateMessage />;
  }

  const id = nanoid();

  return (
    <div
      className={clsx(
        'w-full rounded-2.5xl',
        size === 'small' && isLast === false && 'px-5 pb-8 pt-2',
        size === 'small' && isLast === true && 'px-5 py-3',
        size === 'large' && 'p-5'
      )}
      style={{ backgroundColor: uiColors.theme.bg.hex }}
    >
      <SegmentedFontStyleDefinition
        id={id}
        primaryColor={uiColors.theme.fg.hex}
        secondaryColor={uiColors.theme.secondary.hex}
      />

      <SelectionContent
        apca={apca}
        bg={bg}
        fg={fg}
        id={id}
        isLast={isLast}
        size={size}
        uiColors={uiColors}
      />
    </div>
  );
};

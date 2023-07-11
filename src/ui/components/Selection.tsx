import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { type ReactElement } from 'react';

import { type SelectedNodes } from '../../types/selection.ts';
import { generateUIColors } from '../services/theme/generate-ui-colors.ts';
import { SegmentedFontStyleDefinition } from './SegmentedFontStyleDefinition.tsx';
import { SelectionContent } from './SelectionContent.tsx';

const CantCalculateMessage = (): ReactElement => (
  <p className="my-4">Can&apos;t calc</p>
);

interface Props {
  isLast?: boolean;
  size: 'large' | 'small';
  userSelection: SelectedNodes;
}

export const Selection = ({
  isLast,
  size,
  userSelection: { apca, bgNode, selectedNode },
}: Props): ReactElement => {
  if (apca == null) {
    return <CantCalculateMessage />;
  }

  const bgNodeFill = bgNode?.fills[0];
  const selectedNodeFill = selectedNode?.fills[0];
  const uiColors = generateUIColors(selectedNodeFill, bgNodeFill);

  if (uiColors == null) {
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
      style={{ backgroundColor: uiColors.theme.background.hex }}
    >
      <SegmentedFontStyleDefinition
        id={id}
        primaryColor={uiColors.theme.foreground.hex}
        secondaryColor={uiColors.theme.secondary.hex}
      />

      <SelectionContent
        apca={apca}
        bgNodeFill={bgNodeFill}
        id={id}
        isLast={isLast}
        selectedNodeFill={selectedNodeFill}
        size={size}
        uiColors={uiColors}
      />
    </div>
  );
};

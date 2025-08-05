import { useStore } from '@nanostores/react';
import { EmptySelectionMessage } from '~ui/components/EmptySelectionMessage.tsx';
import { InvalidBackgroundSelectionMessage } from '~ui/components/InvalidBackgroundSelectionMessage.tsx';
import { Selection } from '~ui/components/Selection.tsx';
import { SelectionsList } from '~ui/components/SelectionsList.tsx';
import { UnprocessedBlendModesSelectionMessage } from '~ui/components/UnprocessedBlendModesSelectionMessage.tsx';
import {
  $contrastConclusion,
  $isEmptySelection,
  $isInvalidBackground,
  $isMultiSelection,
  $isUnprocessedBlendModes,
} from '~ui/stores/selected-nodes.ts';
import { isEmpty } from '~utils/not-empty.ts';
import { type ReactElement } from 'react';

export const AppContent = (): ReactElement => {
  const isInvalidBackground = useStore($isInvalidBackground);
  const isEmptySelection = useStore($isEmptySelection);
  const isMultiSelection = useStore($isMultiSelection);
  const isUnprocessedBlendModes = useStore($isUnprocessedBlendModes);
  const contrastConclusion = useStore($contrastConclusion);

  if (isInvalidBackground) {
    return <InvalidBackgroundSelectionMessage />;
  }

  if (isUnprocessedBlendModes) {
    return <UnprocessedBlendModesSelectionMessage />;
  }

  if (isEmptySelection) {
    return <EmptySelectionMessage />;
  }

  if (isEmpty(contrastConclusion)) {
    return <EmptySelectionMessage />;
  }

  if (isMultiSelection) {
    return <SelectionsList contrastConclusion={contrastConclusion} />;
  } else {
    const pair = contrastConclusion[0];

    if (isEmpty(pair)) {
      return <EmptySelectionMessage />;
    }

    return <Selection id={pair.id} isLast size="large" userSelection={pair} />;
  }
};

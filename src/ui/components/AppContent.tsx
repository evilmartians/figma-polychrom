import { useStore } from '@nanostores/react';
import { EmptySelectionMessage } from '~ui/components/EmptySelectionMessage.tsx';
import { InvalidBackgroundSelectionMessage } from '~ui/components/InvalidBackgroundSelectionMessage.tsx';
import { SelectionsList } from '~ui/components/SelectionsList.tsx';
import {
  $contrastConclusion,
  $isEmptySelection,
  $isInvalidBackground,
} from '~ui/stores/selected-nodes.ts';
import { isEmpty } from '~utils/not-empty.ts';
import { type ReactElement } from 'react';

export const AppContent = (): ReactElement => {
  const isInvalidBackground = useStore($isInvalidBackground);
  const isEmptySelection = useStore($isEmptySelection);
  const contrastConclusion = useStore($contrastConclusion);

  if (isInvalidBackground) {
    return <InvalidBackgroundSelectionMessage />;
  }

  if (isEmpty(contrastConclusion)) {
    return <div />;
  }

  if (isEmptySelection) {
    return <EmptySelectionMessage />;
  }

  return <SelectionsList contrastConclusion={contrastConclusion} />;
};

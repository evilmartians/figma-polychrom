import { useStore } from '@nanostores/solid';
import { EmptySelectionMessage } from '~ui/components/infoMessages/EmptySelectionMessage';
import { InvalidBackgroundSelectionMessage } from '~ui/components/infoMessages/InvalidBackgroundSelectionMessage';
import { UnprocessedBlendModesSelectionMessage } from '~ui/components/infoMessages/UnprocessedBlendModesSelectionMessage';
import { Selection } from '~ui/components/Selection';
import { SelectionsList } from '~ui/components/SelectionsList';
import {
  $contrastConclusion,
  $isEmptySelection,
  $isInvalidBackground,
  $isMultiSelection,
  $isSingleSelection,
  $isUnprocessedBlendModes,
} from '~ui/stores/selected-nodes';
import { isEmpty } from '~utils/not-empty.ts';
import { createMemo, type JSX, Match, Show, Switch } from 'solid-js';

export const AppContent = (): JSX.Element => {
  const isInvalidBackground = useStore($isInvalidBackground);
  const isUnprocessedBlendModes = useStore($isUnprocessedBlendModes);
  const isMultiSelection = useStore($isMultiSelection);
  const isSingleSelection = useStore($isSingleSelection);
  const isEmptySelection = useStore($isEmptySelection);
  const contrastConclusion = useStore($contrastConclusion);

  const pair = createMemo(() => contrastConclusion()[0]);

  return (
    <Switch>
      <Match when={isInvalidBackground()}>
        <InvalidBackgroundSelectionMessage />
      </Match>
      <Match when={isUnprocessedBlendModes()}>
        <UnprocessedBlendModesSelectionMessage />
      </Match>
      <Match when={isMultiSelection()}>
        <SelectionsList contrastConclusion={contrastConclusion()} />
      </Match>
      <Match when={isSingleSelection()}>
        <Show fallback={<EmptySelectionMessage />} when={!isEmpty(pair())}>
          <Selection
            id={pair()!.id}
            isLast
            size="large"
            userSelection={pair()!}
          />
        </Show>
      </Match>
      <Match when={isEmptySelection()}>
        <EmptySelectionMessage />
      </Match>
    </Switch>
  );
};

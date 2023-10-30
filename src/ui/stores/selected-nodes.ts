import {
  type Message,
  MessageTypes,
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { conclusions } from '~ui/services/apca/conclusion.ts';
import {
  type ContrastConclusionList,
  renderAndBlendColors,
} from '~ui/services/colors/render-and-blend-colors.ts';
import { isEmpty } from '~utils/not-empty.ts';
import { atom, computed, map, onMount, onSet } from 'nanostores';

export const $userSelection = atom<SelectionChangeEvent>({
  colorSpace: 'SRGB',
  selectedNodePairs: [],
});

export const $contrastConclusion = computed($userSelection, (selection) => {
  if ('selectedNodePairs' in selection) {
    return renderAndBlendColors(
      selection.selectedNodePairs,
      selection.colorSpace
    );
  }
});

export const $isP3 = computed($userSelection, (selection) => {
  return 'colorSpace' in selection
    ? selection.colorSpace === 'DISPLAY_P3'
    : false;
});

export const $isMultiSelection = computed($userSelection, (selection) => {
  return 'selectedNodePairs' in selection
    ? selection.selectedNodePairs.length > 1
    : false;
});

export const $isInvalidBackground = computed($userSelection, (selection) => {
  return (
    'text' in selection &&
    selection.text === SelectionMessageTypes.invalidBackground
  );
});

export const $isUnprocessedBlendModes = computed(
  $userSelection,
  (selection) => {
    return (
      'text' in selection &&
      selection.text === SelectionMessageTypes.unprocessedBlendModes
    );
  }
);

export const $isEmptySelection = computed(
  $contrastConclusion,
  (selection) => selection?.length === 0
);

onMount($userSelection, () => {
  const addMessageListener = (
    event: MessageEvent<Message<SelectionChangeEvent>>
  ): void => {
    if (event.data?.pluginMessage.type === MessageTypes.SelectionChange) {
      $userSelection.set(event.data.pluginMessage.payload);
    }
  };

  window.addEventListener('message', addMessageListener);

  return () => {
    window.removeEventListener('message', addMessageListener);
  };
});

onSet($contrastConclusion, ({ newValue }) => {
  if (isEmpty(newValue)) return;

  setRewardAnimationLaunch(newValue);
});

export const $rewardAnimationLaunch = map<{
  bodyText: boolean | null;
  contentText: boolean | null;
  fluentText: boolean | null;
}>({
  bodyText: null,
  contentText: null,
  fluentText: null,
});

const setRewardAnimationLaunch = (
  contrastConclusionList: ContrastConclusionList
): void => {
  const prevId = $contrastConclusion.get()?.[0]?.id;
  const newId = contrastConclusionList?.[0]?.id;
  const prevApca = $contrastConclusion.get()?.[0]?.apca;
  const newApca = contrastConclusionList?.[0]?.apca;

  if (isEmpty(newId) || isEmpty(prevId) || newId !== prevId) return;
  if (isEmpty(newApca) || isEmpty(prevApca)) return;

  const formattedPrevApca = Math.abs(prevApca);
  const formattedNewApca = Math.abs(newApca);

  if (
    formattedPrevApca < conclusions['Content Text'] &&
    formattedNewApca >= conclusions['Content Text']
  ) {
    $rewardAnimationLaunch.setKey('contentText', true);

    setTimeout(() => {
      $rewardAnimationLaunch.setKey('contentText', null);
    }, 1000);
  }

  if (
    formattedPrevApca < conclusions['Body Text'] &&
    formattedNewApca >= conclusions['Body Text']
  ) {
    $rewardAnimationLaunch.setKey('bodyText', true);

    setTimeout(() => {
      $rewardAnimationLaunch.setKey('bodyText', null);
    }, 1000);
  }

  if (
    formattedPrevApca < conclusions['Fluent Text'] &&
    formattedNewApca >= conclusions['Fluent Text']
  ) {
    $rewardAnimationLaunch.setKey('fluentText', true);

    setTimeout(() => {
      $rewardAnimationLaunch.setKey('fluentText', null);
    }, 1000);
  }
};

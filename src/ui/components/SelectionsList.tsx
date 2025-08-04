import { Selection } from '~ui/components/Selection.tsx';
import { type ContrastConclusionList } from '~ui/services/blend/blend-colors.ts';
import { For, type JSX } from 'solid-js';

interface Props {
  contrastConclusion: ContrastConclusionList;
}

export const SelectionsList = (props: Props): JSX.Element => {
  return (
    <ul class="mb-3 w-full">
      <For each={props.contrastConclusion}>
        {(pair, index) => (
          <li
            class={`${index() !== 0 ? '-mt-6' : ''} flex w-full items-center justify-center`}
          >
            <Selection
              id={pair.id}
              isLast={index() === props.contrastConclusion.length - 1}
              size="small"
              userSelection={pair}
            />
          </li>
        )}
      </For>
    </ul>
  )
};

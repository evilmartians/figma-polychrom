import { useStore } from '@nanostores/react';
import { Selection } from '~ui/components/Selection.tsx';
import {
  $isMultiSelection,
  $userSelection,
} from '~ui/stores/selected-nodes.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

export const SelectionsList = (): ReactElement => {
  const userSelection = useStore($userSelection);
  const isMultiSelection = useStore($isMultiSelection);

  return (
    <ul className={clsx('w-full', isMultiSelection ? 'mb-4' : '')}>
      {userSelection.selectedNodePairs.map((pair, index) => (
        <li
          className={clsx(
            'flex w-full items-center justify-center',
            isMultiSelection && index !== 0 ? '-mt-6' : ''
          )}
          key={pair.id}
        >
          <Selection
            isLast={index === userSelection.selectedNodePairs.length - 1}
            size={isMultiSelection ? 'small' : 'large'}
            userSelection={pair}
          />
        </li>
      ))}
    </ul>
  );
};

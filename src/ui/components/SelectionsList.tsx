import { useStore } from '@nanostores/react';
import { Selection } from '~ui/components/Selection.tsx';
import {
  $isMultiSelection,
  $processedUserSelection,
} from '~ui/stores/selected-nodes.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

export const SelectionsList = (): ReactElement => {
  const processedUserSelection = useStore($processedUserSelection);
  const isMultiSelection = useStore($isMultiSelection);

  return (
    <ul className={clsx('w-full', isMultiSelection ? 'mb-4' : '')}>
      {processedUserSelection.map((pair, index) => (
        <li
          className={clsx(
            'flex w-full items-center justify-center',
            isMultiSelection && index !== 0 ? '-mt-6' : ''
          )}
          key={pair.id}
        >
          <Selection
            id={pair.id}
            isLast={index === processedUserSelection.length - 1}
            size={isMultiSelection ? 'small' : 'large'}
            userSelection={pair}
          />
        </li>
      ))}
    </ul>
  );
};

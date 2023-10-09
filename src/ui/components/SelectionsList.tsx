import { useStore } from '@nanostores/react';
import { Selection } from '~ui/components/Selection.tsx';
import { type ContrastConclusion } from '~ui/services/colors/render-and-blend-colors.ts';
import { $isMultiSelection } from '~ui/stores/selected-nodes.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

interface Props {
  contrastConclusion: ContrastConclusion;
}

export const SelectionsList = ({ contrastConclusion }: Props): ReactElement => {
  const isMultiSelection = useStore($isMultiSelection);

  return (
    <ul className={clsx('w-full', isMultiSelection ? 'mb-4' : '')}>
      {contrastConclusion.map((pair, index) => (
        <li
          className={clsx(
            'flex w-full items-center justify-center',
            isMultiSelection && index !== 0 ? '-mt-6' : ''
          )}
          key={pair.id}
        >
          <Selection
            id={pair.id}
            isLast={index === contrastConclusion.length - 1}
            size={isMultiSelection ? 'small' : 'large'}
            userSelection={pair}
          />
        </li>
      ))}
    </ul>
  );
};

import { Selection } from '~ui/components/Selection.tsx';
import { type ContrastConclusionList } from '~ui/services/blend/blend-colors.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

interface Props {
  contrastConclusion: ContrastConclusionList;
}

export const SelectionsList = ({ contrastConclusion }: Props): ReactElement => {
  return (
    <ul className="mb-3 w-full">
      {contrastConclusion?.map((pair, index) => (
        <li
          className={clsx(
            'flex w-full items-center justify-center',
            index !== 0 ? '-mt-6' : ''
          )}
          key={pair.id}
        >
          <Selection
            id={pair.id}
            isLast={index === contrastConclusion.length - 1}
            size="small"
            userSelection={pair}
          />
        </li>
      ))}
    </ul>
  );
};

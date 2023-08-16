import { useStore } from '@nanostores/react';
import React from 'react';

import { $userSelection } from '../stores/selected-nodes';
import { Lurkers } from './Lurkers';
import { Selection } from './Selection';

export const Home: React.FC = () => {
  const userSelection = useStore($userSelection);

  if (userSelection.selectedNodes.length === 0) {
    return (
      <p className="flex h-screen select-none items-center justify-center font-martian dark:text-white">
        Select something
      </p>
    );
  }

  const isMultipleSelection =
    userSelection.selectedNodesAndTheirBackgrounds.length > 1;

  return (
    <div className="flex h-full w-full flex-col items-center p-2 pb-0 font-martian">
      <ul className="mb-2 w-full">
        {userSelection.selectedNodesAndTheirBackgrounds.map((pair) => (
          <li
            className="mb-2 flex w-full items-center justify-center last:mb-0"
            key={pair.selectedNode.id}
          >
            <Selection
              size={isMultipleSelection ? 'small' : 'large'}
              userSelection={pair}
            />
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Lurkers />
      </div>
    </div>
  );
};

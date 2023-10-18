import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { type ReactElement } from 'react';

export const StopIcon = (): ReactElement => {
  return (
    <svg fill="none" height="17" width="16" xmlns="http://www.w3.org/2000/svg">
      <style>{''}</style>
      <path
        clipRule="evenodd"
        d="M15 8c0 3.866-3.134 7-7 7-1.75304 0-3.35557-.6444-4.58363-1.7093l9.87433-9.87433C14.3556 4.64443 15 6.24696 15 8ZM2.70926 12.5836l9.87434-9.87434C11.3556 1.64441 9.75304 1 8 1 4.13401 1 1 4.13401 1 8c0 1.75304.64441 3.3556 1.70926 4.5836ZM16 8c0 4.4183-3.5817 8-8 8-4.41828 0-8-3.5817-8-8 0-4.41828 3.58172-8 8-8 4.4183 0 8 3.58172 8 8Z"
        fill={`var(${ThemeVariablesKeys.fg})`}
        fillRule="evenodd"
      />
    </svg>
  );
};

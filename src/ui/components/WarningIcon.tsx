import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { type ReactElement } from 'react';

export const WarningIcon = (): ReactElement => {
  return (
    <svg fill="none" height="17" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="m8.433 2 6.4952 11.25c.1924.3333-.0481.75-.433.75H1.5048c-.3849 0-.625462-.4167-.43301-.75L7.56698 2c.19245-.33333.67357-.33333.86602 0Zm-1.73205-.5c.57735-1 2.02073-1 2.59808 0l6.49517 11.25c.5774 1-.1443 2.25-1.299 2.25H1.5048C.3501 15-.371587 13.75.205763 12.75L6.70095 1.5ZM7.29999 5h1.4l-.2 4.5h-1l-.2-4.5Zm1.7 6.5c0 .5523-.44771 1-1 1-.55228 0-1-.4477-1-1s.44772-1 1-1c.55229 0 1 .4477 1 1Z"
        fill={`var(${ThemeVariablesKeys.fg})`}
        fillRule="evenodd"
      />
    </svg>
  );
};

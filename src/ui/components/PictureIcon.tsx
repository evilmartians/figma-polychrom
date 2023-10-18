import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { type ReactElement } from 'react';

export const PictureIcon = (): ReactElement => {
  return (
    <svg fill="none" height="17" width="14" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M12 1H2c-.55228 0-1 .44772-1 1v6.29289l3.14645-3.14644L4.5 4.79289l.35355.35356 7.69185 7.69185C12.8191 12.6599 13 12.3511 13 12V2c0-.55228-.4477-1-1-1ZM1 12V9.70711l3.5-3.5L11.2929 13H2c-.55228 0-1-.4477-1-1ZM2 0C.895431 0 0 .89543 0 2v10c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2V2c0-1.104569-.8954-2-2-2H2Zm9 4.5c0 .82843-.6716 1.5-1.5 1.5C8.67157 6 8 5.32843 8 4.5S8.67157 3 9.5 3c.8284 0 1.5.67157 1.5 1.5Zm1 0C12 5.88071 10.8807 7 9.5 7 8.11929 7 7 5.88071 7 4.5S8.11929 2 9.5 2C10.8807 2 12 3.11929 12 4.5Z"
        fill={`var(${ThemeVariablesKeys.fg})`}
        fillRule="evenodd"
      />
    </svg>
  );
};

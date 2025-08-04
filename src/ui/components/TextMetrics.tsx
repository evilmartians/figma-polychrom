import { PictureIcon } from '~ui/components/dynamicIcons/PictureIcon.tsx';
import { StopIcon } from '~ui/components/dynamicIcons/StopIcon.tsx';
import { WarningIcon } from '~ui/components/dynamicIcons/WarningIcon.tsx';
import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { conclusions } from '~ui/services/apca/conclusion.ts';
import { fontLookupAPCA } from 'apca-w3';
import { createMemo, type JSX, Match, Switch } from 'solid-js';

interface Props {
  apca: number;
}

export const TextMetrics = (props: Props): JSX.Element => {
  const fontSizes = createMemo(() => {
    const [, , , , reg, , , bol] = fontLookupAPCA(props.apca);
    return { bold: bol, regular: reg };
  });

  return (
    <Switch fallback={
      <div
        class="flex items-center"
        style={{ color: `var(${ThemeVariablesKeys.fg})` }}
      >
      <div class="mr-3 flex items-center">
        <p
          class="mr-2 rounded border-0.5 p-1 text-xxxs font-medium leading-[8px]"
          style={{ "border-color": `var(${ThemeVariablesKeys.fg})` }}
        >
          Rg
        </p>
        <p class="text-xxs leading-none">{fontSizes().regular}px</p>
      </div>
      <div class="flex items-center">
        <p
          class="mr-2 rounded border-0.5 p-1 text-xxxs font-medium leading-[8px]"
          style={{ "border-color": `var(${ThemeVariablesKeys.fg})` }}
        >
          Bd
        </p>
        <p class="text-xxs leading-none">{fontSizes().bold}px</p>
      </div>
    </div>}>
      <Match when={Math.abs(props.apca) < conclusions['Not Readable']}>
        <StopIcon />
      </Match>
      <Match when={Math.abs(props.apca) < conclusions['Non-Text']}>
        <WarningIcon />
      </Match>
      <Match when={Math.abs(props.apca) < conclusions['Large Text']}>
        <PictureIcon />
      </Match>
    </Switch>
  );
};

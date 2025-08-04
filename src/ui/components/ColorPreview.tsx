import { BasicColorPreviewIcon } from '~ui/components/dynamicIcons/BasicColorPreviewIcon.tsx';
import { LayeredColorPreviewIcon } from '~ui/components/dynamicIcons/LayeredColorPreviewIcon.tsx';
import { type JSX, Show } from 'solid-js';

interface Props {
  borderColor: string;
  indicatorColor: string;
  isBlended: boolean;
}

export const ColorPreview = (props: Props): JSX.Element => (
  <Show
    fallback={
      <BasicColorPreviewIcon
        borderColor={props.borderColor}
        indicatorColor={props.indicatorColor}
      />
    }
    when={props.isBlended}
  >
    <div class="flex">
      <LayeredColorPreviewIcon
        borderColor={props.borderColor}
        indicatorColor={props.indicatorColor}
      />
    </div>
  </Show>
);

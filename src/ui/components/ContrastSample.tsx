import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { type JSX } from 'solid-js';

interface Props {
  bgColor: string;
  color: string;
  opacity?: number;
  size: 'large' | 'small';
}

const exampleText = 'Aa';

export const ContrastSample = (props: Props): JSX.Element => (
    <p
      style={{
        "background-color": props.bgColor,
        "border-color": `var(${ThemeVariablesKeys.borderOriginal})`,
        color: props.color,
      }}
      class={`${props.size === 'small' ? 'size-9 text-xxs' : 'h-13 w-13 text-base'} flex items-center justify-center rounded-lg border-0.5 text-base`}
    >
      <span
        style={{ opacity: props.opacity }}
      >
        {exampleText}
      </span>
    </p>
  );

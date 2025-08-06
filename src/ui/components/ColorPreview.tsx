import { BasicColorPreviewIcon } from '~ui/components/BasicColorPreviewIcon.tsx';
import { LayeredColorPreviewIcon } from '~ui/components/LayeredColorPreviewIcon.tsx';
import { type JSX } from 'preact';

interface Props {
  borderColor: string;
  indicatorColor: string;
  isBlended: boolean;
}

export const ColorPreview = ({
  borderColor,
  indicatorColor,
  isBlended,
}: Props): JSX.Element => {
  if (isBlended) {
    return (
      <div className="flex">
        <LayeredColorPreviewIcon
          borderColor={borderColor}
          indicatorColor={indicatorColor}
        />
      </div>
    );
  }

  return (
    <BasicColorPreviewIcon
      borderColor={borderColor}
      indicatorColor={indicatorColor}
    />
  );
};

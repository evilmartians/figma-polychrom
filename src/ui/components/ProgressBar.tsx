import { type ReactElement } from 'react';

interface Props {
  apca: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
}

const APCA_NEGATIVE_MAX_SCALE = 108;
const APCA_POSITIVE_MAX_SCALE = 106;

export const ProgressBar = ({
  apca,
  height,
  primaryColor,
  secondaryColor,
}: Props): ReactElement => {
  const maxScale = apca > 0 ? APCA_POSITIVE_MAX_SCALE : APCA_NEGATIVE_MAX_SCALE;
  const barWidth = maxScale * 2;
  const filledSegmentWidth = Math.abs(apca) * 2;

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center">
        <span
          style={{
            color: secondaryColor,
          }}
          className="mr-2 text-xxs"
        >
          0
        </span>

        <div
          style={{
            backgroundColor: `${secondaryColor}1F`,
            height: `${height}px`,
            width: barWidth,
          }}
          className="relative rounded-full"
        >
          <div
            style={{
              backgroundImage: `linear-gradient(to right, ${primaryColor}B2 60%, ${primaryColor} 85%)`,
              height: `${height}px`,
              width: filledSegmentWidth,
            }}
            className="rounded-full"
          />
          <div
            style={{
              backgroundColor: primaryColor,
              left: filledSegmentWidth,
            }}
            className="absolute h-3 w-3 -translate-x-1.5 -translate-y-2.5 rounded-full blur-md"
          ></div>
        </div>

        <span
          style={{
            color: secondaryColor,
          }}
          className="ml-2 text-xxs"
        >
          {maxScale}
        </span>
      </div>
    </div>
  );
};

import clsx from 'clsx';
import { nanoid } from 'nanoid';
import React from 'react';

import { type SelectedNodesAndTheirBackgrounds } from '../../types/common';
import { getLegibilityCategory } from '../../utils/apca/get-apca-judgment';
import { generateUIColors } from '../../utils/colors/generate-ui-colors';
import { ColorIndicators } from './ColorIndicators';
import { ColorMetrics } from './ColorMetrics';
import { SegmentedFontStyleDefinition } from './SegmentedFontStyleDefinition';

interface Props {
  size: 'large' | 'small';
  userSelection: SelectedNodesAndTheirBackgrounds;
}

export const Selection: React.FC<Props> = ({
  size,
  userSelection: { apca, bgNode, selectedNode },
}) => {
  if (apca == null) {
    return <p className="my-4">Can&apos;t calc</p>;
  }

  const id = nanoid();
  const isSmall = size === 'small';
  const bgNodeFill = bgNode?.fills[0];
  const selectedNodeFill = selectedNode?.fills[0];
  const uiColors = generateUIColors(selectedNodeFill, bgNodeFill);

  return (
    <div
      style={{
        backgroundColor: uiColors.widgetBackgroundHex,
      }}
      className="w-full rounded-2xl p-2"
    >
      <SegmentedFontStyleDefinition
        id={id}
        primaryColor={uiColors.textPrimaryHex}
        secondaryColor={uiColors.textSecondaryAlpha10}
      />

      <div className="relative grid h-full w-full">
        {(selectedNodeFill?.oklch?.l != null ||
          bgNodeFill?.oklch?.l != null) && (
          <div className="absolute left-0 top-0">
            <ColorMetrics
              label="L"
              labelColor={uiColors.textSecondaryAlpha60}
              labelDirection="left"
              labelPosition="bottom"
              primary={(selectedNodeFill?.oklch?.l * 100).toFixed() + '%'}
              primaryColor={uiColors.textPrimaryHex}
              secondary={(bgNodeFill?.oklch?.l * 100).toFixed() + '%'}
              secondaryColor={uiColors.textSecondaryHex}
              size={size}
            />
          </div>
        )}

        {(selectedNodeFill?.oklch?.c != null ||
          bgNodeFill?.oklch?.c != null) && (
          <div className="absolute right-0 top-0">
            <ColorMetrics
              label="C"
              labelColor={uiColors.textSecondaryAlpha60}
              labelDirection="right"
              labelPosition="bottom"
              primary={selectedNodeFill?.oklch?.c?.toFixed(2)}
              primaryColor={uiColors.textPrimaryHex}
              secondary={bgNodeFill?.oklch?.c?.toFixed(2)}
              secondaryColor={uiColors.textSecondaryHex}
              size={size}
            />
          </div>
        )}

        <p
          className={clsx(
            'px-2 text-center',
            isSmall ? 'mb-3 text-xxs' : 'mt-16 text-base',
            isSmall ? 'font-normal' : 'font-extralight'
          )}
          style={{
            color: uiColors.textPrimaryHex,
          }}
        >
          {getLegibilityCategory(Math.abs(apca))}
        </p>

        <div
          className={clsx(
            isSmall ? 'mb-5' : 'mb-16',
            'flex w-full items-center justify-between'
          )}
        >
          <div className="w-8">
            <ColorIndicators bg={bgNodeFill} fg={selectedNodeFill} />
          </div>

          <h1
            className={clsx(
              isSmall ? 'text-7.5xl' : 'text-8.5xl',
              `segmented-${id} mr-7 w-full text-center leading-none`
            )}
          >
            {Math.abs(apca)}
          </h1>
        </div>

        <div className="hidden text-center">scale</div>

        {(selectedNodeFill?.opacity != null || bgNodeFill?.opacity != null) && (
          <div className="absolute bottom-0 left-0">
            <ColorMetrics
              primary={
                selectedNodeFill?.opacity != null
                  ? (selectedNodeFill?.opacity * 100).toFixed()
                  : '0%'
              }
              secondary={
                bgNodeFill?.opacity != null
                  ? (bgNodeFill?.opacity * 100).toFixed()
                  : '0%'
              }
              label="A"
              labelColor={uiColors.textSecondaryAlpha60}
              labelDirection="left"
              labelPosition="top"
              primaryColor={uiColors.textPrimaryHex}
              secondaryColor={uiColors.textSecondaryHex}
              size={size}
            />
          </div>
        )}

        {(selectedNodeFill?.oklch?.h != null ||
          bgNodeFill?.oklch?.h != null) && (
          <div className="absolute bottom-0 right-0">
            <ColorMetrics
              label="H"
              labelColor={uiColors.textSecondaryAlpha60}
              labelDirection="right"
              labelPosition="top"
              primary={selectedNodeFill?.oklch?.h?.toFixed(2)}
              primaryColor={uiColors.textPrimaryHex}
              secondary={bgNodeFill?.oklch?.h?.toFixed(2)}
              secondaryColor={uiColors.textSecondaryHex}
              size={size}
            />
          </div>
        )}
      </div>
    </div>
  );
};

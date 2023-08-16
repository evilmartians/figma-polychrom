import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { createFigmaPaint } from '../../../utils/figma/create-figma-paint.ts';
import { ColorIndicator } from '../ColorIndicator';

describe('ColorIndicator component', () => {
  test('Render without crash', () => {
    expect(
      render(
        <ColorIndicator
          fill={createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 1)}
        />
      ).container
    ).toMatchSnapshot();
  });
});

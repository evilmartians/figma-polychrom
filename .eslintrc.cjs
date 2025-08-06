module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:eslint-config-preact',
    'prettier',
    'plugin:perfectionist/recommended-alphabetical',
    'plugin:tailwindcss/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:boundaries/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['preact', 'prettier', 'jsx-a11y', 'boundaries'],
  rules: {
    'import/no-default-export': 'error',
    'func-style': ['error', 'expression'],
    'preact/preact-in-jsx-scope': 'off',
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: 'api',
            allow: ['types', 'utils', 'api'],
          },
          {
            from: 'ui',
            allow: ['types', 'utils', 'ui'],
          },
          {
            from: 'utils',
            allow: ['types', 'utils'],
          },
        ],
      },
    ],
  },
  settings: {
    tailwindcss: {
      whitelist: ['segmented-'],
    },
    'import/resolver': {
      alias: [
        ['~api', './src/api'],
        ['~ui', './src/ui'],
        ['~hooks', './src/hooks'],
        ['~utils', './src/utils'],
        ['~types', './src/types'],
        ['~test-utils', './src/test-utils'],
      ],
    },
    preact: {
      version: 'detect',
    },
    'boundaries/elements': [
      {
        type: 'api',
        pattern: 'src/api/*',
      },
      {
        type: 'ui',
        pattern: 'src/ui/*',
      },
      {
        type: 'utils',
        pattern: 'src/utils/*',
      },
      {
        type: 'types',
        pattern: 'src/types/*',
      },
      {
        type: 'test-utils',
        pattern: 'src/test-utils/*',
      },
    ],
  },
};

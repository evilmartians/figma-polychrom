module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
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
  plugins: ['react', 'prettier', 'jsx-a11y', 'boundaries'],
  rules: {
    'import/no-default-export': 'error',
    'func-style': ['error', 'expression'],
    'react/react-in-jsx-scope': 'off',
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
        ['~utils', './src/utils'],
        ['~types', './src/types'],
        ['~test-utils', './src/test-utils'],
      ],
    },
    react: {
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

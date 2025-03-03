module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      files: ['**/*.cjs'],
      env: {
        node: true,
      },
    },
  ],
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  root: true,
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    curly: [2, 'all'],
    'react/no-array-index-key': 1,
    'arrow-parens': [2, 'as-needed'],
    'max-len': 1,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'implicit-arrow-linebreak': 0,
    'object-curly-newline': 0,
    'react/jsx-one-expression-per-line': 0,
    'prettier/prettier': 2,
    '@typescript-eslint/comma-dangle': 0,
    'function-paren-newline': 0,
    'operator-linebreak': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-props-no-spreading': 0,
  },
};

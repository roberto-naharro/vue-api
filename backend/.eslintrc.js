module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: [
        '**/__mocks__/*.{j,t}s?(x)',
        '**/src/__tests__/*.ts',
        '**/src/tests/unit/**/*.spec.ts',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
      env: {
        jest: true,
      },
    },
  ],
};

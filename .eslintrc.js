module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  ignorePatterns: ['jest.config.ts'],
  rules: {
    'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')], // https://stackoverflow.com/q/39114446/2771889
  }
};

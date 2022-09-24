module.exports = {
  env: {
    'cypress/globals': true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'react-app/jest',
  ],
  rules: {
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
  },
  plugins: [
    'cypress',
  ],
};

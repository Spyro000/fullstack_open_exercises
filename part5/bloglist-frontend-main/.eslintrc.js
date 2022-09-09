module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'react-app/jest',
  ],
  rules: {
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
  },
};

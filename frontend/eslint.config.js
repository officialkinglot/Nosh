 module.exports = {
  root: true, // Ensure ESLint stops looking for config files in parent directories
  env: {
    browser: true, // Enable browser global variables (e.g., `window`, `document`)
    es2020: true, // Enable ES2020 global variables and syntax
    node: true, // Enable Node.js global variables (e.g., `module`, `require`)
  },
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:react/recommended', // Use recommended React rules
    'plugin:react/jsx-runtime', // Enable new JSX runtime (automatic)
    'plugin:react-hooks/recommended', // Use recommended React Hooks rules
    'plugin:import/recommended', // Use recommended import/export rules
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'], // Ignore specific files/directories
  parserOptions: {
    ecmaVersion: 'latest', // Use the latest ECMAScript version
    sourceType: 'module', // Use ES modules
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
  },
  settings: {
    react: {
      version: '18.2', // Specify the React version
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Support these file extensions
      },
    },
  },
  plugins: [
    'react-refresh', // Enable React Fast Refresh support
    'import', // Enable import/export rules
  ],
  rules: {
    // React-specific rules
    'react/jsx-no-target-blank': 'off', // Disable the rule for target="_blank"
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }, // Allow exporting constants
    ],

    // General ESLint rules
    'no-unused-vars': 'warn', // Warn about unused variables
    'no-console': 'warn', // Warn about console.log statements
    'import/no-unresolved': 'error', // Error on unresolved imports
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always', // Add newlines between import groups
        alphabetize: { order: 'asc', caseInsensitive: true }, // Alphabetize imports
      },
    ],
  },
};

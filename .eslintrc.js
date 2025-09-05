module.exports = {
  // Esta es la configuración raíz de ESLint.
  root: true,

  // El entorno por defecto es Node.js. Esto se aplicará a los archivos .js
  // como este mismo, babel.config.js, jest.config.js, etc.
  env: {
    node: true, // Defines globals for Node.js (e.g., module, require).
    es2021: true, // Allows modern ECMAScript syntax.
  },

  // Plugins y configuración base para todo el proyecto (archivos JS).
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Reports Prettier issues as ESLint errors.
  },

  // Ignore patterns for the whole project.
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '.expo/',
    '.husky/',
    'apps/mobile/ios/',
    'apps/mobile/android/',
    '*.json',
  ],

  // Overrides for specific file types.
  overrides: [
    {
      // Configuration for TypeScript files (React Native app code).
      files: ['apps/**/*.ts', 'apps/**/*.tsx', 'packages/**/*.ts'],

      // Environment and parser specific to TypeScript and React Native.
      env: {
        'react-native/react-native': true,
        jest: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'react', 'react-native', 'react-hooks'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      rules: {
        // Custom rules for our React Native code.
        'react/prop-types': 'off', // We use TypeScript for type checking.
        'react/react-in-jsx-scope': 'off', // Not needed with modern JSX transform.
        'react-native/no-raw-text': 'off', // Can be too restrictive.
        'prettier/prettier': 'error',
        // Temporarily disabling style rules to allow the first commit.
        'react-native/no-unused-styles': 'off',
        'react-native/no-inline-styles': 'off',
        'react-native/no-color-literals': 'off',
        'react-native/sort-styles': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
}

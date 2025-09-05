module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
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
  overrides: [
    {
      // Se ha añadido 'packages/**/*.tsx' para que la configuración se aplique
      // correctamente a los componentes de React en nuestros paquetes de UI.
      files: [
        'apps/**/*.ts',
        'apps/**/*.tsx',
        'packages/**/*.ts',
        'packages/**/*.tsx',
      ],
      env: {
        'react-native/react-native': true,
        jest: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
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
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react-native/no-raw-text': 'off',
        'prettier/prettier': 'error',
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

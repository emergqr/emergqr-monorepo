/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // This file is used to set up the testing environment.
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // This pattern tells Jest to not transform any file in node_modules except for the ones
  // that are known to be ES modules or need transpilation for React Native.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
}

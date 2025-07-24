module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
    '^.+\\.(js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          allowJs: true,
          jsx: 'react-jsx',
        },
      },
    ],
    '^.+\\.svg$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@x/(.*)$': '<rootDir>/src/x/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(isows|@supabase|@supabase/realtime-js)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.{ts,tsx}',

  //   '!<rootDir>/src/app/**',
  //   '!<rootDir>/src/assets/**',
  //   '!<rootDir>/src/styles/**',

  //   '!<rootDir>/src/**/index.{ts,tsx}',
  //   '!<rootDir>/src/**/middleware.{ts,tsx}',

  //   '!<rootDir>/src/**/*.types.ts',
  //   '!<rootDir>/src/**/*.constants.ts',
  //   '!<rootDir>/src/**/*.schema.ts',

  //   '!<rootDir>/src/**/*Skeleton.tsx',
  //   '!<rootDir>/src/**/*Loader.tsx',
  //   '!<rootDir>/src/**/*Loading.tsx',

  //   '!<rootDir>/src/**/*.svg',

  //   '!<rootDir>/src/**/*.test.{ts,tsx}',
  //   '!<rootDir>/src/**/__tests__/**',
  // ],
};

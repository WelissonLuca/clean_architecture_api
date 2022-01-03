module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

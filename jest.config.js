module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/test/**',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@presentations/(.*)$': '<rootDir>/src/presentations/$1',
    '^@validation/(.*)$': '<rootDir>/src/validation/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
  },
};

const path = require('path');

const MIN_CODE_COVERAGE_THRESHOLD = 100;

const tsConfigPath = process.env.TS_NODE_PROJECT || 'tsconfig.json';

module.exports = {
  rootDir: '.',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/index.ts',
    '!src/main.ts',
    '!src/run-migrations.ts',
    '!src/MigrationModule.ts',
  ],
  coverageDirectory: 'coverage/summary',
  coverageReporters: [['json-summary', { file: 'repo-assistant-service.json' }]],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/core/config/ConfigValues.ts',
    '<rootDir>/src/database/postgres/migrations/*',
  ],
  coverageThreshold: {
    global: {
      branches: MIN_CODE_COVERAGE_THRESHOLD,
      functions: MIN_CODE_COVERAGE_THRESHOLD,
      lines: MIN_CODE_COVERAGE_THRESHOLD,
      statements: MIN_CODE_COVERAGE_THRESHOLD,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@app/(.*)': '<rootDir>/src/$1',
    '^@test/(.*)': '<rootDir>/test/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/cypress/', '<rootDir>/dist/', '<rootDir>/node_modules/', '<rootDir>/main.ts'],
  testRegex: '\\.spec.ts$',
  transform: {
    '^.+\\.(t)s$': ['ts-jest', { tsconfig: path.resolve(__dirname, tsConfigPath) }],
  },
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
  maxWorkers: 4,
};

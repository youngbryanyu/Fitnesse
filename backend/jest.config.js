/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  coverageThreshold: { /* TODO: set thresholds to 80% */
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  collectCoverage: true,  /* force tests to pass coverage or else will exit with error */
  collectCoverageFrom: [
    'src/**/*.ts',        /* include all files in src directory*/
    '!src/**/index.ts',   /* exclude index.ts files */
    '!src/models/**',     /* exclude data models */
    '!src/constants/**',   /* exclude constants */
  ]
};
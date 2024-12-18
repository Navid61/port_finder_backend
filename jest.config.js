module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'], // Test file pattern
    transform: {
        "^.+\\.tsx?$": "ts-jest",
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // Support alias for imports if needed
      },
    moduleDirectories: ['node_modules', 'src'], // Include source files in tests
    collectCoverage: true, // Enable test coverage reporting
    coverageDirectory: 'coverage', // Output directory for coverage reports
    testTimeout: 10000, // 10 seconds
  };
  
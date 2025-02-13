module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    setupFilesAfterEnv: ['./src/tests/setup.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    verbose: true,
    globals: {
      NODE_ENV: 'test'
    }
  };
// jest.config.js
module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**'
  ],
  verbose: true,
  setupFiles: ['dotenv/config']
};

  
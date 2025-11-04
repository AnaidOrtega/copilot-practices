// playwright.config.js
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  webServer: {
    command: 'http-server . -p 3000', // Serve the current directory on port 3000
    port: 3000,
    timeout: 120 * 1000, // Optional: increase timeout if needed
    reuseExistingServer: !process.env.CI, // Reuse server if not in CI
  },
})

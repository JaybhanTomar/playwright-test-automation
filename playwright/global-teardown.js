// Global teardown to ensure all processes are cleaned up
async function globalTeardown() {
  console.log('🧹 Running global teardown...');

  try {
    // Use a much more conservative approach - only clean up obvious test artifacts
    const fs = require('fs');
    const path = require('path');

    // Clean up temporary files instead of killing processes
    const tempDirs = [
      path.join(__dirname, '../test-results'),
      path.join(__dirname, '../playwright-report'),
      path.join(__dirname, '../allure-results')
    ];

    for (const dir of tempDirs) {
      try {
        if (fs.existsSync(dir)) {
          // Don't delete, just log - let Playwright handle its own cleanup
          console.log(`📁 Test artifacts found in: ${dir}`);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    }

    // Only kill processes if they have very specific Playwright markers
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    try {
      // Only kill processes with very specific Playwright temp directory patterns
      await execAsync('pkill -f "/tmp/playwright"');
      console.log('✅ Playwright temp processes cleaned up');
    } catch (error) {
      // Ignore if no processes found
    }

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Error in global teardown:', error);
  }
}

module.exports = globalTeardown;

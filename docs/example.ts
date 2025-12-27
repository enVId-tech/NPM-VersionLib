/**
 * Example usage of npm-version-lib as a library
 * 
 * This demonstrates how to use the library programmatically
 * in your Node.js or TypeScript projects
 */

import {
    getProjectVersion,
    generateVersion,
    getVersionInfo,
    generateAndUpdateVersion,
    updatePackageVersion,
    createVersionFile,
    getGitCommitCount,
    type VersionInfo
} from 'npm-version-lib';

// Example 1: Get current project version
console.log('=== Example 1: Get Current Version ===');
const currentVersion = getProjectVersion();
console.log('Current version:', currentVersion);
console.log();

// Example 2: Generate a new version string
console.log('=== Example 2: Generate Version String ===');
const devVersion = generateVersion('dev');
const betaVersion = generateVersion('beta');
const releaseVersion = generateVersion('release');
console.log('Dev version:', devVersion);
console.log('Beta version:', betaVersion);
console.log('Release version:', releaseVersion);
console.log();

// Example 3: Get detailed version information
console.log('=== Example 3: Get Version Info ===');
const versionInfo: VersionInfo | null = getVersionInfo('beta');
if (versionInfo) {
    console.log('Full version:', versionInfo.version);
    console.log('Date version:', versionInfo.dateVersion);
    console.log('Release type:', versionInfo.releaseType);
    console.log('Build number:', versionInfo.buildNumber);
    console.log('Timestamp:', versionInfo.timestamp);
}
console.log();

// Example 4: Generate and update version in one step
console.log('=== Example 4: Generate and Update ===');
const newVersion = generateAndUpdateVersion('dev');
console.log('Generated and updated version:', newVersion);
console.log();

// Example 5: Manual version update
console.log('=== Example 5: Manual Update ===');
const customVersion = '1.2.3-custom.1';
const updated = updatePackageVersion(customVersion);
console.log('Manual update successful:', updated);
console.log();

// Example 6: Get git commit count
console.log('=== Example 6: Git Commit Count ===');
const today = new Date();
const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const commitCount = getGitCommitCount(dateStr);
console.log(`Commits today (${dateStr}):`, commitCount);
console.log();

// Example 7: Create version file (optional)
console.log('=== Example 7: Create Version File ===');
if (releaseVersion) {
    const created = createVersionFile(releaseVersion);
    console.log('Version file created:', created);
    if (created) {
        console.log('Check src/version.ts for generated content');
    }
}
console.log();

// Example 8: Using options
console.log('=== Example 8: Using Options ===');
const silentVersion = generateVersion('release', { silent: true });
console.log('Silent version (no console output from function):', silentVersion);
console.log();

// Example 9: Working with different project paths
console.log('=== Example 9: Custom Project Path ===');
const externalVersion = generateVersion('dev', {
    projectPath: process.cwd(), // Use current directory
    silent: false
});
console.log('Version from custom path:', externalVersion);

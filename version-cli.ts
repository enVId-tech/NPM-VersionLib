#!/usr/bin/env node

/**
 * NPM-VersionLib CLI Tool
 * A convenient command-line interface for generating version numbers
 * 
 * Usage:
 *   npm-version [version-type]         # If installed globally
 *   npx npm-version [version-type]     # If installed locally
 *   node version-cli.js [version-type] # Direct execution
 *   
 * Version types:
 *   dev      - Development version (default)
 *   beta     - Beta release version  
 *   release  - Production release version
 * 
 * Examples:
 *   npm-version               # Generates dev version
 *   npm-version dev           # Generates dev version
 *   npm-version beta          # Generates beta version
 *   npm-version release       # Generates release version
 *   npx npm-version beta      # Using npx
 */
import { createVersionFile, generateVersion, updatePackageVersion } from './generate-version.js';

type Colors = { [key: string]: string };

export const colors: Colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorize(text: string, color: keyof Colors): string {
    return `${colors[color]}${text}${colors.reset}`;
}

function showHelp(): void {
    console.log(colorize('NPM-VersionLib CLI Tool', 'bright'));
    console.log(colorize('========================', 'bright'));
    console.log('');
    console.log('A convenient command-line interface for generating version numbers');
    console.log('');
    console.log(colorize('Usage:', 'yellow'));
    console.log('  npm-version [version-type]         # If installed globally');
    console.log('  npx npm-version [version-type]     # If installed locally');
    console.log('  node version-cli.js [version-type] # Direct execution');
    console.log('');
    console.log(colorize('Default version types:', 'yellow'));
    console.log('  dev      - Development version (default)');
    console.log('  beta     - Beta release version');
    console.log('  release  - Production release version');
    console.log('');
    console.log(colorize('Examples:', 'yellow'));
    console.log('  npm-version               # Generates dev version');
    console.log('  npm-version dev           # Generates dev version');
    console.log('  npm-version beta          # Generates beta version');
    console.log('  npm-version release       # Generates release version');
    console.log('  npx npm-version beta      # Using npx');
    console.log('');
    console.log(colorize('For more information, visit:', 'cyan'));
    console.log('https://www.npmjs.com/package/npm-version');
    console.log('');
}

function showVersion() {
    console.log(colorize('NPM-Version CLI Tool', 'bright'));
    console.log(colorize('========================', 'bright'));
    console.log('');
}

/**
 * Validates the version type input
 * @param versionType - The version type string to validate
 * @returns {boolean} False if invalid, true otherwise
 */
function validateVersionType(versionType: string): boolean {
    return (!versionType || versionType.length === 0 || typeof versionType !== 'string')
}

function main() {
    // Get the argument after the script name (index 2)
    const args = process.argv[2]?.toString() ?? 'dev';

    // Handle help flags
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }

    // Handle version flags
    if (args.includes('--version') || args.includes('-v')) {
        showVersion();
        return;
    }

    // Get version type from arguments
    let versionType = args || 'dev';

    // Validate version type
    if (validateVersionType(versionType)) {
        console.error(colorize('Error:', 'red'), `Invalid version type "${versionType}"`);
        console.error('Default types are: dev, beta, release');
        console.error('Input a string without spaces for a custom type or leave empty for dev.');
        console.error('Use --help for more information');
        process.exit(1);
    }

    try {
        console.log(colorize('NPM-Version CLI', 'cyan'));
        console.log(colorize('===================', 'cyan'));
        console.log('');
        console.log(colorize('Generating version...', 'yellow'));
        console.log(`Version type: ${colorize(versionType, 'magenta')}`);
        console.log('');

        // Generate the version
        const generatedVersion = generateVersion(versionType);

        if (!generatedVersion) {
            throw new Error('Failed to generate version');
        }

        console.log(colorize('Version generated:', 'green'), colorize(generatedVersion, 'bright'));
        console.log('');

        // Update package.json (if it exists)
        console.log(colorize('Updating package.json...', 'yellow'));
        const packageUpdated = updatePackageVersion(generatedVersion);

        if (packageUpdated) {
            console.log(colorize('package.json updated successfully', 'green'));
        } else {
            console.log(colorize('package.json not found or failed to update', 'yellow'));
        }

        // Create version.ts file
        console.log(colorize('Creating version file...', 'yellow'));
        const versionFileCreated = createVersionFile(generatedVersion);

        if (versionFileCreated) {
            console.log(colorize('src/version.ts created/updated successfully', 'green'));
        } else {
            console.log(colorize('Failed to create version file', 'red'));
        }

        console.log('');
        console.log(colorize('Version generation completed!', 'green'));
        console.log(colorize('Final version:', 'cyan'), colorize(generatedVersion, 'bright'));

        // Also output the version for scripting purposes
        process.stdout.write('\n' + generatedVersion + '\n');
    } catch (error: any) {
        console.error('');
        console.error(colorize('Error:', 'red'), error.message);
        console.error('');
        console.error(colorize('Stack trace:', 'red'));
        console.error(error.stack);
        process.exit(1);
    }
}

export {
    generateVersion,
    updatePackageVersion,
    createVersionFile,
    showHelp,
    showVersion
}

// Run main function - this file is meant to be executed as a CLI tool
main();
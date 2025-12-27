#!/usr/bin/env node
import { generateVersion, updatePackageVersion } from './generate-version.js';

/** ANSI color codes for terminal output */
const c = {
    r: '\x1b[0m',
    b: '\x1b[1m',
    red: '\x1b[31m',
    grn: '\x1b[32m',
    yel: '\x1b[33m',
    cyn: '\x1b[36m',
    mag: '\x1b[35m'
};

/**
 * Wraps text with ANSI color codes for terminal output
 * @param text - The text to colorize
 * @param color - The ANSI color code to apply
 * @returns The text wrapped with color codes
 */
const colorize = (text: string, color: string) => `${color}${text}${c.r}`;

/**
 * Displays help information for the CLI tool
 * Shows usage instructions, available version types, and examples
 */
function showHelp(): void {
    console.log(colorize('NPM-VersionLib CLI', c.b) + '\n');
    console.log(colorize('Usage:', c.yel));
    console.log('  npm-version [type]  # dev (default), beta, release\n');
    console.log(colorize('Examples:', c.yel));
    console.log('  npm-version         # dev version');
    console.log('  npm-version beta    # beta version\n');
    console.log(colorize('More:', c.cyn) + ' https://www.npmjs.com/package/npm-version-lib\n');
}

/**
 * Main CLI entry point
 * Parses command-line arguments, validates input, generates version number,
 * and updates package.json
 * @throws {Error} When version generation or file updates fail
 */
function main() {
    const arg = process.argv[2] || 'dev';

    if (arg.includes('--help') || arg.includes('-h')) {
        showHelp();
        return;
    }

    if (!arg || arg.includes(' ')) {
        console.error(colorize('Error: Invalid version type', c.red));
        console.error('Use: dev, beta, release, or custom string without spaces\n');
        process.exit(1);
    }

    try {
        console.log(colorize(`Generating ${arg} version...`, c.yel));
        
        const version = generateVersion(arg, { silent: true });
        if (!version) throw new Error('Version generation failed');

        updatePackageVersion(version, { silent: true });

        console.log(colorize(`✓ Version: ${version}`, c.grn));
        process.stdout.write(version + '\n');
    } catch (error: any) {
        console.error(colorize('Error:', c.red), error.message);
        process.exit(1);
    }
}

main();
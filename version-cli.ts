#!/usr/bin/env node
import { generateVersion, updatePackageVersion, type VersionOptions } from './generate-version.js';

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
    console.log('  npm-version [type] [commit-count]');
    console.log('  npm-version [commit-count]         # Shortcut for release\n');
    console.log(colorize('Arguments:', c.yel));
    console.log('  type          Version type (blank/empty = release)');
    console.log('  commit-count  Optional: Override git commit count (shows warning)');
    console.log('                If only a number is provided, treated as release\n');
    console.log(colorize('Version Types:', c.yel));
    console.log('  (blank)  → 25.12.26.1     # Release (clean format)');
    console.log('  dev      → 25.12.26-dev.1');
    console.log('  beta     → 25.12.26-beta.1');
    console.log('  custom   → 25.12.26-custom.1\n');
    console.log(colorize('Examples:', c.yel));
    console.log('  npm-version              # Release version (25.12.26.1)');
    console.log('  npm-version dev          # Dev version');
    console.log('  npm-version beta         # Beta version');
    console.log('  npm-version dev 5        # Dev version with commit count = 5 (warning)');
    console.log('  npm-version 42           # Release version with commit count = 42 (warning)\n');
    console.log(colorize('More:', c.cyn) + ' https://www.npmjs.com/package/npm-version-lib\n');
}

/**
 * Main CLI entry point
 * Parses command-line arguments, validates input, generates version number,
 * and updates package.json
 * @throws {Error} When version generation or file updates fail
 */
function main() {
    let arg = process.argv[2] || '';
    let commitCountArg = process.argv[3];

    if (arg.includes('--help') || arg.includes('-h')) {
        showHelp();
        return;
    }

    if (arg.includes(' ')) {
        console.error(colorize('Error: Invalid version type', c.red));
        console.error('Version type cannot contain spaces\n');
        process.exit(1);
    }

    // If first argument is a number, treat it as commit count for release version
    const firstArgAsNum = parseInt(arg, 10);
    if (!isNaN(firstArgAsNum) && firstArgAsNum >= 0 && arg.trim() === firstArgAsNum.toString()) {
        commitCountArg = arg;
        arg = ''; // Set to release (empty)
    }

    // Parse commit count override
    let overrideCommitCount: number | undefined;
    if (commitCountArg) {
        const parsed = parseInt(commitCountArg, 10);
        if (isNaN(parsed) || parsed < 0) {
            console.error(colorize('Error: Commit count must be a non-negative integer', c.red));
            process.exit(1);
        }
        overrideCommitCount = parsed;
    }

    try {
        const displayType = arg || 'release';
        console.log(colorize(`Generating ${displayType} version...`, c.yel));
        
        const options: VersionOptions = { silent: false };
        if (overrideCommitCount !== undefined) {
            options.overrideCommitCount = overrideCommitCount;
        }
        
        const version = generateVersion(arg, options);
        if (!version) throw new Error('Version generation failed');

        updatePackageVersion(version, { silent: true });

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
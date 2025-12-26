#!/usr/bin/env node
import { createVersionFile, generateVersion, updatePackageVersion } from './generate-version.js';

const c = {
    r: '\x1b[0m',
    b: '\x1b[1m',
    red: '\x1b[31m',
    grn: '\x1b[32m',
    yel: '\x1b[33m',
    cyn: '\x1b[36m',
    mag: '\x1b[35m'
};

const colorize = (text: string, color: string) => `${color}${text}${c.r}`;

function showHelp(): void {
    console.log(colorize('NPM-VersionLib CLI', c.b) + '\n');
    console.log(colorize('Usage:', c.yel));
    console.log('  npm-version [type]  # dev (default), beta, release\n');
    console.log(colorize('Examples:', c.yel));
    console.log('  npm-version         # dev version');
    console.log('  npm-version beta    # beta version\n');
    console.log(colorize('More:', c.cyn) + ' https://www.npmjs.com/package/npm-version-lib\n');
}

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
        
        const version = generateVersion(arg);
        if (!version) throw new Error('Version generation failed');

        updatePackageVersion(version);
        createVersionFile(version);

        console.log(colorize(`✓ Version: ${version}`, c.grn));
        process.stdout.write(version + '\n');
    } catch (error: any) {
        console.error(colorize('Error:', c.red), error.message);
        process.exit(1);
    }
}

main();
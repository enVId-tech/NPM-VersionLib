import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Generates a build version based on current date and commit count for today
 * Format: YY.MM.DD.dev/beta/releazse.1 (e.g., [YY].[MM].[DD]-[type].[commit])
 * - YY: Last two digits of year
 * - MM: Month (01-12)
 * - DD: Day (01-31)
 * - N: Number of commits today (1-based)
 * - d: Development version (e.g., 25.08.17-dev.1)
 * - b: Beta release (e.g., 25.08.17-beta.1)
 * - r: Release version (e.g., 25.08.17-release.1)
 * @param releaseType: ReleaseType, the type of release that is being used. Can be either dev, beta, or release
 * @returns string The complete version number based on the format documented above.
 * @throws error if an error has an occurred
 */
function generateVersion(releaseType: string): string | undefined {
    try {
        // Get current date
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const todayStr: string = [
            now.getFullYear(),
            (now.getMonth() + 1).toString().padStart(2, '0'),
            now.getDate().toString().padStart(2, '0')
        ].join('-');

        const commitCount: number = checkGitCount(todayStr) !== -1 ? checkGitCount(todayStr) : 0 // readPackageFile() !== -1 ? readPackageFile() : 1;

        const version: string = `${year}.${month}.${day}-${releaseType}.${commitCount}`;
        console.log(`Generated version: ${version}`);

        return version;
    } catch (err: any) {
        console.log(`An error has occurred: ${err}`);
    }
}

/**
 * Checks for commit version in package.json
 */
function readPackageFile(): number {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageData = fs.readFileSync(packagePath, 'utf-8');
        const packageJson = JSON.parse(packageData);
        return packageJson.version ? parseInt(packageJson.version.split('.').pop() || '0', 10) : 1;
    } catch (err: any) {
        console.warn('Warning: Could not read package.json, using default version 1');
        console.warn('File error:', err.message);
        return -1;
    }
}

/**
 * Checks for commit history in Git
 */
function checkGitCount(todayStr: string): number {
    try {
        const gitCmd = `git rev-list --count --since="${todayStr} 00:00:00" --until="${todayStr} 23:59:59" HEAD`;
        const result = execSync(gitCmd, { encoding: 'utf-8' }).trim();

        // console.log(`Git command executed: ${gitCmd}`);
        // console.log(`Git commit count: ${result}`);

        if (result && !isNaN(parseInt(result))) {
            return parseInt(result);
        }

        return -1;
    } catch (err: any) {
        console.warn('Warning: Could not get git commit count, using default value 0');
        console.warn('Git error:', err.message);
        return -1;
    }
}

/**
 * Updates the version in package.json
 * @param newVersion The new version to set in package.json
 */
export function updatePackageVersion(newVersion: string): boolean {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageData = fs.readFileSync(packagePath, 'utf-8');
        const packageJson = JSON.parse(packageData);
        packageJson.version = newVersion;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf-8');
        console.log(`Updated package.json version to ${newVersion}`);
        return true;
    } catch (err: any) {
        console.error('Error updating package.json:', err.message);
        return false;
    }
}

/**
 * Creates or updates a version.ts file with build information
 */
export function createVersionFile(version: string): boolean {
    try {
        const versionFilePath = path.join(process.cwd(), 'src', 'version.ts');

        if (!fs.existsSync(path.dirname(versionFilePath))) {
            fs.mkdirSync(path.dirname(versionFilePath), { recursive: true });
        }

        const now = new Date();
        const buildDate = now.toISOString();
        const buildTimestamp = now.getTime();

        const versionFileContent = `// Auto-generated version file
// Do not edit manually - this file is updated by scripts/generate-version.js

export const BUILD_VERSION = '${version}';
export const BUILD_DATE = '${buildDate}';
export const BUILD_TIMESTAMP = ${buildTimestamp};
export const BUILD_INFO = {
  version: BUILD_VERSION,
  date: BUILD_DATE,
  timestamp: BUILD_TIMESTAMP,
};

// Helper function to get readable build date
export const getBuildDateString = (): string => {
  return new Date(BUILD_TIMESTAMP).toLocaleDateString();
};

// Helper function to get version display string
export const getVersionDisplayString = (): string => {
  return (\`v\${BUILD_VERSION}\`.split('-')[0]) ?? '';
};
`;

        fs.writeFileSync(versionFilePath, versionFileContent, 'utf-8');
        console.log(`Created or updated ${versionFilePath}`);
        return true;
    } catch (err: any) {
        console.error('Error creating version.ts file:', err.message);
        return false;
    }
}

function main(version: string) {
    console.log("Generating build version...");

    const generatedVersion = generateVersion(version);
    if (generatedVersion) {
        console.log(`Build version generated: ${generatedVersion}`);
        updatePackageVersion(generatedVersion);
        createVersionFile(generatedVersion);
        console.log('Version generation complete.');
    } else {
        console.error('Failed to generate build version.');
        process.exit(1);
    }
}

// Run if called directly
const scriptPath = process.argv[1]?.replace(/\\/g, '/');
if (scriptPath && import.meta.url === `file:///${scriptPath}`) {
    const argv: string | undefined = process.argv[2];

    if (argv && ["dev", "beta", "release"].includes(argv)) {
        main(argv);
    } else {
        console.error('Please provide a valid release type: dev, beta, or release');
        process.exit(1);
    }
}

export {
    generateVersion,
    readPackageFile,
    checkGitCount,
    main
}
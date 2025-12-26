import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Generates a semantic version number based on current date and git commits
 * Format: YY.MM.DD-[type].[commits]
 * 
 * @param releaseType - The release type (e.g., 'dev', 'beta', 'release', or custom)
 * @returns The generated version string, or undefined if generation fails
 * @example
 * generateVersion('dev')     // '25.12.26-dev.3'
 * generateVersion('beta')    // '25.12.26-beta.1'
 * generateVersion('release') // '25.12.26-release.2'
 */
function generateVersion(releaseType: string): string | undefined {
    try {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${now.getFullYear()}-${month}-${day}`;
        
        const commitCount = checkGitCount(todayStr);
        return `${year}.${month}.${day}-${releaseType}.${commitCount}`;
    } catch (err: any) {
        console.error(`Error generating version: ${err.message}`);
    }
}

/**
 * Retrieves the number of git commits made today
 * 
 * @param todayStr - Date string in format 'YYYY-MM-DD'
 * @returns The count of commits made today, or 0 if git is unavailable or an error occurs
 * @example
 * checkGitCount('2025-12-26') // 5
 */
function checkGitCount(todayStr: string): number {
    try {
        const cmd = `git rev-list --count --since="${todayStr} 00:00:00" --until="${todayStr} 23:59:59" HEAD`;
        const result = execSync(cmd, { encoding: 'utf-8' }).trim();
        return parseInt(result) || 0;
    } catch {
        return 0;
    }
}

/**
 * Updates the version field in package.json with the new version number
 * 
 * @param newVersion - The new version string to set in package.json
 * @returns True if the update was successful, false if an error occurred
 * @example
 * updatePackageVersion('25.12.26-dev.3') // Updates package.json version
 */
export function updatePackageVersion(newVersion: string): boolean {
    try {
        const pkgPath = path.join(process.cwd(), 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        pkg.version = newVersion;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        return true;
    } catch {
        return false;
    }
}

/**
 * Creates or updates src/version.ts with build metadata
 * Generates a TypeScript file containing version constants and helper functions
 * 
 * @param version - The version string to include in the generated file
 * @returns True if the file was created successfully, false if an error occurred
 * @example
 * createVersionFile('25.12.26-dev.3') // Creates src/version.ts with build info
 */
export function createVersionFile(version: string): boolean {
    try {
        const filePath = path.join(process.cwd(), 'src', 'version.ts');
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const now = new Date();
        const content = `// Auto-generated - do not edit
export const BUILD_VERSION = '${version}';
export const BUILD_DATE = '${now.toISOString()}';
export const BUILD_TIMESTAMP = ${now.getTime()};
export const BUILD_INFO = { version: BUILD_VERSION, date: BUILD_DATE, timestamp: BUILD_TIMESTAMP };
export const getBuildDateString = () => new Date(BUILD_TIMESTAMP).toLocaleDateString();
export const getVersionDisplayString = () => BUILD_VERSION.split('-')[0];
`;

        fs.writeFileSync(filePath, content);
        return true;
    } catch {
        return false;
    }
}

export { generateVersion };
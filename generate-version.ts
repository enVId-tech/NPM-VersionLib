import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Options for version generation and management
 */
export interface VersionOptions {
    /** The project directory path (defaults to current working directory) */
    projectPath?: string;
    /** Whether to suppress console output */
    silent?: boolean;
}

/**
 * Represents version metadata for a project
 */
export interface VersionInfo {
    /** The full version string (e.g., '25.12.26-dev.3') */
    version: string;
    /** The major.minor.patch part (e.g., '25.12.26') */
    dateVersion: string;
    /** The release type (e.g., 'dev', 'beta', 'release') */
    releaseType: string;
    /** The commit count for today */
    buildNumber: number;
    /** ISO timestamp when version was generated */
    timestamp: string;
}

/**
 * Retrieves the current version from project's package.json
 * 
 * @param options - Configuration options
 * @returns The current version string, or null if not found
 * @example
 * const version = getProjectVersion();
 * console.log(version); // '25.12.26-dev.3'
 */
export function getProjectVersion(options: VersionOptions = {}): string | null {
    try {
        const pkgPath = path.join(options.projectPath || process.cwd(), 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.version || null;
    } catch {
        return null;
    }
}

/**
 * Generates a semantic version number based on current date and git commits
 * Format: YY.MM.DD-[type].[commits]
 * 
 * @param releaseType - The release type (e.g., 'dev', 'beta', 'release', or custom)
 * @param options - Configuration options
 * @returns The generated version string, or undefined if generation fails
 * @example
 * generateVersion('dev')     // '25.12.26-dev.3'
 * generateVersion('beta')    // '25.12.26-beta.1'
 * generateVersion('release') // '25.12.26-release.2'
 */
export function generateVersion(releaseType: string = 'dev', options: VersionOptions = {}): string | undefined {
    try {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${now.getFullYear()}-${month}-${day}`;
        
        const commitCount = getGitCommitCount(todayStr, options);
        return `${year}.${month}.${day}-${releaseType}.${commitCount}`;
    } catch (err: any) {
        if (!options.silent) {
            console.error(`Error generating version: ${err.message}`);
        }
    }
}

/**
 * Generates and returns detailed version information
 * 
 * @param releaseType - The release type (e.g., 'dev', 'beta', 'release', or custom)
 * @param options - Configuration options
 * @returns Detailed version information object
 * @example
 * const info = getVersionInfo('beta');
 * console.log(info.version);     // '25.12.26-beta.2'
 * console.log(info.releaseType); // 'beta'
 * console.log(info.buildNumber); // 2
 */
export function getVersionInfo(releaseType: string = 'dev', options: VersionOptions = {}): VersionInfo | null {
    try {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${now.getFullYear()}-${month}-${day}`;
        
        const buildNumber = getGitCommitCount(todayStr, options);
        const dateVersion = `${year}.${month}.${day}`;
        const version = `${dateVersion}-${releaseType}.${buildNumber}`;
        
        return {
            version,
            dateVersion,
            releaseType,
            buildNumber,
            timestamp: now.toISOString()
        };
    } catch (err: any) {
        if (!options.silent) {
            console.error(`Error generating version info: ${err.message}`);
        }
        return null;
    }
}

/**
 * Retrieves the number of git commits made today
 * 
 * @param todayStr - Date string in format 'YYYY-MM-DD'
 * @param options - Configuration options
 * @returns The count of commits made today, or 0 if git is unavailable or an error occurs
 * @example
 * getGitCommitCount('2025-12-26') // 5
 */
export function getGitCommitCount(todayStr: string, options: VersionOptions = {}): number {
    try {
        const cwd = options.projectPath || process.cwd();
        const cmd = `git rev-list --count --since="${todayStr} 00:00:00" --until="${todayStr} 23:59:59" HEAD`;
        const result = execSync(cmd, { encoding: 'utf-8', cwd }).trim();
        return parseInt(result) || 0;
    } catch {
        return 0;
    }
}

/**
 * Updates the version field in package.json with the new version number
 * 
 * @param newVersion - The new version string to set in package.json
 * @param options - Configuration options
 * @returns True if the update was successful, false if an error occurred
 * @example
 * updatePackageVersion('25.12.26-dev.3') // Updates package.json version
 */
export function updatePackageVersion(newVersion: string, options: VersionOptions = {}): boolean {
    try {
        const pkgPath = path.join(options.projectPath || process.cwd(), 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        pkg.version = newVersion;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        return true;
    } catch {
        return false;
    }
}

/**
 * Generates a new version and updates package.json in one step
 * 
 * @param releaseType - The release type (e.g., 'dev', 'beta', 'release', or custom)
 * @param options - Configuration options
 * @returns The generated version string, or null if operation failed
 * @example
 * const version = generateAndUpdateVersion('beta');
 * console.log(version); // '25.12.26-beta.3'
 */
export function generateAndUpdateVersion(releaseType: string = 'dev', options: VersionOptions = {}): string | null {
    const version = generateVersion(releaseType, options);
    if (version && updatePackageVersion(version, options)) {
        return version;
    }
    return null;
}

/**
 * Creates or updates a TypeScript version file with build metadata
 * This is optional - useful if you want a generated file in your project
 * 
 * @param version - The version string to include in the generated file
 * @param options - Configuration options with optional outputPath for custom file location
 * @returns True if the file was created successfully, false if an error occurred
 * @example
 * createVersionFile('25.12.26-dev.3') // Creates src/version.ts with build info
 * createVersionFile('1.0.0', { projectPath: './my-app', outputPath: 'lib/version.ts' })
 */
export function createVersionFile(
    version: string, 
    options: VersionOptions & { outputPath?: string } = {}
): boolean {
    try {
        const baseDir = options.projectPath || process.cwd();
        const filePath = path.join(baseDir, options.outputPath || 'src/version.ts');
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
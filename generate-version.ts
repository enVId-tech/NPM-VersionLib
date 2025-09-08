import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

type ReleaseType = "dev" | "beta" | "release";

/**
 * Generates a build version based on current date and commit count for today
 * Format: YY.MM.DD.dev/beta/release.1 (e.g., 25.08.17-dev/beta/release.commit)
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
function generateVersion(releaseType: ReleaseType): string | undefined {
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

        return "";
    } catch (err: any) {
        console.log(`An error has occurred: ${err}`);
    }
}

/**
 * Checks for commit history in Git
 */
function checkGitCount(todayStr: string): number {
    try {
        const gitCmd = `git log --since="${todayStr} 00:00:00" --until="${todayStr} 23:59:59" --oneline --count`;
        const result = execSync(gitCmd, { encoding: 'utf8', cwd: process.cwd() });

        if (result) {
            console.log(`Git command output: ${result}`);
            return result.split('\n').length;
        }

        return 1;
    } catch (err: any) {
      console.warn('Warning: Could not get git commit count, using default value 1');
      console.warn('Git error:', err.message);
      return 1;
    }
}

function main(version: ReleaseType) {
    console.log("Generating build version...");

    const generatedVersion = generateVersion(version);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const argv: string | ReleaseType | undefined = process.argv[2];

    if (argv && ["dev", "beta", "release"].includes(argv)) {
        main(argv as ReleaseType);
    } else {
        console.error('Please provide a valid release type: dev, beta, or release');
        process.exit(1);
    }
}
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Generates version: YY.MM.DD-[type].[latest commit]
 * Example: 25.12.26-dev.3
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
 * Checks for commit history in Git
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
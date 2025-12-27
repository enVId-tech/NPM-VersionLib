/**
 * NPM-VersionLib - Date and Git-based version generation library
 * 
 * A flexible library for generating semantic version numbers based on current date
 * and git commit history. Can be used programmatically or via CLI.
 * 
 * @example
 * ```typescript
 * import { generateAndUpdateVersion } from 'npm-version-lib';
 * 
 * const version = generateAndUpdateVersion('beta');
 * console.log(version); // '25.12.26-beta.3'
 * ```
 * 
 * @packageDocumentation
 */

export {
    // Core functions
    generateVersion,
    getProjectVersion,
    getVersionInfo,
    generateAndUpdateVersion,
    
    // File operations
    updatePackageVersion,
    createVersionFile,  // Optional: only call if you want a generated version.ts file
    
    // Utilities
    getGitCommitCount,
    
    // Types
    type VersionOptions,
    type VersionInfo
} from './generate-version.js';

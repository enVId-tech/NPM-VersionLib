# NPM-VersionLib

[![npm version](https://img.shields.io/npm/v/npm-version-lib.svg)](https://www.npmjs.com/package/npm-version-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight TypeScript library for automatic semantic versioning based on dates and git commits. Generate version numbers programmatically or via CLI.

## Why NPM-VersionLib?

Traditional semantic versioning requires manual updates. NPM-VersionLib automates version generation using:
- **Current date** as the version base (YY.MM.DD)
- **Git commits** for incremental build numbers
- **Release types** to differentiate development, beta, and production builds

Perfect for CI/CD pipelines, automated builds, and projects that need consistent, traceable version numbers.

## Features

- **Dual Usage** - Import as a library or use as CLI
- **Date-Based** - Versions reflect when code was built
- **Git Integration** - Tracks daily commit count automatically
- **Type Safety** - Full TypeScript support with exported types
- **Flexible** - Works with any Node.js project structure
- **Zero Config** - No setup files or configuration needed
- **Custom Types** - Use dev, beta, release, or define your own

## Version Format

Generates versions in two formats:

**Release Format (blank/empty type):** `YY.MM.DD.[commits]`  
**Development Format:** `YY.MM.DD-[type].[commits]`

| Component | Description | Example |
|-----------|-------------|------|
| `YY` | Year (last 2 digits) | `25` |
| `MM` | Month (01-12) | `12` |
| `DD` | Day (01-31) | `26` |
| `type` | Release type (optional) | `dev`, `beta`, or custom |
| `commits` | Daily commit count | `3` |

**Example Versions:**
```
25.12.26.3          → Release (no type specified)
25.12.26-dev.3      → Development, 3rd commit on Dec 26, 2025
25.12.26-beta.1     → Beta release, 1st commit today
25.12.26-alpha.2    → Custom type "alpha", 2nd commit today
```

## Installation
```bash
# As a project dependency
npm install npm-version-lib

# For development/build scripts
npm install --save-dev npm-version-lib

# Global installation (for CLI usage)
npm install -g npm-version-lib
```

**Requirements:** Node.js 14+ and Git (for commit counting) install --save-dev npm-version-lib
```

## Quick Start

### Programmatic Usage

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

// GLibrary Usage (Recommended)

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

// Generate version and update package.json
const version = generateAndUpdateVersion('beta');
console.log(version); // '25.12.26-beta.3'
```

### CLI Usage

```bash
npm-version              # Generates release version (default)
npm-version dev          # Generates dev version
npm-version beta         # Generates beta version  
npm-version alpha        # Custom type
npm-version dev 5        # Dev version with commit count = 5 (⚠️ shows warning)
npm-version 42           # Release version with commit count = 42 (shortcut)
npm-version --help       # Show help
```

**What it does:** Generates a version based on today's date and git commits, then updates your `package.json`.

**Override Commit Count:** You can manually set the commit number as a second argument (useful for testing or version fixing):
```bash
npm-version dev 10       # Dev with commit count = 10 (shows warning)
npm-version beta 5       # Beta with commit count = 5 (shows warning)
npm-version 42           # Release with commit count = 42 (shortcut syntax)
```
#### `generateVersion(releaseType, options?)`

Generates a version string based on the current date and git commits.

```typescript
const version = generateVersion('beta');
console.log(version); // '25.12.26-beta.3'
```
?, options?): string | undefined`

Generates a version string without modifying any files.

```typescript
import { generateVersion } from 'npm-version-lib';

const version = generateVersion('beta');
console.log(version); // '25.12.26-beta.3'
```

---

#### `generateAndUpdateVersion(releaseType?, options?): string | null`

Generates a version and updates `package.json` in one step. **Most common use case.**

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

const version = generateAndUpdateVersion();        // '25.12.26.5' (release)
const devVersion = generateAndUpdateVersion('dev'); // '25.12.26-dev.5'

// With manual commit count override (shows warning)
const customVersion = generateAndUpdateVersion('dev', { 
  overrideCommitCount: 10 
}); // '25.12.26-dev.10'

// Returns version string and updates package.json
```

**Default:** Empty string (generates release format)  
**Options:** `projectPath`, `silent`, `overrideCommitCount`

---

#### `getProjectVersion(options?): string | null`

Reads the current version from `package.json`.

```typescript
import { getProjectVersion } from 'npm-version-lib';

const currentVersion = getProjectVersion();
console.log(currentVersion); // '25.12.26-dev.2'
```

---

#### `getVersionInfo(releaseType?, options?): VersionInfo | null`

Returns detailed version metadata with type safety.

```typescript
import { getVersionInfo } from 'npm-version-lib';

const info = getVersionInfo(); // Release format
console.log(info);
// {
//   version: '25.12.26.5',
//   dateVersion: '25.12.26',
//   releaseType: 'release',
//   buildNumber: 5,
//   timestamp: '2025-12-26T10:30:00.000Z'
// }

const devInfo = getVersionInfo('dev');
// {
//   version: '25.12.26-dev.5',
//   dateVersion: '25.12.26',
//   releaseType: 'dev',
//   buildNumber: 5,
//   timestamp: '2025-12-26T10:30:00.000Z'
// }
```

---

#### `updatePackageVersion(version, options?): boolean`

Manually updates `package.json` with a specific version.

```typescript
import { updatePackageVersion } from 'npm-version-lib';

const success = updatePackageVersion('1.2.3-custom.1');
```

---

#### `getGitCommitCount(dateStr, options?): number`

Gets the number of git commits for a specific date.

```typescript
import { getGitCommitCount } from 'npm-version-lib';

const commits = getGitCommitCount('2025-12-26');
console.log(commits); // 5
```

---

#### `createVersionFile(version, options?): boolean` *(Optional)*

Creates a TypeScript file with version constants. Only call if you need a generated file.

```typescript
import { generateVersion, createVersionFile } from 'npm-version-lib';

const version = generateVersion('release');
if (version) {
  creage Examples

### 1. Build Scripts

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

const releaseType = process.env.RELEASE_TYPE || ''; // Empty = release
const version = generateAndUpdateVersion(releaseType);

console.log(`Building version ${version}...`);
// Proceed with build process
```

### 2. NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "version:release": "npm-version",
    "version:dev": "npm-version dev",
    "version:beta": "npm-version beta",
    "prebuild": "npm run version:release",
    "build": "tsc"
  }
}
```

Run: `npm run build` (auto-generates release version before building)

### 3. CI/CD Pipeline

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

// GitHub Actions, GitLab CI, etc.
// Empty string = release format
const version = generateAndUpdateVersion('', { silent: true });
console.log(`::set-output name=version::${version}`);
```

### 4. Display Version in App

```typescript
impHow It Works

1. **Extract Date** - Gets current date in `YY.MM.DD` format
2. **Count Commits** - Runs `git rev-list` to count today's commits
3. **Assemble Version** - Combines date + type + count:
   - Release (no type): `25.12.26.3`
   - With type: `25.12.26-beta.3`
4. **Update Files** - Writes new version to `package.json` (and optionally to `src/version.ts`)

**Fallback:** If Git is unavailable or no commits exist, commit count defaults to `0`.

## CLI Commands

The package provides two CLI aliases:

```bash
npm-version      # Main command
npm-v           # Short alias
```

Both work identically:
```bash
npm-version release
npm-v release
```

## Error Handling

The library gracefully handles common scenarios:

| Scenario | Behavior |
|----------|----------|
| No Git repository | Commit count = 0 |
| No commits today | Commit count = 0 |
| No `package.json` | Returns error, doesn't crash |
| Invalid input | Shows help message |
| File write fails | Returns `false`, logs error |

## Configuration Options

All library functions accept an optional `VersionOptions` object:

```typescript
interface VersionOptions {
  projectPath?: string;         // Path to project directory (default: cwd)
  silent?: boolean;             // Suppress console output (default: false)
  overrideCommitCount?: number; // Override git commit count (shows warning)
}
```

**Example:**
```typescript
import { generateVersion } from 'npm-version-lib';

const version = generateVersion('dev', {
  projectPath: '/path/to/project',
  silent: true,
  overrideCommitCount: 5  // Force commit count to 5 (⚠️ warning shown unless silent=true)
});
```
2. **Git Commit Count**: Counts the number of commits made on the current day using git log
3. **Version Assembly**: Combines date, release type, and commit count into a version string
4. **File Updates**: Updates package.json and creates/updates src/version.ts with the new version

If git is not available or there are no commits for the current day, the commit count defaults to 0.

## API Reference

### Functions

#### `generateVersion(releaseType: 'dev' | 'beta' | 'release'): string | undefined`

Generates a version string based on the current date and git commits.

**Parameters:**
- `releaseType`: The type of release (dev, beta, or release)

**Returns:** The generated version string or undefined if an error occurs

#### `updatePackageVersion(newVersion: string): boolean`

Updates the version field in package.json.

**Parameters:**
- `newVersion`: The version string to set

**Returns:** `true` if successful, `false` otherwise

#### `createVersionFile(version: string): boolean`

Creates or updates src/version.ts with build metadata.

**Parameters:**
- `version`: The version string to include in the file

**Returns:** `true` if successful, `false` otherwise

### Exported Constants (from src/version.ts)

- `BUILD_VERSION`: Current build version string
- `BUILD_DATE`: ISO timestamp of the build
- `BUILD_TIMESTAMP`: Unix timestamp in milliseconds
- `BUILD_INFO`: Object containing version, date, and timestamp

### Helper Functions (from src/version.ts)

- `getBuildDateString()`: Returns a localized date string
- `getVersionDisplayString()`: Returns formatted version string (e.g., "v25.09.20")

## Error Handling

The library handles various error scenarios gracefully:

- **No Git Repository**: Falls back to commit count of 0
- **No package.json**: Warns but continues with version file creation
- **File System Errors**: Logs errors and returns appropriate status codes
- **Invalid Arguments**: Shows help message and exits with error code
FAQ

**Q: Why use this over manual versioning?**  
A: Automatic versioning eliminates human error, provides consistent version numbers, and works seamlessly in CI/CD pipelines.

**Q: What's the difference between release and dev versions?**  
A: Release versions use a clean format (`25.12.26.3`) while dev/beta/custom versions include the type (`25.12.26-dev.3`).

**Q: What if I don't have Git?**  
A: The library still works—commit count will default to 0.

**Q: Can I use custom version types?**  
A: Yes! Any string without spaces works: `npm-version staging`, `npm-version canary`, etc.

**Q: Can I override the commit count?**  
A: Yes! Pass a second argument to the CLI (`npm-version dev 10`) or use the `overrideCommitCount` option in the library. A warning will be displayed when you do this.

**Q: Does it modify my Git history?**  
A: No. It only reads Git data, never writes.

## Troubleshooting

**Version shows 0 commits despite having commits:**
- Ensure Git is installed and accessible
- Check that you're in a Git repository
- Verify commits were made *today* (it counts daily commits only)

**CLI command not found:**
- Install globally: `npm install -g npm-version-lib`
- Or use with npx: `npx npm-version-lib beta`

## Contributing

Contributions welcome! 

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

[MIT](LICENSE) © [enVId-tech](https://github.com/enVId-tech)

## Links

- **NPM Package:** https://www.npmjs.com/package/npm-version-lib
- **GitHub:** https://github.com/enVId-tech/NPM-VersionLib
- **Issues:** https://github.com/enVId-tech/NPM-VersionLib/issues

---

**Built by enVId-tech**
Refactored with AI, developed by enVId Tech
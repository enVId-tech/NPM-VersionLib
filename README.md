# NPM-VersionLib

A TypeScript/JavaScript versioning library that generates build versions based on date and git commits. Use it as a CLI tool or import it programmatically into your projects.

## Features

- **Library-first design** - Use as a dependency in your Node.js/TypeScript projects
- **CLI tool included** - Also works as a command-line tool
- **Date-based versioning** - Automatic version generation based on current date
- **Git commit counting** - Incremental build numbers from daily commits
- **Multiple release types** - Support for dev, beta, release, and custom types
- **Flexible API** - Works with any project structure
- **TypeScript support** - Full TypeScript definitions included
- **Zero configuration** - Works out of the box

## Version Format

```
YY.MM.DD-[type].[commits]
```

Where:
- `YY`: Last two digits of the year
- `MM`: Month (01-12)
- `DD`: Day (01-31)
- `type`: Release type (dev, beta, release, or custom)
- `commits`: Number of commits made today

### Examples

- `25.09.20-dev.3` - Development version, 3rd commit on September 20, 2025
- `25.12.01-beta.1` - Beta version, 1st commit on December 1, 2025
- `25.10.15-release.5` - Release version, 5th commit on October 15, 2025

## Installation

### As a Project Dependency

```bash
npm install npm-version-lib
```

### Global Installation (for CLI)

```bash
npm install -g npm-version-lib
```

### Development Dependency

```bash
npm install --save-dev npm-version-lib
```

## Quick Start

### Programmatic Usage

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

// Generate and update package.json in one line
const version = generateAndUpdateVersion('beta');
console.log(version); // '25.12.26-beta.3'
```

### CLI Usage

```bash
# Generate development version (default)
npm-version
npm-version dev

# Generate beta version
npm-version beta

# Generate release version
npm-version release

# Custom version type
npm-version alpha

# Show help
npm-version --help
```

## API Reference

### Core Functions

#### `generateVersion(releaseType, options?)`

Generates a version string based on the current date and git commits.

```typescript
const version = generateVersion('beta');
console.log(version); // '25.12.26-beta.3'
```

#### `getProjectVersion(options?)`

Reads and returns the current version from package.json.

```typescript
const currentVersion = getProjectVersion();
console.log(currentVersion); // '25.12.26-dev.2'
```

#### `getVersionInfo(releaseType, options?)`

Returns detailed version information.

```typescript
const info = getVersionInfo('release');
console.log(info);
// {
//   version: '25.12.26-release.5',
//   dateVersion: '25.12.26',
//   releaseType: 'release',
//   buildNumber: 5,
//   timestamp: '2025-12-26T10:30:00.000Z'
// }
```

#### `generateAndUpdateVersion(releaseType, options?)`

Generates a version and updates package.json in one step.

```typescript
const version = generateAndUpdateVersion('beta');
// Returns the version and updates package.json
```

#### `updatePackageVersion(version, options?)`

Updates package.json with a specific version.

```typescript
updatePackageVersion('1.2.3-beta.1');
```

#### `getGitCommitCount(dateStr, options?)`

Gets the number of git commits for a specific date.

```typescript
const commits = getGitCommitCount('2025-12-26');
console.log(commits); // 5
```

#### `createVersionFile(version, options?)` (Optional)

Creates a TypeScript version file with build metadata. Only use if you want a generated file.

```typescript
// Optional: Create src/version.ts with build info
const version = generateVersion('release');
if (version) {
  createVersionFile(version);
}

// Custom output path
createVersionFile(version, { 
  outputPath: 'lib/version.ts' 
});
```

### Options

All functions accept an optional `VersionOptions` parameter:

```typescript
interface VersionOptions {
  projectPath?: string;  // Custom project directory
  silent?: boolean;      // Suppress console output
}

// Example usage
const version = generateVersion('beta', {
  projectPath: './my-project',
  silent: true
});
```

## Use Cases

### 1. In Build Scripts

```typescript
import { generateAndUpdateVersion, createVersionFile } from 'npm-version-lib';

const releaseType = process.env.RELEASE_TYPE || 'dev';
const version = generateAndUpdateVersion(releaseType);

if (version) {
  // Optional: create a version.ts file if needed
  createVersionFile(version);
  console.log(`Building version ${version}...`);
}
```

### 2. In npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "version:dev": "npm-version dev",
    "version:beta": "npm-version beta",
    "version:release": "npm-version release",
    "prebuild": "npm run version:dev"
  }
}
```

### 3. In Your Application

```typescript
import { getProjectVersion } from 'npm-version-lib';

const version = getProjectVersion();
console.log(`Running app version: ${version}`);
```

### 4. CI/CD Pipeline

```typescript
import { generateVersion, updatePackageVersion } from 'npm-version-lib';

const version = generateVersion('release', { silent: true });
if (version) {
  updatePackageVersion(version);
  // Continue with deployment
}
```

## Requirements

- Node.js 14.x or higher
- Git (for commit counting functionality)
- A package.json file in your project

## How It Works

1. **Date-based versioning**: Uses current date (YY.MM.DD) as the base version
2. **Git commit counting**: Counts commits made today to generate build number
3. **Flexible integration**: Use via CLI or import as a library
4. **No file generation required**: Version info accessed via function calls
5. **Direct version access**: Get version info via function calls
5. **Updates package.json**: Automatically updates your project version
## TypeScript Support

Full TypeScript definitions are included. Import types as needed:

```typescript
import type { VersionOptions, VersionInfo } from 'npm-version-lib';

const options: VersionOptions = {
  projectPath: './my-app',
  silent: true
};

const info: VersionInfo | null = getVersionInfo('beta', options);
```

- Node.js (v14 or higher recommended)
- Git (for commit counting functionality)
- TypeScript (included as dependency)

## How It Works

1. **Date Extraction**: Gets the current date in YY.MM.DD format
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

enVId-tech

## Links

- [npm Package](https://www.npmjs.com/package/npm-version-lib)
- [GitHub Repository](https://github.com/enVId-tech/NPM-VersionLib)
- [Issue Tracker](https://github.com/enVId-tech/NPM-VersionLib/issues)

## Notes
Refactored with AI, developed by enVId Tech
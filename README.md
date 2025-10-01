# NPM-VersionLib

A TypeScript/JavaScript versioning library that generates build versions based on date and git commits. This tool automatically creates semantic version numbers using the current date and the number of commits made on that day.

## Features

- Automatic version generation based on current date
- Git commit counting for incremental versioning
- Support for multiple release types (dev, beta, release)
- CLI tool for easy integration into build pipelines
- Automatic package.json version updates
- Auto-generated TypeScript version file with build metadata
- Colorized terminal output for better readability
- Zero configuration required

## Version Format

The library generates versions in the following format:

```
YY.MM.DD-[type].[commits]
```

Where:
- `YY`: Last two digits of the year
- `MM`: Month (01-12)
- `DD`: Day (01-31)
- `type`: Release type (dev, beta, or release)
- `commits`: Number of commits made on the current day

### Examples

- `25.09.20-dev.3` - Development version, 3rd commit on September 20, 2025
- `25.12.01-beta.1` - Beta version, 1st commit on December 1, 2025
- `25.10.15-release.5` - Release version, 5th commit on October 15, 2025

## Installation

### Global Installation

```bash
npm install -g npm-version-lib
```

### Local Installation

```bash
npm install --save-dev npm-version-lib
```

## Usage

### Command Line Interface

The library provides two CLI commands: `npm-version` and `version-gen` (aliases for the same tool).

#### Basic Usage

```bash
# Generate a development version (default)
npm-version

# Generate a development version (explicit)
npm-version dev

# Generate a beta version
npm-version beta

# Generate a release version
npm-version release
```

#### With npx (without global installation)

```bash
npx npm-version dev
npx npm-version beta
npx npm-version release
```

#### Help and Version Information

```bash
# Display help information
npm-version --help
npm-version -h

# Display current version
npm-version --version
npm-version -v
```

### Programmatic Usage

You can also use the library programmatically in your Node.js/TypeScript projects:

```typescript
import { generateVersion, updatePackageVersion, createVersionFile } from 'npm-version-lib';

// Generate a version number
const version = generateVersion('dev');
console.log(version); // e.g., "25.09.20-dev.3"

// Update package.json with the new version
updatePackageVersion(version);

// Create/update the version.ts file with build metadata
createVersionFile(version);
```

### Using Generated Version File

After running the CLI, a `src/version.ts` file is automatically created with build information:

```typescript
import { 
  BUILD_VERSION, 
  BUILD_DATE, 
  BUILD_TIMESTAMP, 
  BUILD_INFO,
  getBuildDateString,
  getVersionDisplayString 
} from './src/version';

// Use the version information in your application
console.log(`Version: ${BUILD_VERSION}`);
console.log(`Build Date: ${BUILD_DATE}`);
console.log(`Timestamp: ${BUILD_TIMESTAMP}`);

// Use helper functions
console.log(`Build Date: ${getBuildDateString()}`);
console.log(`Display Version: ${getVersionDisplayString()}`);
```

## Integration with Build Process

### npm Scripts

Add version generation to your `package.json` scripts:

```json
{
  "scripts": {
    "version:dev": "npm-version dev",
    "version:beta": "npm-version beta",
    "version:release": "npm-version release",
    "prebuild": "npm run version:dev",
    "build": "your-build-command"
  }
}
```

### CI/CD Pipeline

Integrate version generation into your CI/CD workflow:

```yaml
# Example GitHub Actions workflow
- name: Generate version
  run: npx npm-version release

- name: Build project
  run: npm run build
```

## What Gets Updated

When you run the version generation command, the following files are automatically updated:

1. **package.json**: The `version` field is updated with the new version number
2. **src/version.ts**: A TypeScript file is created/updated with:
   - `BUILD_VERSION`: The generated version string
   - `BUILD_DATE`: ISO timestamp of when the version was generated
   - `BUILD_TIMESTAMP`: Unix timestamp in milliseconds
   - `BUILD_INFO`: Object containing all build information
   - `getBuildDateString()`: Helper function for readable date format
   - `getVersionDisplayString()`: Helper function for version display

## Requirements

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

## Changelog

### 25.09.20-dev.0

- Initial release
- Date-based version generation
- Git commit counting
- CLI tool with colorized output
- Automatic package.json updates
- TypeScript version file generation
- Support for dev, beta, and release versions

# Library Usage Guide

This library can be used both as a CLI tool and programmatically in your Node.js/TypeScript projects.

## CLI Usage

```bash
# Generate dev version (default)
npm-version

# Generate beta version
npm-version beta

# Generate release version
npm-version release

# Custom version type
npm-version alpha
```

## Programmatic Usage

### Import the library

```typescript
import { 
  getProjectVersion,
  generateVersion,
  getVersionInfo,
  generateAndUpdateVersion,
  updatePackageVersion,
  createVersionFile,
  getGitCommitCount
} from 'npm-version-lib';
```

### Get current project version

```typescript
const currentVersion = getProjectVersion();
console.log(currentVersion); // '25.12.26-dev.3'
```

### Generate a new version string

```typescript
const newVersion = generateVersion('beta');
console.log(newVersion); // '25.12.26-beta.5'

// With custom project path
const version = generateVersion('release', { 
  projectPath: './my-project',
  silent: true 
});
```

### Get detailed version information

```typescript
const versionInfo = getVersionInfo('dev');
console.log(versionInfo);
// {
//   version: '25.12.26-dev.3',
//   dateVersion: '25.12.26',
//   releaseType: 'dev',
//   buildNumber: 3,
//   timestamp: '2025-12-26T10:30:00.000Z'
// }
```

### Generate and update package.json

```typescript
// Generates version and updates package.json in one step
const updatedVersion = generateAndUpdateVersion('beta');
console.log(updatedVersion); // '25.12.26-beta.5'

// Or do it manually
const version = generateVersion('dev');
if (version) {
  updatePackageVersion(version);
}
```

### Create version file (optional)

```typescript
// Creates src/version.ts with build metadata
const version = generateVersion('release');
if (version) {
  createVersionFile(version);
}

// Custom output path
createVersionFile(version, { 
  outputPath: 'lib/version.ts' 
});
```

### Get git commit count

```typescript
const commitCount = getGitCommitCount('2025-12-26');
console.log(commitCount); // 5
```

## Options

All functions accept an optional `VersionOptions` parameter:

```typescript
interface VersionOptions {
  projectPath?: string;  // Custom project directory
  silent?: boolean;      // Suppress console output
}
```

## Integration Examples

### In your build script

```typescript
import { generateAndUpdateVersion } from 'npm-version-lib';

// Update version before build
const version = generateAndUpdateVersion('release');
console.log(`Building version ${version}...`);
```

### In your CI/CD pipeline

```typescript
import { generateVersion, updatePackageVersion, createVersionFile } from 'npm-version-lib';

const releaseType = process.env.RELEASE_TYPE || 'dev';
const version = generateVersion(releaseType);

if (version) {
  updatePackageVersion(version);
  createVersionFile(version);
  console.log(`Version ${version} created for ${releaseType} release`);
}
```

### In your application

```typescript
import { getProjectVersion, getVersionInfo } from 'npm-version-lib';

// Display version in your app
const version = getProjectVersion();
console.log(`Running version: ${version}`);

// Or get full info
const info = getVersionInfo();
console.log(`App version: ${info?.version}`);
console.log(`Build date: ${info?.timestamp}`);
```

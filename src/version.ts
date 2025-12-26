// Auto-generated version file
// Do not edit manually - this file is updated by scripts/generate-version.js

export const BUILD_VERSION = '25.12.26-dev.0';
export const BUILD_DATE = '2025-12-26T20:45:39.038Z';
export const BUILD_TIMESTAMP = 1766781939038;
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
  return (`v${BUILD_VERSION}`.split('-')[0]) ?? '';
};
